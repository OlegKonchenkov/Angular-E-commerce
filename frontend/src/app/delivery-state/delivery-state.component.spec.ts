import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryStateComponent } from './delivery-state.component';

describe('DeliveryStateComponent', () => {
  let component: DeliveryStateComponent;
  let fixture: ComponentFixture<DeliveryStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
