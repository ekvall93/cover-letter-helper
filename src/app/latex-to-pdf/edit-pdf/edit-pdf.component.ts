import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { debounceTimeValue } from '../constants';
import { pdfTemplateOutput, URLS } from '../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from '../services/word-processor.service';

@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrls: ['./edit-pdf.component.scss']
})
export class EditPDFComponent implements OnInit {
  @Input() Urls : URLS;
  @Input() keyWords : { [key: string]: string };
  constructor(public wordProcessor : WordProcessorService,
              private flask: FlaskService,
              private urlHandler: UrlHandlerService) { }

  keywordSelected = false;
  keyWord: string = "";
  key: string;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>;

  ngOnInit(): void {
    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(debounceTimeValue),
    switchMap(() => this.flask.updateTemplate(
                                              this.keyWords,
                                              this.Urls)))

    this.observableTemplate$.subscribe((x : pdfTemplateOutput) : void => {
      if (!x.success) {
        alert("You are using symbols that currently don't work.")
        return;
      }
      this.Urls = this.urlHandler.updateUrls(x, this.Urls);
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

  ngOnDestroy() : void {
    /* Clean up subject */
    this.templateUpdater.unsubscribe();
  }

}
