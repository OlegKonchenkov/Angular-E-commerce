import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersOfTheMomentPageComponent } from './offers-of-the-moment-page.component';

describe('OffersOfTheMomentPageComponent', () => {
  let component: OffersOfTheMomentPageComponent;
  let fixture: ComponentFixture<OffersOfTheMomentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersOfTheMomentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersOfTheMomentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
