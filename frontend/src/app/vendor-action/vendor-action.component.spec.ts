import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorActionComponent } from './vendor-action.component';

describe('VendorActionComponent', () => {
  let component: VendorActionComponent;
  let fixture: ComponentFixture<VendorActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
