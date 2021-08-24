import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlaskService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addTemplate(template: string): any {
    return this.httpClient.put<string[]>(this.url + 'Latex2PDFHandler/', JSON.stringify({ initProject:true, template }));
  }

  updateTemplate(template, keyWords, pdfPath): any {
    return this.httpClient.put<string[]>(this.url + 'Latex2PDFHandler/', JSON.stringify({ initProject:false, template, keyWords , pdfPath}));
  }
}
