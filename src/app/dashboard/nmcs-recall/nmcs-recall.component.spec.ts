import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmcsRecallComponent } from './nmcs-recall.component';

describe('NmcsRecallComponent', () => {
  let component: NmcsRecallComponent;
  let fixture: ComponentFixture<NmcsRecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmcsRecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmcsRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
