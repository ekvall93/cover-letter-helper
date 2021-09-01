from .constants import defaultPaths, keywordSelector
class KeyWordOptions:
  """Keep track on styles"""
  def __init__(self, keyword):
    for k, v in keyword.items():
      setattr(self, k, v)

class Styles:
  """Keep track on styles"""
  def __init__(self, keyword):
    for k, v in keyword.items():
      setattr(self, k, v)


class KeyWord:
  """Keep track on keyword data"""
  def __init__(self, keyword):
    for k, v in keyword.items():
      setattr(self, k, v)

class KeyWords:
  """Keep track on all keywords and its data"""
  def __init__(self, keywords):
    self._data_dict = keywords
    self._keyWords = {k : KeyWord(v) for k, v in keywords.items()}

  def __getitem__(self, key):
    return self._keyWords[key]

  def keys(self):
    return self._keyWords.keys()

  def items(self):
    return self._keyWords.items()

  @property
  def data_dict(self):
    return self._data_dict

class PathHandler:
  """Handles all necessary files- and folder paths"""
  def __init__(self, paths=None):
    if not paths:
      paths = defaultPaths
    for k,v in paths.items():
      setattr(self, k, v)



_texCommand = r'''
              \makeatletter
              \renewcommand{\overset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits^{\mbox{\scriptsize #1}}}}
              \renewcommand{\underset}[2]{\ensuremath{\mathop{\kern\z@\mbox{#2}}\limits_{\mbox{\scriptsize #1}}}}
              \makeatother
              '''

_hlc_command = r'''
                \newcommand{\hlc}[2][yellow]{{%
                \colorlet{foo}{#1}%
                \sethlcolor{foo}\hl{#2}}%
                }
                '''
class TexTemplate:
  @staticmethod
  def getTemplateTexFile(styles : Styles):
    return  fr'''
            \documentclass[{styles.fontSize}pt]{{article}}
            \usepackage[utf8]{{inputenc}}
            \usepackage{{geometry}}
            \usepackage[swedish,english]{{babel}}
            \usepackage{{xcolor}}
            \usepackage{{soul}}
            \usepackage{{textcomp}}
            {_hlc_command}
            \usepackage{{eurosym}}
            \usepackage{{lettrine}}
            \usepackage{{amsmath}}
            \usepackage[T1]{{fontenc}}
            \usepackage{{{styles.font}}}
            \renewcommand{{\familydefault}}{{\sfdefault}}
            {_texCommand}
            \newgeometry{{vmargin={{{styles.vmargin}mm}}, hmargin={{{styles.hmargin}mm,{styles.hmargin}mm}}}}
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
  @staticmethod
  def getApplicationTexFile(styles : Styles):
    return  fr'''
            \documentclass[{styles.fontSize}pt]{{article}}
            \usepackage[utf8]{{inputenc}}
            \usepackage{{geometry}}
            \usepackage[swedish,english]{{babel}}
            \usepackage{{xcolor}}
            \usepackage{{soul}}
            \usepackage{{textcomp}}
            {_hlc_command}
            \usepackage{{eurosym}}
            \usepackage{{lettrine}}
            \usepackage{{amsmath}}
            \usepackage[T1]{{fontenc}}
            \usepackage{{{styles.font}}}
            \renewcommand{{\familydefault}}{{\sfdefault}}
            {_texCommand}
            \newgeometry{{vmargin={{{styles.vmargin}mm}}, hmargin={{{styles.hmargin}mm,{styles.hmargin}mm}}}}
            \title{{Application text}}
            \begin{{document}}
            \pagenumbering{{gobble}}


            {keywordSelector}TEXT{keywordSelector}

            \end{{document}}
          '''
