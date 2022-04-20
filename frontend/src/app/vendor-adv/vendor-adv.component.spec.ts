import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorAdvComponent } from './vendor-adv.component';

describe('VendorAdvComponent', () => {
  let component: VendorAdvComponent;
  let fixture: ComponentFixture<VendorAdvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAdvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
