import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtobcaviewComponent } from './protobcaview.component';

describe('ProtobcaviewComponent', () => {
  let component: ProtobcaviewComponent;
  let fixture: ComponentFixture<ProtobcaviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtobcaviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtobcaviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
