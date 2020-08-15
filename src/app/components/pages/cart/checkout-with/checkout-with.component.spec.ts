import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutWithComponent } from './checkout-with.component';

describe('CheckoutWithComponent', () => {
  let component: CheckoutWithComponent;
  let fixture: ComponentFixture<CheckoutWithComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutWithComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
