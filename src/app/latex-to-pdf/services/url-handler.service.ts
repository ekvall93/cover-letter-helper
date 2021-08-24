import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { pdfTemplateOutput, URLS } from '../latex2pdfInterface';
import {readPFDapi, deletePDFapi} from './../constants'


@Injectable({
  providedIn: 'root'
})
export class UrlHandlerService {
  apiUrl = environment.apiUrl;
  constructor() { }

  readPDFPath(path : string): string {
    return this.apiUrl + readPFDapi + path;
  }

  deletePDFPath(path : string): string {
    return this.apiUrl + deletePDFapi + path;
  }

  updateUrls(x : pdfTemplateOutput) : URLS {
    let Urls = <URLS>{};
    Urls.pdfPath = x.pdfPath;
    Urls.currentProjectPath = this.readPDFPath(x.pdfPath);
    Urls.projectPathToDelete = this.deletePDFPath(x.pdfPath);
    return Urls
  }
}
