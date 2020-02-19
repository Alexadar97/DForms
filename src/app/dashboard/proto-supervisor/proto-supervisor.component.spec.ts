import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtoSupervisorComponent } from './proto-supervisor.component';

describe('ProtoSupervisorComponent', () => {
  let component: ProtoSupervisorComponent;
  let fixture: ComponentFixture<ProtoSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtoSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
