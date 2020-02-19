import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmcsDashboardComponent } from './nmcs-dashboard.component';

describe('NmcsDashboardComponent', () => {
  let component: NmcsDashboardComponent;
  let fixture: ComponentFixture<NmcsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmcsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmcsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
