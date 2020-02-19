import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmcsApprovalComponent } from './nmcs-approval.component';

describe('NmcsApprovalComponent', () => {
  let component: NmcsApprovalComponent;
  let fixture: ComponentFixture<NmcsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmcsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmcsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
