import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpDashboardComponent } from './tcp-dashboard.component';

describe('TcpDashboardComponent', () => {
  let component: TcpDashboardComponent;
  let fixture: ComponentFixture<TcpDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcpDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
