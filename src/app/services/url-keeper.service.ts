import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlKeeperService {
  private paramSource = new BehaviorSubject("");
  urlKeeper = this.paramSource.asObservable();
  setParam(param:string) { this.paramSource.next(param)}    


  constructor() { }
}
