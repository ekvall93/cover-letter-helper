import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { defaultStyle } from '../constants';
import { pdfTemplateOutput, URLS, keyWord } from '../latex2pdfInterface';
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
  @Output() newKeywordsEvent = new EventEmitter<{ [key: string]: keyWord }>();
  coverLetterContent : string = exampleText;
  Urls = <URLS>{};
  keyWords: { [key: string]: keyWord } = {};
  constructor(private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              public wordProcessor : WordProcessorService ) { }

  ngOnInit(): void {
  }

  initPDF() : void {
    /* Send the users template to render the initial PDF */
    this.flask.addTemplate(this.coverLetterContent, defaultStyle).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.Urls = this.urlHandler.initiateUrls(x);
      this.keyWords = this.getKeywords(x.keyWords);
      console.log(this.keyWords);
      this.sendItems();
    });
  }

  sendItems() : void {
    this.newUrlsEvent.emit(this.Urls);
    this.newKeywordsEvent.emit(this.keyWords);
  }

  getKeywords(keyWords : { [key: string]: keyWord }) : { [key: string]: keyWord } {
    /* Gather all keywords that the user have added */
    for (let key in keyWords) {
      keyWords[key].word = this.wordProcessor.stripKeywordSeparator(keyWords[key].word);
    }
    return keyWords;
  }

}
