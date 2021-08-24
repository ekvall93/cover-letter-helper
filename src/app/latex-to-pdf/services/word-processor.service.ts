import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordProcessorService {

  constructor() { }

  stripKeywordSeparator(w: string) : string {
    /* Strip away all keyword selectors */
    return w.replaceAll("@", "")
  }
}
