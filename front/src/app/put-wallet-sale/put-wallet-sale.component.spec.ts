import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutWalletSaleComponent } from './put-wallet-sale.component';

describe('PutWalletSaleComponent', () => {
  let component: PutWalletSaleComponent;
  let fixture: ComponentFixture<PutWalletSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutWalletSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutWalletSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
