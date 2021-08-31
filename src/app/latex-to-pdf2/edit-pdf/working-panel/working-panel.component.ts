import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { KeyWordOptions } from '../../latex2pdfInterface';
import { faHighlighter,  faListOl, faPalette } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-working-panel',
  templateUrl: './working-panel.component.html',
  styleUrls: ['./working-panel.component.scss']
})
export class WorkingPanelComponent implements OnInit {
  @Input() keywordSelected : boolean;
  @Input() keyWord: string
  @Output() keyWordOptionsEvent = new EventEmitter<KeyWordOptions>();
  @Output() styleOptionsEvent = new EventEmitter<KeyWordOptions>();
  @Output() keywordEvent = new EventEmitter<string>();

  faHighlighter=faHighlighter;
  faListOl=faListOl;
  faPalette=faPalette;
  

  keyWordOptions : KeyWordOptions = {useHighlight : true, useIndexing : true, changeStyle: false}
  
  constructor() { }

  ngOnInit(): void {}

  sendUpdatePDF() {
    this.keyWordOptionsEvent.emit(this.keyWordOptions)
  }

  sendChangeStyle() {
    this.styleOptionsEvent.emit(this.keyWordOptions)
  }

  sendKeyword() {
    this.keywordEvent.emit(this.keyWord);
  }

  
  

}
