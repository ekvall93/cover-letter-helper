import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { defaultStyle, fontSize, fonts } from '../../constants';

import { faFont, faTextHeight, faArrowsAltH, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-style-panel',
  templateUrl: './style-panel.component.html',
  styleUrls: ['./style-panel.component.scss']
})
export class StylePanelComponent implements OnInit {
  @Output() hmarginEvent = new EventEmitter<number>();
  @Output() vmarginEvent = new EventEmitter<number>();
  @Output() fontSizeEvent = new EventEmitter<number>();
  @Output() fontEvent = new EventEmitter<string>();

  hmargin : number = defaultStyle.hmargin;
  vmargin : number = defaultStyle.vmargin;

  fontSize : number = defaultStyle.fontSize;
  fontSizes = fontSize;
  font : string = defaultStyle.font;
  fonts = fonts;

  faFont=faFont;
  faTextHeight=faTextHeight;
  faArrowsAltH=faArrowsAltH;
  faArrowsAltV=faArrowsAltV;

  constructor() { }

  ngOnInit(): void {
  }

  sendHmargin(e : number) : void {
    this.hmarginEvent.emit(e)
  }

  sendVmargin(e : number) : void {
    this.vmarginEvent.emit(e)
  }

  sendFontSize() : void {
    this.fontSizeEvent.emit(this.fontSize)
  }

  sendFont() : void {
    
    this.fontEvent.emit(this.font)
  }

}
