import { TestBed } from '@angular/core/testing';

import { UrlKeeperService } from './url-keeper.service';

describe('UrlKeeperService', () => {
  let service: UrlKeeperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlKeeperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
