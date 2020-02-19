import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesignoffnewComponent } from './vehiclesignoffnew.component';

describe('VehiclesignoffnewComponent', () => {
  let component: VehiclesignoffnewComponent;
  let fixture: ComponentFixture<VehiclesignoffnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesignoffnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesignoffnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
