import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestingForYouComponent } from './interesting-for-you.component';

describe('InterestingForYouComponent', () => {
  let component: InterestingForYouComponent;
  let fixture: ComponentFixture<InterestingForYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestingForYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestingForYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
