import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPanelComponent } from './initial-panel.component';

describe('InitialPanelComponent', () => {
  let component: InitialPanelComponent;
  let fixture: ComponentFixture<InitialPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
