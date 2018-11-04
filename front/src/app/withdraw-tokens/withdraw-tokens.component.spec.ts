import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawTokensComponent } from './withdraw-tokens.component';

describe('WithdrawTokensComponent', () => {
  let component: WithdrawTokensComponent;
  let fixture: ComponentFixture<WithdrawTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
