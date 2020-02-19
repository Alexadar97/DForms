import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesignofflistComponent } from './vehiclesignofflist.component';

describe('VehiclesignofflistComponent', () => {
  let component: VehiclesignofflistComponent;
  let fixture: ComponentFixture<VehiclesignofflistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesignofflistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesignofflistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
