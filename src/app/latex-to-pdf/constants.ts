import {Fonts, Style} from "./latex2pdfInterface"
export const debounceTimeValue : number = 300;
export const readPFDapi : string = "readPDF";
export const deletePDFapi : string = "deletePDF";

export const defaultStyle : Style = {
  font : "arev",
  update : false,
  vmargin : 20,
  hmargin : 30
}

export const  fonts : Fonts[] = [
  {value: "arev", viewValue: "arev"},
{value: "avant", viewValue: "avant"},
{value: "bera", viewValue: "bera"},
{value: "bookman", viewValue: "bookman"},
{value: "cabin", viewValue: "cabin"},
{value: "chancery", viewValue: "chancery"},
{value: "charter", viewValue: "charter"},
{value: "cmbright", viewValue: "cmbright"},
{value: "concrete", viewValue: "concrete"},
{value: "courier", viewValue: "courier"},
{value: "dejavu", viewValue: "dejavu"},
{value: "drm", viewValue: "drm"},
{value: "ebgaramond", viewValue: "ebgaramond"},
{value: "euler", viewValue: "euler"},
{value: "fourier", viewValue: "fourier"},
{value: "fouriernc", viewValue: "fouriernc"},
{value: "helvet", viewValue: "helvet"},
{value: "inconsolata", viewValue: "inconsolata"},
{value: "kpfonts", viewValue: "kpfonts"},
{value: "lato", viewValue: "lato"},
{value: "libertine", viewValue: "libertine"},
{value: "librebaskerville", viewValue: "librebaskerville"},
{value: "mathdesign", viewValue: "mathdesign"},
{value: "mathpazo", viewValue: "mathpazo"},
{value: "mathptmx", viewValue: "mathptmx"},
{value: "newcent", viewValue: "newcent"},
{value: "quattrocento", viewValue: "quattrocento"},
{value: "tgadventor", viewValue: "tgadventor"},
{value: "tgbonum", viewValue: "tgbonum"},
{value: "tgchorus", viewValue: "tgchorus"},
{value: "tgcursor", viewValue: "tgcursor"},
{value: "tgheros", viewValue: "tgheros"},
{value: "tgpagella", viewValue: "tgpagella"},
{value: "tgschola", viewValue: "tgschola"},
{value: "tgtermes", viewValue: "tgtermes"},
{value: "times", viewValue: "times"},
{value: "yfonts", viewValue: "yfonts"}
]
