import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationApprovalComponent } from './location-approval.component';

describe('LocationApprovalComponent', () => {
  let component: LocationApprovalComponent;
  let fixture: ComponentFixture<LocationApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
