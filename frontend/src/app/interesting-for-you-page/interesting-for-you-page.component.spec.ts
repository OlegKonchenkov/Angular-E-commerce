import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestingForYouPageComponent } from './interesting-for-you-page.component';

describe('InterestingForYouPageComponent', () => {
  let component: InterestingForYouPageComponent;
  let fixture: ComponentFixture<InterestingForYouPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestingForYouPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestingForYouPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
