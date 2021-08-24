import { Component, OnInit } from '@angular/core';
import { FlaskService } from './services/flask.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {pdfTemplateOutput, URLS } from './latex2pdfInterface';
import { UrlHandlerService } from './services/url-handler.service';
import { WordProcessorService } from './services/word-processor.service';
import {debounceTimeValue} from './constants'

@Component({
  selector: 'app-latex-to-pdf',
  templateUrl: './latex-to-pdf.component.html',
  styleUrls: ['./latex-to-pdf.component.scss']
})
export class LatexToPDFComponent implements OnInit {
  coverLetterContent : string;
  keyWords: { [key: string]: string } = {};
  keyWord = "";
  key: string;
  keywordSelected = false;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>

  Urls = <URLS>{};

  constructor(private flask: FlaskService,
              private urlHandler : UrlHandlerService,
              public wordProcessor : WordProcessorService) {
      this.cleanUserProject();
   }

   cleanUserProject() : void {
     /* Delete user project when closing the browser  */
    window.onbeforeunload = ()=>{
      navigator.sendBeacon(this.Urls.projectPathToDelete);
    }
   }

  ngOnInit(): void {
    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(debounceTimeValue),
    switchMap(() => this.flask.updateTemplate(this.coverLetterContent,
                                              this.keyWords,
                                              this.Urls.pdfPath)))

    this.observableTemplate$.subscribe((x : pdfTemplateOutput) : void => {
      if (!x.success) {
        alert("You are using symbols that currently don't work.")
        return;
      }
      this.Urls = this.urlHandler.updateUrls(x);
    });
  }

  selectKeyword(key : string) : void {
    /* Select the keyword that the used want to modify */
    this.keywordSelected = true;
    this.keyWord  = this.keyWords[key];
    this.key = key;
  }

  updatePDF() : void {
    /* Update the PDF with the modified keywords */
    this.keyWords[this.key] = this.keyWord
    this.templateUpdater.next();
  }

  addUrls(e: URLS) : void {
    /* Update project URLS */
    this.Urls = e;
  }

  addKeywords(e : { [key: string]: string }) : void {
    /* Update projects keywords */
    this.keyWords = e;
  }

  addCoverLetterContent(e : string) : void {
    /* Update cover letter content */
    this.coverLetterContent = e;
  }

  ngOnDestroy() : void {
    /* Clean up subject */
    this.templateUpdater.unsubscribe();
  }

}
