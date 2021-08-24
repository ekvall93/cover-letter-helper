import { SafeUrl } from '@angular/platform-browser';

export interface pdfTemplateOutput {
  pdfPath?: string;
  keyWords?: string[]
  success: boolean;
  projectPath?: string;
}

export interface EditKeyword {
  key: string;
  keyWord: string
}

export interface URLS {
  currentProjectPath: SafeUrl;
  projectPathToDelete: string;
  pdfPath: string;
  projectPath: string
}
