import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtoDashboardComponent } from './proto-dashboard.component';

describe('ProtoDashboardComponent', () => {
  let component: ProtoDashboardComponent;
  let fixture: ComponentFixture<ProtoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
