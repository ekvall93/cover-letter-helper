import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { defaultStyle, keywordSelector } from '../constants';
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
  @Output() newSortedKeywordsEvent = new EventEmitter<[]>();
  coverLetterContent : string = exampleText;
  Urls = <URLS>{};
  keyWords: { [key: string]: keyWord } = {};
  sortedKeywords;
  textAreaHeight;
  constructor(private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              public wordProcessor : WordProcessorService ) { }

  ngOnInit(): void {
    /* const container = document.querySelector('.container') */
    var clientHeight = document.getElementById('main').clientHeight;

    this.textAreaHeight = String(Math.round(clientHeight * (3 / 5))) + "px";
    console.log(this.textAreaHeight);
    
  }

  verifyKeywordSelector() : boolean {
    /* Verify so there are even number of keyword selector */
    let n_keywordSelector : number = this.coverLetterContent.split(keywordSelector).length -1;
    return n_keywordSelector%2 != 0;
  }

  initPDF() : void {
    /* Send the users template to render the initial PDF */
    if (this.verifyKeywordSelector()) {
      alert("The number of keyword selectors i.e., '?@', dont match!")
      return;
    }

    this.flask.addTemplate(this.coverLetterContent, defaultStyle).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.Urls = this.urlHandler.initiateUrls(x);
      this.keyWords = this.getKeywords(x.keyWords);
      this.sortedKeywords = this.sortKeywords(this.keyWords)
      this.sendItems();
    });
  }

  sendItems() : void {
    this.newUrlsEvent.emit(this.Urls);
    this.newKeywordsEvent.emit(this.keyWords);
    this.newSortedKeywordsEvent.emit(this.sortedKeywords);
  }

  getKeywords(keyWords : { [key: string]: keyWord }) : { [key: string]: keyWord } {
    /* Gather all keywords that the user have added */
    for (let key in keyWords) {
      keyWords[key].word = this.wordProcessor.stripKeywordSeparator(keyWords[key].word);
      keyWords[key].isSelected = false
    }
    return keyWords;
  }

  sortKeywords(keyWords): any {
    var items = Object.keys(keyWords).map(function(key) {
      return [key, keyWords[key]];
    });
    // Sort the array based on the second element
    items.sort(function(first, second) {
      return first[1]["number"] - second[1]["number"];
    });
    return items
  }

  

}
