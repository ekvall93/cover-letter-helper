import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { KeyWordOptions, URLS } from '../../latex2pdfInterface';
import { faHighlighter,  faListOl, faPalette, faFileDownload, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { pdfFile, downloadPdfFile } from './../../constants';
declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-working-panel',
  templateUrl: './working-panel.component.html',
  styleUrls: ['./working-panel.component.scss']
})
export class WorkingPanelComponent implements OnInit {
  @Input() keyWord: string
  @Input() Urls: URLS;
  @Output() keyWordOptionsEvent = new EventEmitter<KeyWordOptions>();
  @Output() styleOptionsEvent = new EventEmitter<KeyWordOptions>();
  @Output() keywordEvent = new EventEmitter<string>();
  @Output() documentViewEvent = new EventEmitter<boolean>();

  faHighlighter=faHighlighter;
  faListOl=faListOl;
  faPalette=faPalette;
  faFileDownload=faFileDownload;
  faEdit=faEdit;
  faInfoCircle=faInfoCircle;

  editTemplate=true;

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

  downloadPDF() {
    const pdfUrl : string = this.Urls.currentProjectPath  + pdfFile as string;
    const pdfName : string = downloadPdfFile
    FileSaver.saveAs(pdfUrl, pdfName);
  }
  sendDocumentView() : void {
    this.documentViewEvent.emit(this.editTemplate)
  }
  
}
