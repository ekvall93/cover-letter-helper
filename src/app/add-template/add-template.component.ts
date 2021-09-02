import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { defaultStyle, keywordSelector } from './../constants';
import { pdfTemplateOutput, URLS, keyWord } from './../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from '../services/word-processor.service';
import {exampleText, exampleTextPreProcessed, exampleApplicationText, exampleApplicationTextPreProcessed} from './example'
import { Editor, Toolbar } from 'ngx-editor';
import { faHighlighter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UrlKeeperService } from '../services/url-keeper.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExplanationComponent } from './explanation/explanation.component';


@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})

export class AddTemplateComponent implements OnInit {
  exampleTextPreProcessed :string  = exampleTextPreProcessed;
  exampleApplicationTextPreProcessed : string = exampleApplicationTextPreProcessed;
  coverLetterContent: string;
  applicationContent: string;
  Urls = <URLS>{};
  keyWords: { [key: string]: keyWord } = {};
  sortedKeywords;
  textAreaHeight;
  editor: Editor;
  faHighlighter=faHighlighter;
  showCoverletter : boolean = true

  toolbarCoverletter: Toolbar = [
    ["bold"]
  ];

  toolbarApplication: Toolbar = [
    []
  ];

  constructor(private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              public wordProcessor : WordProcessorService,
              private router : Router, private urlKepeer: UrlKeeperService, 
              public dialog: MatDialog,
              public ngZone : NgZone) { }
  
  ngAfterViewInit()  {
    this.setNgxEditorButtonText()
  }

  setNgxEditorButtonText() {
    setTimeout(() => {
      var node = document.querySelector('[title="Bold"]') as HTMLElement;
    node.innerHTML = "Mark keyword"
    }, 5)
    
  }
  ngOnInit(): void {

    this.setTemplate();
    this.setAppliction();

    this.editor = new Editor();

    /* const container = document.querySelector('.container') */
    var clientHeight = document.getElementById('main').clientHeight;

    this.textAreaHeight = String(Math.round(clientHeight * (3 / 5))) + "px";
  }

  setTemplate() : void {
    /* Set template */
    var userTemplate = localStorage.getItem('userTemplate');
    if (userTemplate) {
      this.coverLetterContent = userTemplate;
    } else {
      this.coverLetterContent = exampleText;
    }
  }

  setAppliction() : void {
    var applicationText = localStorage.getItem('userApplication');
    if (applicationText) {
      this.applicationContent = applicationText;
    } else {
      this.applicationContent = exampleApplicationText;
    }
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

  getApplicationText() : string {
    let text : string = this.applicationContent.replaceAll("<p>", "").replaceAll("</p>", "\n")
    return text
  }

  saveUserTemplate(t : string) : void {
    /* Save the users template */
    if (this.exampleTextPreProcessed.trim() != t.trim()) {
      localStorage.setItem('userTemplate', this.coverLetterContent)
    }
  }

  saveUserApplication(t : string) : void {
    /* Save the users template */
    if (this.exampleApplicationTextPreProcessed.trim() != t.trim()) {
      console.log("WORKED")
      localStorage.setItem('userApplication', this.applicationContent)
    }
  }

  initPDF() : void {
    /* console.log(this.exampleText == this.coverLetterContent) */
    const coverLetterText : string = this.getTemplateText();
    const applictionText : string = this.getApplicationText();
    
    this.saveUserTemplate(coverLetterText);
    this.saveUserApplication(applictionText);
    /* Send the users template to render the initial PDF */
    if (this.verifyKeywordSelector()) {
      alert("The number of keyword selectors i.e., '?@', dont match!")
      return;
    }

    this.flask.addTemplate(coverLetterText, defaultStyle, applictionText).subscribe((x:pdfTemplateOutput) => {
      if (!x.success) {
        alert("Your template contains symbols not compatible yet.")
        return;
      }
      this.Urls = this.urlHandler.initiateUrls(x);
      this.keyWords = this.getKeywords(x.keyWords);
      this.sortedKeywords = this.sortKeywords(this.keyWords)
      

      this.urlKepeer.setParam('/edit-pdf');

      this.router.navigate(["/edit-pdf"], { queryParams: {Urls: JSON.stringify(this.Urls), keyWords: JSON.stringify(this.keyWords), sortedKeywords: JSON.stringify(this.sortedKeywords)}});
    });
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

  openDialog() {

    this.ngZone.run(() => {
    let dialogRef = this.dialog.open(ExplanationComponent);
    })

    /* dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    }); */
  }
}
