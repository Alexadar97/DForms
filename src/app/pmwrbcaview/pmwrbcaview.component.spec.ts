import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmwrbcaviewComponent } from './pmwrbcaview.component';

describe('PmwrbcaviewComponent', () => {
  let component: PmwrbcaviewComponent;
  let fixture: ComponentFixture<PmwrbcaviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmwrbcaviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmwrbcaviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
