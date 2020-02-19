import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcsApprovalComponent } from './umcs-approval.component';

describe('UmcsApprovalComponent', () => {
  let component: UmcsApprovalComponent;
  let fixture: ComponentFixture<UmcsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
