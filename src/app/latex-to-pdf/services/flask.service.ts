import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Style, URLS } from '../latex2pdfInterface';

@Injectable({
  providedIn: 'root'
})
export class FlaskService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addTemplate(template: string, style : Style): any {
    return this.httpClient.put<string[]>(this.url + 'Latex2PDFHandler/', JSON.stringify({ initProject:true, template, style }));
  }

  updateTemplate(style: Style, useHighlight: boolean, keyWords : { [key: string]: string }, URLS: URLS): any {
    return this.httpClient.put<string[]>(this.url + 'Latex2PDFHandler/', JSON.stringify({ initProject:false, style, useHighlight, keyWords , URLS}));
  }
}
