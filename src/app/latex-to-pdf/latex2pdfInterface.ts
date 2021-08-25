import { SafeUrl } from '@angular/platform-browser';

export interface pdfTemplateOutput {
  PDFDir?: string;
  keyWords?: string[]
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

export interface Style {
  font: string
  update: boolean
}
