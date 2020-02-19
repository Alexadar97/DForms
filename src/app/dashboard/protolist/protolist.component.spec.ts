import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtolistComponent } from './protolist.component';

describe('ProtolistComponent', () => {
  let component: ProtolistComponent;
  let fixture: ComponentFixture<ProtolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
