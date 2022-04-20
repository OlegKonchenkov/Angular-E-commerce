import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FounderActionComponent } from './founder-action.component';

describe('FounderActionComponent', () => {
  let component: FounderActionComponent;
  let fixture: ComponentFixture<FounderActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FounderActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FounderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
