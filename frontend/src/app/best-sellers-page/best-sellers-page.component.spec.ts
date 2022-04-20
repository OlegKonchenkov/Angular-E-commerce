import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellersPageComponent } from './best-sellers-page.component';

describe('BestSellersPageComponent', () => {
  let component: BestSellersPageComponent;
  let fixture: ComponentFixture<BestSellersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestSellersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSellersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
