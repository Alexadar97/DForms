import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrofitmentReportComponent } from './retrofitment-report.component';

describe('RetrofitmentReportComponent', () => {
  let component: RetrofitmentReportComponent;
  let fixture: ComponentFixture<RetrofitmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrofitmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrofitmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
