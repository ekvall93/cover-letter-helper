import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { debounceTimeValue, fonts, defaultStyle, fontSize } from './../constants';
import { keyWord, KeyWordOptions, pdfTemplateOutput, URLS } from './../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from './../services/word-processor.service';

@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrls: ['./edit-pdf.component.scss']
})
export class EditPDFComponent implements OnInit {
  @ViewChild('pdfDiv') public pdfDiv: ElementRef;
  
  constructor(public wordProcessor : WordProcessorService,
              private flask: FlaskService,
              private urlHandler: UrlHandlerService,
              private route: ActivatedRoute) { }
  
  Urls:URLS;
  keyWords;
  sortedKeywords;


  style = defaultStyle;
  hmargin;
  vmargin;
  font;
  fonts = fonts;
  keywordSelected = false;
  keyWord: string = "";
  key: string;
  PDFscroll: number = 0;
  defaultPDFZoom: number = 1;
  pdfZoom: number = this.defaultPDFZoom;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>;
  keyWordOptions : KeyWordOptions = {useHighlight : true, useIndexing : true, changeStyle: false}

  ngOnInit(): void {
    this.route
      .queryParams
      .subscribe(params => {
        this.Urls = JSON.parse(params["Urls"])
        this.keyWords = JSON.parse(params["keyWords"])
        this.sortedKeywords = JSON.parse(params["sortedKeywords"])
        let oldKeyWords = this.getKeyWords();
        if (oldKeyWords) {
          for (let key in oldKeyWords) {
            let value = oldKeyWords[key];
            if (key in this.keyWords) {
              this.keyWords[key].word = value.word
            }
            // Use `key` and `value`
        }

        let tmp = [];
        for (let x of this.sortedKeywords) {
          if(x[0] in oldKeyWords) {
            let y = x[1]
            y.word = oldKeyWords[x[0]].word
            tmp.push([x[0], y])

          }
        }
        this.sortedKeywords = tmp;
        }

        setTimeout(()=> {this.updatePDF()},20)
        
      });

    /* Set Debouncer on the update on PDF to avoid spam */
    this.observableTemplate$ = this.templateUpdater.pipe(debounceTime(debounceTimeValue),
    switchMap(() => this.flask.updateTemplate(this.style,
                                              this.keyWordOptions,
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

      this.saveKeyWords();

    });
  }

  saveKeyWords() : void {
    localStorage.setItem('keyWords', JSON.stringify(this.keyWords));
  }
  getKeyWords() : any {
    return JSON.parse(localStorage.getItem('keyWords'))
  }

  selectKeyword(key : string) : void {
    
    /* Select the keyword that the used want to modify */
    this.keywordSelected = true;
    this.keyWord  = this.keyWords[key].word;
    if (this.key) {
      this.keyWords[this.key].isSelected = false
    }
    this.key = key;
    this.keyWords[this.key].isSelected = true
    this.updatePDF();
  }

  setPDFleftScroll() : void {
    const container = document.querySelector('.ng2-pdf-viewer-container');
    let diff = container.scrollWidth - container.clientWidth;
    container.scrollLeft = diff / 2;
  }

  updatePDFscroll() : void {
    const container = document.querySelector('.ng2-pdf-viewer-container')
    this.PDFscroll = container.scrollTop;
    
  }
  setPDFscroll() : void {
    
    const container = document.querySelector('.ng2-pdf-viewer-container')
    container.scrollTop = this.PDFscroll;
  }

  updateKeyword(e) {
    this.keyWord = e;
    this.updatePDF();
  }

  updateStyles(e : KeyWordOptions) {
    this.keyWordOptions = e;
  }

  updateSettings(e : KeyWordOptions) {
    this.keyWordOptions = e;
    this.updatePDF();
  }

  updatePDF() : void {
    this.updatePDFscroll()
    
    /* Update the PDF with the modified keywords */
    if(this.key) {
      this.keyWords[this.key].word = this.keyWord;
      this.updateSortedKeyWords();
    }
    this.templateUpdater.next();
  }

  updateSortedKeyWords() {
    for (let i in this.sortedKeywords) {
      if(this.sortedKeywords[i][0] == this.key) {
        this.sortedKeywords[i][1].word = this.keyWord
        break;
      }
    }
  }

  updateFont(font: string) : void
  {
    /* Update font */
    this.style.font = font;
    this.style.update = true;
    this.updatePDF();
  }

  updateFontSize(fontSize: number) : void
  {
    /* Update font */
    this.style.fontSize= fontSize;
    this.style.update = true;
    this.updatePDF();
  }

  updateHmargin(e) : void {
    this.hmargin = e.value
    if (this.hmargin) {
      this.style.hmargin = this.hmargin;
      this.style.update = true;
      this.updatePDF();
    }
  }
  updateVmargin(e) : void {
    this.vmargin = e.value
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

  
  zoomChange(e) {
    this.pdfZoom = e.value
    setTimeout(()=> {this.setPDFleftScroll()},20)
    
    
  }

}
