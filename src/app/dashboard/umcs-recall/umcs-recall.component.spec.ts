import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcsRecallComponent } from './umcs-recall.component';

describe('UmcsRecallComponent', () => {
  let component: UmcsRecallComponent;
  let fixture: ComponentFixture<UmcsRecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcsRecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcsRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
