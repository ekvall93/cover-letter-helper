import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FlaskService } from '../service/flask.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {exampleText} from './example'
import { Observable, Subject } from 'rxjs';
import {pdfTemplateOutput } from './latex2pdfInterface';
import { UrlHandlerService } from './services/url-handler.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {
  coverLetterContent : string = exampleText;
  currentProjectPath : SafeUrl;
  projectPathToDelete : string;
  keyWords: { [key: string]: string } = {};
  keyWord = "";
  pdfPath: string;
  key: string;
  keywordSelected = false;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>

  constructor(private flask: FlaskService, private fb: FormBuilder,
              public sanitizer: DomSanitizer, public http:HttpClient,
              private urlHandler : UrlHandlerService ) {
    /* Delete user project when closing the browser  */
    window.onbeforeunload = ()=>{
      navigator.sendBeacon(this.projectPathToDelete);
    }
   }

  ngOnInit(): void {
    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(300),
    switchMap(() => this.flask.updateTemplate(this.coverLetterContent,
                                              this.keyWords,
                                              this.pdfPath)))

    this.observableTemplate$.subscribe((x : pdfTemplateOutput) : void => {
      if (!x.success) {
        alert("You are using symbols that currently don't work.")
        return;
      }
      this.pdfPath = x.pdfPath
      this.currentProjectPath = this.urlHandler.readPDFPath(x.pdfPath);
      this.projectPathToDelete = this.urlHandler.deletePDFPath(x.pdfPath);
    });
  }

  initPDF() : void {
    /* Send the users template to render the initial PDF */
    this.flask.addTemplate(this.coverLetterContent).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.pdfPath = x.pdfPath;
      this.currentProjectPath = this.urlHandler.readPDFPath(x.pdfPath);
      this.projectPathToDelete = this.urlHandler.deletePDFPath(x.pdfPath);
      this.getKeywords(x.keyWords);
    });

  }

  getKeywords(keyWords : string[]) : void {
    /* Gather all keywords that the user have added */
      for (let w of keyWords) {
        this.keyWords[w] = this.stripKeywordSeparator(w);
      }
  }

  selectKeyword(key : string) : void {
    /* Select the keyword that the used want to modify */
    this.keywordSelected = true;
    this.keyWord  = this.keyWords[key];
    this.key = key;
  }

  updatePDF(e) : void {
    /* Update the PDF with the modified keywords */
    this.keyWords[this.key] = this.keyWord
    this.templateUpdater.next();
  }

  stripKeywordSeparator(w: string) : string {
    /* Strip away all keyword selectors */
    return w.replaceAll("@", "")
  }

  ngOnDestroy() {
    /* Clean up subject */
    this.templateUpdater.unsubscribe();
  }

}

