from typing import List
"""
Need python3.8 :(

from typing import TypedDict
class InitialProject(TypedDict):
    pdfPath: str
    keyWords: List[str]

class UpdatedProject(TypedDict):s
    pdfPath: str """

defaultPaths = {"PDFDir": None, "projectDir": None, "texFile": None, "PDFFile": None}


keywordSelector = "?@"
yellowHLPrefix = "\hl{"
blueHLPrefix = "\hlc[cyan!50]{"

reserved_keywords = ["?@company?@", "?@author?@"]

specialCharsDict = {"\\" : r"\textbackslash ",
                         "%" : r"\%",
                         "$" : r"\$",
                         "{" : r"\{",
                         "}" : r"\}",
                         "_" : r"\_",
                         "‡" : r"\ddag ",
                         "|" : r"\textbar ",
                         ">" : r"\textgreater ",
                         "–" : r"\textendash ",
                         "™" : r"\texttrademark ",
                         "¡" : r"\textexclamdown ",
                         "£" : r"\pounds",
                         "#" : r"\#",
                         "&" : r"\&",
                         "§" : r"\S",
                         "†" : r"\dag",
                         "<" : r"\textless ",
                         "—" : r"\textemdash ",
                         "®" : r"\textregistered ",
                         "¿" : r"\textquestiondown ",
                         "ⓐ" : r"\textcircled{a} ",
                         "©" : "\copyright ",
                         "∞" : r"$\infty$",
                         "€" : r"\euro{}",
                         "°" : r"\textdegree",
                         "å" : r"\aa",
                         "Å" : r"\AA",
                         "ä" : r'\"a',
                         "Ä" : r'\"A',
                         "ö" : r'\"o',
                         "Ö" : r'\"O'}

pdfFileName = 'cover.pdf'
texFileName = 'cover.tex'
