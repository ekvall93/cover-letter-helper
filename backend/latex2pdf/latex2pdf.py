from flask import Flask, request, make_response, send_from_directory, Response, send_file
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
import json
from flask_jsonpify import jsonify
import subprocess
import os
import re
import tempfile
import shutil
import pdfkit
from .constants import texFile, texTemplate, reserved_keywords, specialCharsDict, pdfFileName, texFileName, keywordSelector, defaultPaths
from typing import List, Dict, Union
import pathlib
import random
config = pdfkit.configuration(wkhtmltopdf="/usr/local/bin/wkhtmltopdf")

class PathHandler:
    def __init__(self, paths=None):
      if not paths:
        paths = defaultPaths
      for k,v in paths.items():
        setattr(self, k, v)

class TextHandler:
  """Handles the text used for Latex and for PDF"""
  def __init__(self):
    self.reserved_keywords = reserved_keywords
    self.specialCharsDict = specialCharsDict
    self.specialChars = list(self.specialCharsDict.keys())

  def highLightKeywords(self, template):
    """Highlight all keywords in latex file"""
    keyWords = list(set(re.findall(fr'\{keywordSelector}.*?\{keywordSelector}', template)))
    for k in keyWords:
      template = template.replace(k, self.highlight(k))
    return template

  def highlight(self, word: str)->str:
    """Highlight word in latex"""
    return "\hl{" + word + "}"

  def clean_template(self, paragraphs: List[str])->List[str]:
    """Clean paragraphs from special symbols"""
    tmp_template = list()
    for paragraph in paragraphs:
      words = paragraph.split()
      tmp_words = list()
      for w in words:
        tmp_words.append(self.cleanWord(w))
      tmp_template.append(" ".join(tmp_words))
    return tmp_template

  def preProcessTemplate(self, template: str)->str:
    """Prepare the latex text by adding the used template text"""
    template = re.sub('\n+','\n',template)
    template = template.split("\n")
    template = [t for t in template if len(t)>0]
    #TODO: We need to save the clean template so we don't have to run it each time.
    template = self.clean_template(template)
    template = '\\newline \n \n \\noindent \n'.join(template)
    template = "\\noindent \n " + template
    return template

  def addMainText(self, template: str, style : Dict[str, str])->str:
    """Prepare the latex text by adding the used template text"""
    template = texTemplate.getTexFile(**style).replace(f"{keywordSelector}TEXT{keywordSelector}", template)
    return template

  def getKeyWords(self, template: str)->List[str]:
    """Find all keywords in the user's template text"""
    keyWords = re.findall(fr'\{keywordSelector}.*?\{keywordSelector}', template)
    keyWords += self.reserved_keywords
    keyWords = list(set(keyWords))
    return keyWords

  def cleanWord(self, v: str)->str:
    """Clean up the word for latex"""
    clean_word = ""
    for w in v:
      if w in self.specialChars:
        clean_word += self.specialCharsDict[w]
      else:
        clean_word += w
    return clean_word

class Latex2PDFConverter:
  """Handles the conversion from Latex to PDF"""
  def __init__(self):
    self.filesPrefixies = ['cover.log', 'cover.aux', 'cover.log']

  def _cleanConversionFiles(self, dirpath: pathlib.Path)->None:
    """Clean all files generated during conversion"""
    for filePrefix in self.filesPrefixies:
      try:
          os.unlink(dirpath + filePrefix)
      except Exception as e:
          print(e)
          pass

  def convertLatex(self, dirpath: pathlib.Path, texFile: pathlib.Path)->None:
    """Convert the Latex file to PDF"""
    cmd = ['pdflatex', '-interaction', 'nonstopmode', "-output-directory", dirpath, texFile]
    proc = subprocess.Popen(cmd)
    proc.communicate()
    retcode = proc.returncode
    if not retcode == 0:
        os.unlink(dirpath + pdfFileName)
        raise ValueError('Error {} executing command: {}'.format(retcode, ' '.join(cmd)))

class FileHandler(Latex2PDFConverter):
  """Handles all files and directories used in project"""
  def __init__(self):
    self._texFileName = texFileName
    self._pdfFileName = pdfFileName
    Latex2PDFConverter.__init__(self)

  def createTmpDir(self)->pathlib.Path:
    """Create a temporary directory"""
    dirpath = tempfile.mkdtemp()
    if not dirpath.endswith('/'):
      dirpath += "/"
    return dirpath

  def createDir(self, path: pathlib.Path, folerName: str)->pathlib.Path:
    """Create directory"""
    path = os.path.join(path, folerName)
    path = self.checkFolderEnd(path)
    os.mkdir(path)
    return path

  def writeFile(self, path: pathlib.Path, filename: str, template: str)->None:
    """Write file"""
    path = self.getFilePath(path, filename)
    with open(path,'w') as f:
      f.write(template)

  @staticmethod
  def getFilePath(path: pathlib.Path, filename: str)->pathlib.Path:
    """Get filename"""
    return os.path.join(path, filename)

  def readFile(self, path: pathlib.Path, filename: str)->str:
    """Read file"""
    path = self.getFilePath(path, filename)
    f = open(path, "r")
    return f.read()

  @staticmethod
  def checkFolderStart(path: pathlib.Path):
    """Check so that the folder starts with /"""
    if not path.startswith("/"):
      path = "/" + path
    return path

  @staticmethod
  def checkFolderEnd(path: pathlib.Path):
    """Check so that the folder ends with /"""
    if not path.endswith("/"):
      path = path + "/"
    return path

  def validateFolderPath(self, path: pathlib.Path)->None:
    """Validate folder path"""
    dir_path = os.path.dirname(path)
    dir_path = self.checkFolderStart(dir_path)
    dir_path = self.checkFolderEnd(dir_path)
    return dir_path

  def deleteFolder(self, path: pathlib.Path)->None:
    """Delete folder"""
    dir_path = os.path.dirname(path)
    if os.path.isdir(dir_path):
      shutil.rmtree(dir_path)
    else:
      print(f"{dir_path} is not a path")

