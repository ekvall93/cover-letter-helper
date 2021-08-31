import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfZoomComponent } from './pdf-zoom.component';

describe('PdfZoomComponent', () => {
  let component: PdfZoomComponent;
  let fixture: ComponentFixture<PdfZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
