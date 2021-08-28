import { Component, OnInit } from '@angular/core';
import {URLS } from './latex2pdfInterface';

@Component({
  selector: 'app-latex-to-pdf',
  templateUrl: './latex-to-pdf.component.html',
  styleUrls: ['./latex-to-pdf.component.scss']
})
export class LatexToPDFComponent implements OnInit {
  public screenHeight: number;
  container: HTMLElement;

  coverLetterContent : string;
  keyWords: { [key: string]: string } = {};
  sortedKeywords: [];
  Urls = <URLS>{};

  constructor() {
      this.cleanUserProject();
   }

   cleanUserProject() : void {
     /* Delete user project when closing the browser  */
    window.onbeforeunload = ()=>{
      navigator.sendBeacon(this.Urls.projectPathToDelete);
    }
   }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.container = document.getElementById('main')
  }

  addUrls(e: URLS) : void {
    /* Update project URLS */
    this.Urls = e;
  }

  addKeywords(e : { [key: string]: string }) : void {
    /* Update projects keywords */
    this.keyWords = e;
  }

  addCoverLetterContent(e : string) : void {
    /* Update cover letter content */
    this.coverLetterContent = e;
  }

  addSortedKeywordsEvent(e : []) : void {
    this.sortedKeywords = e;
  }
  
  onResized(e) : void {

    console.log(e.newHeight)
    /* Call scroll function when app chnages height */
   this.scroll(e.newHeight);
  }
  scroll(appHeight: number) : void {
    /* Adjust scroll when app changes height */
    console.log(appHeight, this.screenHeight)
    let diff = appHeight - (this.screenHeight - 200);
    console.log(diff)
    if (0 < diff) {
      this.container.scrollTop = diff
    } else {
      this.container.scrollTop = 0;
    }
  }
  



}
