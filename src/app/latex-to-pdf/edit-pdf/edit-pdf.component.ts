import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { debounceTimeValue, fonts, defaultStyle } from '../constants';
import { keyWord, KeyWordMarkdown, pdfTemplateOutput, URLS } from '../latex2pdfInterface';
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
  @Input() keyWords : { [key: string]: keyWord };
  constructor(public wordProcessor : WordProcessorService,
              private flask: FlaskService,
              private urlHandler: UrlHandlerService) { }
  style = defaultStyle;
  hmargin = defaultStyle.hmargin;
  vmargin = defaultStyle.vmargin;
  font = defaultStyle.font;
  fonts = fonts;
  keywordSelected = false;
  keyWord: string = "";
  key: string;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>;
  keyWordMarkdown : KeyWordMarkdown = {useHighlight : true, useIndexing : true}


  ngOnInit(): void {
    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(debounceTimeValue),
    switchMap(() => this.flask.updateTemplate(this.style,
                                              this.keyWordMarkdown,
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
    this.keyWord  = this.keyWords[key].word;
    this.key = key;

  }

  updatePDF() : void {
    /* Update the PDF with the modified keywords */
    if(this.key) {
      this.keyWords[this.key].word = this.keyWord
    }
    this.templateUpdater.next();
  }

  updateFont() : void
  {
    /* Update font */
    this.style.font = this.font;
    this.style.update = true;
    this.updatePDF();
  }

  updateHmargin() : void {
    if (this.hmargin) {
      this.style.hmargin = this.hmargin;
      this.style.update = true;
      this.updatePDF();
    }
  }
  updateVmargin() : void {
    if (this.vmargin) {
      this.style.vmargin = this.vmargin;
      this.style.update = true;
      this.updatePDF();
    }
  }

  ngOnDestroy() : void {
    /* Clean up subject */
    this.templateUpdater.unsubscribe();
  }

}
