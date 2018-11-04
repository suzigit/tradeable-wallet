import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyWalletComponent } from './buy-wallet.component';

describe('BuyWalletComponent', () => {
  let component: BuyWalletComponent;
  let fixture: ComponentFixture<BuyWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
