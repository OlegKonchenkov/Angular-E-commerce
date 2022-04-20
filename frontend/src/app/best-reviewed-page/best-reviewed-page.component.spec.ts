import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestReviewedPageComponent } from './best-reviewed-page.component';

describe('BestReviewedPageComponent', () => {
  let component: BestReviewedPageComponent;
  let fixture: ComponentFixture<BestReviewedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestReviewedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestReviewedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
