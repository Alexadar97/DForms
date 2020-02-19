import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtorecalleditComponent } from './protorecalledit.component';

describe('ProtorecalleditComponent', () => {
  let component: ProtorecalleditComponent;
  let fixture: ComponentFixture<ProtorecalleditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtorecalleditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtorecalleditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
