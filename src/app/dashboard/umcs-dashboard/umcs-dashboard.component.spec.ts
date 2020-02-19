import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcsDashboardComponent } from './umcs-dashboard.component';

describe('UmcsDashboardComponent', () => {
  let component: UmcsDashboardComponent;
  let fixture: ComponentFixture<UmcsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
