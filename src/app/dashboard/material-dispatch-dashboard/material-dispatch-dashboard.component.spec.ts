import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDispatchDashboardComponent } from './material-dispatch-dashboard.component';

describe('MaterialDispatchDashboardComponent', () => {
  let component: MaterialDispatchDashboardComponent;
  let fixture: ComponentFixture<MaterialDispatchDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDispatchDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDispatchDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
