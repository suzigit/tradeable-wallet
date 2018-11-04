import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSellingComponent } from './cancel-selling.component';

describe('CancelSellingComponent', () => {
  let component: CancelSellingComponent;
  let fixture: ComponentFixture<CancelSellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
