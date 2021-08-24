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
    return this.apiUrl + deletePDFapi + "/?path=" + btoa(path);
  }

  initiateUrls(x : pdfTemplateOutput) : URLS {
    let Urls = <URLS>{};
    Urls.pdfPath = x.pdfPath;
    Urls.currentProjectPath = this.readPDFPath(x.pdfPath);
    Urls.projectPath = x.projectPath;
    Urls.projectPathToDelete = this.deletePDFPath(x.projectPath);
    return Urls
  }

  updateUrls(x : pdfTemplateOutput, Urls: URLS) : URLS {
    Urls.pdfPath = x.pdfPath;
    Urls.currentProjectPath = this.readPDFPath(x.pdfPath);
    return Urls
  }
}
