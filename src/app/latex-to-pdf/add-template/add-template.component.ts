import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { pdfTemplateOutput, URLS } from '../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from '../services/word-processor.service';
import {exampleText} from './example'

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})

export class AddTemplateComponent implements OnInit {
  @Output() newUrlsEvent = new EventEmitter<URLS>();
  @Output() newKeywordsEvent = new EventEmitter<{ [key: string]: string }>();
  @Output() newCoverLetterContent = new EventEmitter<string>();
  coverLetterContent : string = exampleText;
  Urls = <URLS>{};
  keyWords: { [key: string]: string } = {};
  constructor(private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              public wordProcessor : WordProcessorService ) { }

  ngOnInit(): void {
  }

  initPDF() : void {
    /* Send the users template to render the initial PDF */
    this.flask.addTemplate(this.coverLetterContent).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.Urls = this.urlHandler.updateUrls(x);
      this.keyWords = this.getKeywords(x.keyWords);
      this.sendItems();
    });
  }

  sendItems() : void {
    this.newUrlsEvent.emit(this.Urls);
    this.newKeywordsEvent.emit(this.keyWords);
    this.newCoverLetterContent.emit(this.coverLetterContent);
  }

  getKeywords(keyWords : string[]) : { [key: string]: string } {
    /* Gather all keywords that the user have added */
    let newKeywords : { [key: string]: string } = {};
    for (let w of keyWords) {
      newKeywords[w] = this.wordProcessor.stripKeywordSeparator(w);
    }
    return newKeywords;
  }

}
