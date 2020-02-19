import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkDashboardComponent } from './pmwork-dashboard.component';

describe('PmworkDashboardComponent', () => {
  let component: PmworkDashboardComponent;
  let fixture: ComponentFixture<PmworkDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
