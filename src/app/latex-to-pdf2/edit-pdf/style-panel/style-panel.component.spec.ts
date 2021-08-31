import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylePanelComponent } from './style-panel.component';

describe('StylePanelComponent', () => {
  let component: StylePanelComponent;
  let fixture: ComponentFixture<StylePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StylePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StylePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
