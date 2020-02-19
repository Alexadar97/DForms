import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtoApprovalComponent } from './proto-approval.component';

describe('ProtoApprovalComponent', () => {
  let component: ProtoApprovalComponent;
  let fixture: ComponentFixture<ProtoApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtoApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
