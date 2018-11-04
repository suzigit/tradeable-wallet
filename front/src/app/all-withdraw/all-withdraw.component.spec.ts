import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWithdrawComponent } from './all-withdraw.component';

describe('AllWithdrawComponent', () => {
  let component: AllWithdrawComponent;
  let fixture: ComponentFixture<AllWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
