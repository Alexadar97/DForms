import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtobcaComponent } from './protobca.component';

describe('ProtobcaComponent', () => {
  let component: ProtobcaComponent;
  let fixture: ComponentFixture<ProtobcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtobcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtobcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
