import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { debounceTimeValue, fonts, defaultStyle, fontSize } from '../constants';
import { keyWord, KeyWordOptions, pdfTemplateOutput, URLS } from '../latex2pdfInterface';
import { FlaskService } from '../services/flask.service';
import { UrlHandlerService } from '../services/url-handler.service';
import { WordProcessorService } from '../services/word-processor.service';


@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrls: ['./edit-pdf.component.scss']
})
export class EditPDFComponent implements OnInit {
  @ViewChild('pdfDiv') public pdfDiv: ElementRef;


  @Input() Urls : URLS;
  @Input() keyWords : { [key: string]: keyWord };
  @Input() sortedKeywords : []
  constructor(public wordProcessor : WordProcessorService,
              private flask: FlaskService,
              private urlHandler: UrlHandlerService) { }

              

  style = defaultStyle;
  hmargin = defaultStyle.hmargin;
  vmargin = defaultStyle.vmargin;
  font = defaultStyle.font;
  fontSize = defaultStyle.fontSize;
  fontSizes = fontSize;
  fonts = fonts;
  keywordSelected = false;
  keyWord: string = "";
  key: string;
  PDFscroll: number = 0;
  defaultPDFZoom: number = 1;
  pdfZoom: number = this.defaultPDFZoom;
  templateUpdater = new Subject();
  observableTemplate$: Observable<any>;
  keyWordOptions : KeyWordOptions = {useHighlight : true, useIndexing : true}


  ngOnInit(): void {

    

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

      /* console.log(this.pdfDiv.nativeElement.scrollTop) */


      this.Urls = this.urlHandler.updateUrls(x, this.Urls);
      /* Don't need to update style no more */
      if (this.style.update) {
        this.style.update = false
      }

      /* this.setPDFscroll(); */

    });
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

  updatePDFscroll() : void {
    const container = document.querySelector('.ng2-pdf-viewer-container')
    this.PDFscroll = container.scrollTop;
    
  }
  setPDFscroll() : void {
    
    const container = document.querySelector('.ng2-pdf-viewer-container')
    container.scrollTop = this.PDFscroll;
  }

  updatePDF() : void {
    this.updatePDFscroll()
    

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

  updateFontSize() : void
  {
    /* Update font */
    this.style.fontSize= this.fontSize;
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

  sortKeywords() {
    var items = Object.keys(this.keyWords).map(function(key) {
      return [key, this.keyWords[key]];
    });
    // Sort the array based on the second element
    items.sort(function(first, second) {
      return first[1]["number"] - second[1]["number"];
    });
    return items
  }

  zoomChange(e) {
    this.pdfZoom = e.value
    
  }
/* 
  pageRendered(e) {
    console.log("hello")
    this.setPDFscroll()
  }
 */
}
