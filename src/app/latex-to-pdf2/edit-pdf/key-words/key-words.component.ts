import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { keyWord } from '../../latex2pdfInterface';


@Component({
  selector: 'app-key-words',
  templateUrl: './key-words.component.html',
  styleUrls: ['./key-words.component.scss']
})
export class KeyWordsComponent implements OnInit {
  @Input() keyWords : { [key: string]: keyWord };
  @Output() selectedKeyWordsEvent = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  sendKeyWord(word: string) {
    this.selectedKeyWordsEvent.emit(word)
  }

}
