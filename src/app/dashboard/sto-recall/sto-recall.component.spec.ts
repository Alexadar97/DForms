import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoRecallComponent } from './sto-recall.component';

describe('StoRecallComponent', () => {
  let component: StoRecallComponent;
  let fixture: ComponentFixture<StoRecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoRecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
