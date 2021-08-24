import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexToPDFComponent } from './latex-to-pdf.component';

describe('LatexToPDFComponent', () => {
  let component: LatexToPDFComponent;
  let fixture: ComponentFixture<LatexToPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatexToPDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatexToPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
