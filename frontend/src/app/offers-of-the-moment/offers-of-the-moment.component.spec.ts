import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersOfTheMomentComponent } from './offers-of-the-moment.component';

describe('OffersOfTheMomentComponent', () => {
  let component: OffersOfTheMomentComponent;
  let fixture: ComponentFixture<OffersOfTheMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersOfTheMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersOfTheMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
