import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoDashboardComponent } from './sto-dashboard.component';

describe('StoDashboardComponent', () => {
  let component: StoDashboardComponent;
  let fixture: ComponentFixture<StoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
