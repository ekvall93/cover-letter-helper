import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { pdfTemplateOutput, URLS } from '../latex2pdfInterface';
@Injectable({
  providedIn: 'root'
})
export class UrlHandlerService {
  apiUrl = environment.apiUrl;
  constructor() { }

  readPDFPath(path : string): string {
    return this.apiUrl + "readPDF" + path;
  }

  deletePDFPath(path : string): string {
    return this.apiUrl + "deletePDF" + path;
  }

  updateUrls(x : pdfTemplateOutput) : URLS {
    let Urls = <URLS>{};
    Urls.pdfPath = x.pdfPath;
    Urls.currentProjectPath = this.readPDFPath(x.pdfPath);
    Urls.projectPathToDelete = this.deletePDFPath(x.pdfPath);
    return Urls
  }
}
