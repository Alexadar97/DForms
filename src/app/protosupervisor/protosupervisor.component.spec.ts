import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtosupervisorComponent } from './protosupervisor.component';

describe('ProtosupervisorComponent', () => {
  let component: ProtosupervisorComponent;
  let fixture: ComponentFixture<ProtosupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtosupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtosupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
