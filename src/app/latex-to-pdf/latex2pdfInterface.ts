import { SafeUrl } from '@angular/platform-browser';

export interface pdfTemplateOutput {
  PDFDir?: string;
  keyWords?: { [key: string]: keyWord }
  success: boolean;
  projectDir?: string;
}

export interface EditKeyword {
  key: string;
  keyWord: string
}

export interface URLS {
  currentProjectPath: SafeUrl;
  projectPathToDelete: string;
  PDFDir: string;
  projectDir: string
}


export interface Fonts {
  value: string;
  viewValue: string;
}

export interface FontSize {
  value: number;
  viewValue: number;
}

export interface Style {
  font: string;
  update: boolean;
  vmargin: number;
  hmargin: number;
  fontSize: number;
}

export interface keyWord {
  word: string,
  number: number
  isSelected : boolean
}

export interface keyWordInfo {
  key: string,
  keyWord: keyWord
}


export interface KeyWordOptions {
  useHighlight: boolean,
  useIndexing: boolean,
  changeStyle: boolean
}
