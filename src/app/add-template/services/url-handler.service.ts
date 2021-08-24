import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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
}
