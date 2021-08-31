import { TestBed } from '@angular/core/testing';

import { WordProcessorService } from './word-processor.service';

describe('WordProcessorService', () => {
  let service: WordProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
