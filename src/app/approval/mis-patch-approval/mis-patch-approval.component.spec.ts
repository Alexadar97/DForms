import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPatchApprovalComponent } from './mis-patch-approval.component';

describe('MisPatchApprvalComponent', () => {
  let component: MisPatchApprovalComponent;
  let fixture: ComponentFixture<MisPatchApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisPatchApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPatchApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
