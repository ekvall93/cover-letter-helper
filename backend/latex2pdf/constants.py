from typing import List

"""
Need python3.8 :(

from typing import TypedDict
class InitialProject(TypedDict):
    pdfPath: str
    keyWords: List[str]

class UpdatedProject(TypedDict):s
    pdfPath: str """

texFile = r'''
          \documentclass{article}
          \usepackage[utf8]{inputenc}
          \usepackage{geometry}
          \newgeometry{vmargin={40mm}, hmargin={30mm,30mm}}

          \title{Cover letter -- @company@}
          \author{@author@}
          \begin{document}
          \pagenumbering{gobble}
          \maketitle

          @TEXT@
          \newline

          \noindent
          Yours sincerly,

          \noindent
          @author@


          \end{document}
        '''

reserved_keywords = ["@company@", "@author@"]

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
                         "&" : "\& ",
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
