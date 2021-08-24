import { TestBed } from '@angular/core/testing';

import { UrlHandlerService } from './url-handler.service';

describe('UrlHandlerService', () => {
  let service: UrlHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
