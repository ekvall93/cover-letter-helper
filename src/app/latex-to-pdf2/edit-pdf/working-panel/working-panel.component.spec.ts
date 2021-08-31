import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPanelComponent } from './working-panel.component';

describe('WorkingPanelComponent', () => {
  let component: WorkingPanelComponent;
  let fixture: ComponentFixture<WorkingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
