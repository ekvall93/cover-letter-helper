import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UrlKeeperService } from './services/url-keeper.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  container: HTMLElement;
  public href: string;
  deviceInfo;
  isDesktopDevice
  constructor(private router: Router, private urlKepeer: UrlKeeperService, private deviceService: DeviceDetectorService) {

  }
  ngOnInit() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isDesktopDevice = this.deviceService.isDesktop();
    this.href = this.router.url;
    this.urlKepeer.urlKeeper.subscribe(data=> { this.href=data }) 
  }

  
}


