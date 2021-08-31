import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-pdf-zoom',
  templateUrl: './pdf-zoom.component.html',
  styleUrls: ['./pdf-zoom.component.scss']
})
export class PdfZoomComponent implements OnInit {
  @Output() zoomEvent = new EventEmitter<number>();
  faSearchMinus=faSearchMinus;
  faSearchPlus=faSearchPlus;
  defaultPDFZoom: number = 1;
  pdfZoom: number = this.defaultPDFZoom;

  constructor() { }

  ngOnInit(): void {
  }

  sendZoomValue(e) : void {
    this.zoomEvent.emit(e)
  }

}
