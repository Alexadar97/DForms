import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtoSupervisortypeComponent } from './proto-supervisortype.component';

describe('ProtoSupervisortypeComponent', () => {
  let component: ProtoSupervisortypeComponent;
  let fixture: ComponentFixture<ProtoSupervisortypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtoSupervisortypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoSupervisortypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
