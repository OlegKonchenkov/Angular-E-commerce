import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSingleProductComponent } from './card-single-product.component';

describe('CardSingleProductComponent', () => {
  let component: CardSingleProductComponent;
  let fixture: ComponentFixture<CardSingleProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSingleProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSingleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
