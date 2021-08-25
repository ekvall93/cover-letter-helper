import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { debounceTimeValue, fonts, defaultStyle } from '../constants';
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
  style = defaultStyle;
  font = "lmodern";
  fonts = fonts;
  keywordSelected = false;
  keyWord: string = "";
  key: string;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>;
  useHighlight = true;

  ngOnInit(): void {
    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(debounceTimeValue),
    switchMap(() => this.flask.updateTemplate(this.style,
                                              this.useHighlight,
                                              this.keyWords,
                                              this.Urls)))

    this.observableTemplate$.subscribe((x : pdfTemplateOutput) : void => {
      if (!x.success) {
        alert("You are using symbols that currently don't work.")
        return;
      }
      this.Urls = this.urlHandler.updateUrls(x, this.Urls);
      /* Don't need to update style no more */
      if (this.style.update) {
        this.style.update = false
      }
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
    if(this.key) {
      this.keyWords[this.key] = this.keyWord
    }
    this.templateUpdater.next();
  }

  updateFont() {
    this.style.font = this.font;
    this.style.update = true;
    this.updatePDF();
  }

  ngOnDestroy() : void {
    /* Clean up subject */
    this.templateUpdater.unsubscribe();
  }

}
