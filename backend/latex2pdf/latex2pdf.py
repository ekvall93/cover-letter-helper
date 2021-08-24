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
from .constants import texFile, reserved_keywords, specialCharsDict, pdfFileName, texFileName
from typing import List, Dict, Union
import pathlib
config = pdfkit.configuration(wkhtmltopdf="/usr/local/bin/wkhtmltopdf")

class TextHandler:
  """Handles the text used for Latex and for PDF"""
  def __init__(self):
    self.reserved_keywords = reserved_keywords
    self.specialCharsDict = specialCharsDict
    self.specialChars = list(self.specialCharsDict.keys())

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

  def addMainText(self, template: str)->str:
    """Prepare the latex text by adding the used template text"""
    template = re.sub('\n+','\n',template)
    template = template.split("\n")
    template = [t for t in template if len(t)>0]
    #TODO: We need to save the clean template so we don't have to run it each time.
    template = self.clean_template(template)
    template = '\\newline \n \n \\noindent \n'.join(template)
    template = "\\noindent \n " + template
    template = texFile.replace("@TEXT@", template)
    return template

  def getKeyWords(self, template: str)->List[str]:
    """Find all keywords in the user's template text"""
    keyWords = re.findall(r'\@.*?\@', template)
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

  def convertLatex(self, dirpath: pathlib.Path, coverFile: pathlib.Path)->None:
    """Convert the Latex file to PDF"""
    cmd = ['pdflatex', '-interaction', 'nonstopmode', "-output-directory", dirpath, coverFile]
    proc = subprocess.Popen(cmd)
    proc.communicate()
    retcode = proc.returncode
    if not retcode == 0:
        os.unlink(dirpath + pdfFileName)
        raise ValueError('Error {} executing command: {}'.format(retcode, ' '.join(cmd)))
    #self._cleanConversionFiles(dirpath)

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

  @staticmethod
  def writeTexFile(coverFile: pathlib.Path, template: str)->None:
    """Write file"""
    with open(coverFile,'w') as f:
      f.write(template)

  @staticmethod
  def checkFolderStart(path):
    """Check so that the folder starts with /"""
    if not path.startswith("/"):
      path = "/" + path
    return path

  @staticmethod
  def checkFolderEnd(path):
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
    dir_path = self.checkFolderEnd(dir_path)
    shutil.rmtree(dir_path)

class Latex2PDF(TextHandler, FileHandler):
  """Converts the the Latex file into PDF"""
  def __init__(self):
    TextHandler.__init__(self)
    FileHandler.__init__(self)
    self._texFileName = texFileName
    self._pdfFileName = pdfFileName

  def createProject(self, template: str)->pathlib.Path:
    """Creates project by creating working dir, fix latex file, and create a PDF"""
    dirpath = self.createTmpDir()
    coverFile, coverPDF = dirpath + self._texFileName, dirpath + self._pdfFileName
    self.writeTexFile(coverFile, template)
    self.convertLatex(dirpath, coverFile)
    return coverPDF

  def initProject(self, template: str)->Dict[str, Union[pathlib.Path, List[str]]]:
    """Initiate project for user"""
    try:
      template = self.addMainText(template)
      return {"success" : True, "pdfPath" : self.createProject(template), "keyWords": self.getKeyWords(template)}
    except Exception as e:
      print(e)
      return {"success" : False}

  def updateProject(self, template: str, keyWords: Dict[str, str], pdfPath: pathlib.Path)->Dict[str, pathlib.Path]:
    """Update project for user"""
    template = self.addMainText(template)
    for k, v in keyWords.items():
      if k.strip("@") != v:
        clean_word = self.cleanWord(v)
        template = template.replace(k, clean_word)
    try:
      path = self.createProject(template)
      #Succeeded compiling latex, delete old project
      self.deleteFolder(pdfPath)
      return {"success" : True, "pdfPath" : path }
    except Exception as e:
      #Failed to compile latex, use old dir
      return {"success" : False, "pdfPath" : pdfPath }

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
      template = queryData['template']
      return self.initProject(template)
    else:
      template, keyWords, pdfPath = queryData["template"], queryData['keyWords'], queryData['pdfPath']
      return self.updateProject(template, keyWords, pdfPath)


