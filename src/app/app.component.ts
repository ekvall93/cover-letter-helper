import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UrlKeeperService } from './services/url-keeper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  container: HTMLElement;
  public href: string;

  constructor(private router: Router, private urlKepeer: UrlKeeperService) {

  }
  ngOnInit() {
    this.href = this.router.url;
    this.urlKepeer.urlKeeper.subscribe(data=> { this.href=data }) 
  }

  
}


