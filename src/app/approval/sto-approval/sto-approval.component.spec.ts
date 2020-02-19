import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoApprovalComponent } from './sto-approval.component';

describe('StoApprovalComponent', () => {
  let component: StoApprovalComponent;
  let fixture: ComponentFixture<StoApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
