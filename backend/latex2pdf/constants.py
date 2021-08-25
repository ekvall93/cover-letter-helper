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


class texTemplate:
  @staticmethod
  def getTexFile(font):
    _texCommand = r'''
              \makeatletter
              \renewcommand{\overset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits^{\mbox{\scriptsize #1}}}}
              \renewcommand{\underset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits_{\mbox{\scriptsize #1}}}}
              \makeatother
              '''
    return  fr'''
            \documentclass{{article}}
            \usepackage[utf8]{{inputenc}}
            \usepackage{{geometry}}
            \usepackage{{color, soul}}
            \usepackage{{lettrine}}
            \usepackage{{amsmath}}
            \usepackage[T1]{{fontenc}}
            \usepackage{{{font}}}
            \renewcommand{{\familydefault}}{{\sfdefault}}
            {_texCommand}
            \newgeometry{{vmargin={{40mm}}, hmargin={{30mm,30mm}}}}
            \title{{Cover letter -- {keywordSelector}company{keywordSelector}}}
            \author{{{keywordSelector}author{keywordSelector}}}
            \begin{{document}}
            \pagenumbering{{gobble}}
            \maketitle

            {keywordSelector}TEXT{keywordSelector}
            \newline

            \noindent
            Yours sincerly,

            \noindent
            ?@author?@


            \end{{document}}
          '''


texCommand = r'''
              \makeatletter
              \renewcommand{\overset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits^{\mbox{\scriptsize #1}}}}
              \renewcommand{\underset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits_{\mbox{\scriptsize #1}}}}
              \makeatother
              '''


texFile =   fr'''
            \documentclass{{article}}
            \usepackage[utf8]{{inputenc}}
            \usepackage{{geometry}}
            \usepackage{{color, soul}}
            \usepackage{{lettrine}}
            \usepackage{{amsmath}}
            \usepackage[B1,LY1,T1]{{fontenc}}
            \usepackage{{avant}}
            {texCommand}
            \newgeometry{{vmargin={{40mm}}, hmargin={{30mm,30mm}}}}
            \title{{Cover letter -- {keywordSelector}company{keywordSelector}}}
            \author{{{keywordSelector}author{keywordSelector}}}
            \begin{{document}}
            \pagenumbering{{gobble}}
            \maketitle

            {keywordSelector}TEXT{keywordSelector}
            \newline

            \noindent
            Yours sincerly,

            \noindent
            ?@author?@


            \end{{document}}
          '''
reserved_keywords = ["?@company?@", "?@author?@"]

specialCharsDict = {"\\" : "\\textbackslash ",
                         "%" : "\%",
                         "$" : "\$",
                         "{" : "\{",
                         "}" : "\}",
                         "_" : "\_",
                         "‡" : "\ddag ",
                         "|" : "\\textbar ",
                         ">" : "\\textgreater ",
                         "–" : "\\textendash ",
                         "™" : "\\texttrademark ",
                         "¡" : "\\textexclamdown ",
                         "£" : "\pounds",
                         "#" : "\#",
                         "&" : "\&",
                         "§" : "\S",
                         "†" : "\dag",
                         "<" : "\\textless ",
                         "—" : "\\textemdash ",
                         "®" : "\\textregistered ",
                         "¿" : "\\textquestiondown ",
                         "ⓐ" : "\\textcircled{a} ",
                         "©" : "\copyright ",
                         "∞" : "\∞"
                         }

pdfFileName = 'cover.pdf'
texFileName = 'cover.tex'
