import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  public screenHeight: number;
  container: HTMLElement;
  ngOnInit() {
    this.screenHeight = window.innerHeight;
    this.container = document.getElementById('main')
  }

  
}


