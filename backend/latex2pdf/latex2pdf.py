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
from .constants import reserved_keywords, specialCharsDict, pdfFileName, texFileName, keywordSelector, defaultPaths, yellowHLPrefix, blueHLPrefix
from typing import List, Dict, Union
import pathlib
import random
from .interface import KeyWordOptions, Styles, KeyWord, KeyWords, PathHandler, TexTemplate
import copy
from .markText import MarkText
from .constants import startTag, endTag
def getWkhtmltopdfPath():
  x = os.popen("which wkhtmltopdf")
  s = x.read()
  return s.strip()

config = pdfkit.configuration(wkhtmltopdf=getWkhtmltopdfPath())

class TextHandler:
  """Handles the text used for Latex and for PDF"""
  def __init__(self):
    self.reserved_keywords = reserved_keywords
    self.specialCharsDict = specialCharsDict
    self.specialChars = list(self.specialCharsDict.keys())

  def modifyKeyword(self, template: str, keyWords:KeyWords, keyWordOptions: KeyWordOptions, initProject: bool =False)->str:
    """ Add highlight and indexing if the user want. """
    for k, v in keyWords.items():
      #If the keyWord is zero we add the key as placeholder
      if len(v.word.strip()) == 0:
        v.word = k.strip(keywordSelector)
      clean_word = self.cleanWord(v.word)
      if initProject:
        clean_word = clean_word.strip(keywordSelector)
      template = template.replace(k, self.setKeywordOptions(clean_word, keyWordOptions, v))
    return template

  def indexKeyword(self, word: str, keyWord: KeyWord):
    return "\overset{{\large" + keyWord.number + "}}{{" + word + "}}"

  def setKeyWordSentence(self, words: List[str], keyWord: KeyWord):
    """ Fix markup for keyword if it's a senctence  """
    #Set index and highligt on the first word
    w1  = self.highlight(words[0], keyWord.isSelected)
    w1 = self.indexKeyword(w1, keyWord)
    #Set highlight on the rest of the sentence
    w2  = self.highlight(" ".join(words[1:]), keyWord.isSelected)
    #Highligt space between the first word and rest of sentence
    space  = self.highlight(" ", keyWord.isSelected)
    #Combine
    word = w1 + space + w2
    return word

  def setKeywordOptions(self, word: str, keyWordOptions: KeyWordOptions, keyWord: KeyWord)->str:
    """Add keyword markdown"""
    words = word.split(" ")
    if keyWordOptions.useHighlight and keyWordOptions.useIndexing and len(words)>1:
      return self.setKeyWordSentence(words, keyWord)
    if keyWordOptions.useHighlight:
      word = self.highlight(word, keyWord.isSelected)
    if keyWordOptions.useIndexing:
      word = self.indexKeyword(word, keyWord)
    return word

  def highlight(self, word: str, isSelected=False)->str:
    """Highlight word in latex"""
    if isSelected:
      return blueHLPrefix + word + "}"
    else:
      return yellowHLPrefix + word + "}"

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

  def addMainTextTemplate(self, template: str, styles : Styles)->str:
    """Prepare the latex text by adding the used template text"""
    template = TexTemplate.getTemplateTexFile(styles).replace(f"{keywordSelector}TEXT{keywordSelector}", template)
    return template

  def addMainTextApplication(self, template: str, styles : Styles)->str:
    """Prepare the latex text by adding the used template text"""
    template = TexTemplate.getApplicationTexFile(styles).replace(f"{keywordSelector}TEXT{keywordSelector}", template)
    return template

  def getKeyWords(self, template: str)->KeyWords:
    """Find all keywords in the user's template text"""
    _keyWords = re.findall(fr'\{keywordSelector}.*?\{keywordSelector}', template)
    keyWords = copy.deepcopy(self.reserved_keywords)
    #Loop to keep order.
    for w in _keyWords:
      if w not in keyWords:
        keyWords.append(w)
    return KeyWords({w : {"number" : str(i + 1), "word" : w, "isSelected": False} for i, w in enumerate(keyWords)})

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

  def convertLatex(self, dirpath: pathlib.Path, texFile: pathlib.Path, pdfFile: str)->None:
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
    """ Create a folder for PDF-files (need a new one for everytime we re-render the PDF...) """
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

  def createTemplatePDFFromLatex(self, Paths: PathHandler, template: str)->None:
    """Write latex file, and the convert it into PDF"""
    self.writeFile(Paths.PDFDir, self._texFileName, template)
    self.convertLatex(Paths.PDFDir, Paths.texFile, pdfFileName)

  def createApplicationPDFFromLatex(self, Paths: PathHandler, application: str)->None:
    """Write latex file, and the convert it into PDF"""
    self.writeFile(Paths.projectDir, "applicationn.tex", application)
    self.convertLatex(Paths.projectDir, Paths.projectDir + "applicationn.tex", "applicationn.pdf")

  def initProject(self, templateText: str, applicationText : str, styles: Styles)->Dict[str, Union[pathlib.Path, List[str]]]:
    """Initiate project for user"""
    try:
      Path = self.initProjectPaths()
      templateText = self.preProcessTemplate(templateText)
      self.writeFile(Path.projectDir, "templateText.txt", templateText)
      template = self.addMainTextTemplate(templateText, styles)
      self.writeFile(Path.projectDir, "template.txt", template)
      keyWords = self.getKeyWords(template)
      keyWordOptions = KeyWordOptions({"useIndexing": True, "useHighlight" : True})
      template = self.modifyKeyword(template, keyWords, keyWordOptions, True)
      self.createTemplatePDFFromLatex(Path, template)


      applicationText = MarkText().markText(applicationText)
      applicationText = self.preProcessTemplate(applicationText)
      applicationText = applicationText.replace(startTag, "\hl{").replace(endTag, "}")
      #print(applicationText)

      applicationTex = self.addMainTextTemplate(applicationText, styles)

      Path = self.createApplicationPDFFromLatex(Path, applicationTex)

      return {"success" : True, "PDFDir" : Path.PDFDir, "projectDir": Path.projectDir, "keyWords": keyWords.data_dict}
    except Exception as e:
      print(e)
      return {"success" : False}

  def updateStyles(self, styles: Styles, oldPaths)->bool:
    """Update styles in latex template, and save it for future updates"""
    projectDir = oldPaths.projectDir
    templateText = self.readFile(projectDir, "templateText.txt")
    template = self.addMainText(templateText, styles)
    self.writeFile(projectDir, "template.txt", template)

  def updateProject(self, keyWordOptions:KeyWordOptions, keyWords: KeyWords, oldPaths: PathHandler)->Dict[str, pathlib.Path]:
    """Update project for user"""
    PDFDir, projectDir = oldPaths.PDFDir, oldPaths.projectDir
    template = self.readFile(projectDir, "template.txt")
    template = self.modifyKeyword(template, keyWords, keyWordOptions)
    Paths = PathHandler()
    Paths.projectDir = projectDir
    #Create a new dir for the PDF so we can re-render the new PDF (flask wont update otherwise....)
    Paths = self.createProjectPaths(Paths)
    try:
      self.createTemplatePDFFromLatex(Paths, template)
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
      initProject, styles, application = queryData['template'], Styles(queryData['style']), queryData['application']
      """ print(MarkText().markText(application)) """
      #print(application)
      return self.initProject(initProject, application, styles)
    else:
      styles, keyWordOptions, keyWords, Paths = Styles(queryData["style"]), KeyWordOptions(queryData["keyWordOptions"]), KeyWords(queryData['keyWords']), PathHandler(queryData['URLS'])
      if styles.update:
        self.updateStyles(styles, Paths)
      return self.updateProject(keyWordOptions, keyWords, Paths)


