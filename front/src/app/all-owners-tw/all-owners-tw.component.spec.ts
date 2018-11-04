import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOwnersTwComponent } from './all-owners-tw.component';

describe('AllOwnersTwComponent', () => {
  let component: AllOwnersTwComponent;
  let fixture: ComponentFixture<AllOwnersTwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOwnersTwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOwnersTwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
