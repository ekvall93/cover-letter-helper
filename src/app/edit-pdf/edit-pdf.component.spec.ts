import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPDFComponent } from './edit-pdf.component';

describe('EditPDFComponent', () => {
  let component: EditPDFComponent;
  let fixture: ComponentFixture<EditPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
