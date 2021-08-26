import { Component, OnInit } from '@angular/core';
import {URLS } from './latex2pdfInterface';

@Component({
  selector: 'app-latex-to-pdf',
  templateUrl: './latex-to-pdf.component.html',
  styleUrls: ['./latex-to-pdf.component.scss']
})
export class LatexToPDFComponent implements OnInit {
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

  ngOnInit(): void {}

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



}
