import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { defaultStyle, keywordSelector } from './../constants';
import { pdfTemplateOutput, URLS, keyWord } from './../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from '../services/word-processor.service';
import {exampleText} from './example'
import { Editor, Toolbar } from 'ngx-editor';
import { faHighlighter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


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
  editor: Editor;

  faHighlighter=faHighlighter;

  toolbar: Toolbar = [
    ["bold"]
  ];

  constructor(private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              public wordProcessor : WordProcessorService,
              private router : Router) { }
  
  ngAfterViewInit()  {
    var node = document.querySelector('[title="Bold"]') as HTMLElement;
    node.innerHTML = "Mark keyword"
  }
  ngOnInit(): void {

    

    this.editor = new Editor();

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

  getTemplateText() : string {
    /* Preprocess ng-text-editor text */
    let text : string = this.coverLetterContent.replaceAll("<strong>", "?@").replaceAll("</strong>", "?@")
    text = text.replaceAll("<p>", "").replaceAll("</p>", "\n")
    return text
  }

  initPDF() : void {
    const text : string = this.getTemplateText()
    /* Send the users template to render the initial PDF */
    if (this.verifyKeywordSelector()) {
      alert("The number of keyword selectors i.e., '?@', dont match!")
      return;
    }

    this.flask.addTemplate(text, defaultStyle).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.Urls = this.urlHandler.initiateUrls(x);
      this.keyWords = this.getKeywords(x.keyWords);
      this.sortedKeywords = this.sortKeywords(this.keyWords)
      /* this.sendItems(); */
      this.router.navigate(["/edit-pdf"], { queryParams: {Urls: JSON.stringify(this.Urls), keyWords: JSON.stringify(this.keyWords), sortedKeywords: JSON.stringify(this.sortedKeywords)}});
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  

}
