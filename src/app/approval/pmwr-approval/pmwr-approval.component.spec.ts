import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmwrApprovalComponent } from './pmwr-approval.component';

describe('PmwrApprovalComponent', () => {
  let component: PmwrApprovalComponent;
  let fixture: ComponentFixture<PmwrApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmwrApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmwrApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