class Latex2PDF(TextHandler, FileHandler):
  """Converts the the Latex file into PDF"""
  def __init__(self):
    TextHandler.__init__(self)
    FileHandler.__init__(self)
    self._texFileName = texFileName
    self._pdfFileName = pdfFileName

  def createProjectPaths(self, Paths: PathHandler)->PathHandler:
    #Create a folder for PDF-files (need a new one for everytime we re-render the PDF...)
    Paths.PDFDir = self.createDir(Paths.projectDir, str(random.getrandbits(128)))
    Paths.texFile, Paths.PDFFile = self.getFilePath(Paths.PDFDir, self._texFileName), self.getFilePath(Paths.PDFDir, self._pdfFileName)
    return Paths

  def initProjectPaths(self)->PathHandler:
    """Creates project by creating working dir, fix latex file, and create a PDF"""
    Paths = PathHandler()
    #Create working directory
    Paths.projectDir = self.createTmpDir()
    pathsDict = self.createProjectPaths(Paths)
    return pathsDict

  def createPDFFromLatex(self, Paths: PathHandler, template: str)->None:
    self.writeFile(Paths.PDFDir, self._texFileName, template)
    self.convertLatex(Paths.PDFDir, Paths.texFile)


  def initProject(self, templateText: str, style: Dict[str, str])->Dict[str, Union[pathlib.Path, List[str]]]:
    """Initiate project for user"""
    try:
      Path = self.initProjectPaths()

      templateText = self.preProcessTemplate(templateText)
      self.writeFile(Path.projectDir, "templateText.txt", templateText)
      template = self.addMainText(templateText, style)
      self.writeFile(Path.projectDir, "template.txt", template)

      #Highlight keywords after saving template
      template = self.highLightKeywords(template)
      self.createPDFFromLatex(Path, template)
      return {"success" : True, "PDFDir" : Path.PDFDir, "projectDir": Path.projectDir, "keyWords": self.getKeyWords(template)}
    except Exception as e:
      print(e)
      return {"success" : False}

  def updateStyles(self, styles: Dict[str, Union[str, bool]], oldPaths)->bool:
    projectDir = oldPaths.projectDir
    templateText = self.readFile(projectDir, "templateText.txt")
    template = self.addMainText(templateText, styles)
    self.writeFile(projectDir, "template.txt", template)


  def updateProject(self, useHighlight:bool, keyWords: Dict[str, str], oldPaths: PathHandler)->Dict[str, pathlib.Path]:
    """Update project for user"""
    PDFDir, projectDir = oldPaths.PDFDir, oldPaths.projectDir
    template = self.readFile(projectDir, "template.txt")
    for k, v in keyWords.items():
      if k.strip(f"{keywordSelector}") != v:
        clean_word = self.cleanWord(v)
        template = template.replace(k, self.highlight(clean_word) if useHighlight else clean_word)
    if useHighlight:
      template = self.highLightKeywords(template)

    Paths = PathHandler()
    Paths.projectDir = projectDir
    #Create a new dir for the PDF so we can re-render the new PDF (flask wont update otherwise....)
    Paths = self.createProjectPaths(Paths)
    try:
      self.createPDFFromLatex(Paths, template)
      #Succeeded compiling latex, delete old project
      self.deleteFolder(PDFDir)
      return {"success" : True, "PDFDir" : Paths.PDFDir}
    except Exception as e:
      print(e)
      self.deleteFolder(Paths.PDFDir)
      #Failed to compile latex, use old dir
      return {"success" : False, "PDFDir" : PDFDir}

class Latex2PDFHandler(Resource, Latex2PDF):
  def __init__(self):
    Latex2PDF.__init__(self)
  def options(self):
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

  def put(self)->Union[Dict[str, Union[pathlib.Path, List[str]]], Dict[str, pathlib.Path]]:
    queryData = request.get_json(force=True)
    initProject = queryData['initProject']
    if initProject:
      initProject, style = queryData['template'], queryData['style']
      del style["update"]
      return self.initProject(initProject, style)
    else:
      style, useHighlight, keyWords, paths = queryData["style"], queryData["useHighlight"], queryData['keyWords'], queryData['URLS']
      Paths = PathHandler(paths)

      if style["update"]:
        del style["update"]
        self.updateStyles(style, Paths)


      return self.updateProject(useHighlight, keyWords, Paths)


