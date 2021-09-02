import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { pdfTemplateOutput, URLS } from './../latex2pdfInterface';
import {readPFDapi, deletePDFapi, applicationPDFapi} from './../constants'


@Injectable({
  providedIn: 'root'
})
export class UrlHandlerService {
  apiUrl = environment.apiUrl;
  constructor() { }

  readPDFPath(path : string): string {
    /* return this.apiUrl + readPFDapi + path + "cover.pdf"; */
    return this.apiUrl + readPFDapi + path;
  }
  readApplicationPDFPath(path : string): string {
    /* return this.apiUrl + readPFDapi + path + "cover.pdf"; */
    return this.apiUrl + applicationPDFapi + path;
  }

  

  deletePDFPath(path : string): string {
    return this.apiUrl + deletePDFapi + "/?path=" + btoa(path);
  }

  initiateUrls(x : pdfTemplateOutput) : URLS {
    let Urls = <URLS>{};
    Urls.PDFDir = x.PDFDir;
    Urls.currentProjectPath = this.readPDFPath(x.PDFDir);
    Urls.projectDir = x.projectDir;
    Urls.projectPathToDelete = this.deletePDFPath(x.projectDir);
    Urls.applicationPDFPath = this.readApplicationPDFPath(x.projectDir);
    return Urls
  }

  updateUrls(x : pdfTemplateOutput, Urls: URLS) : URLS {
    Urls.PDFDir = x.PDFDir;
    Urls.currentProjectPath = this.readPDFPath(x.PDFDir);
    return Urls
  }
}
