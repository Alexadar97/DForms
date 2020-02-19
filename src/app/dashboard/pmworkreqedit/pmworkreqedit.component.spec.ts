import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkreqeditComponent } from './pmworkreqedit.component';

describe('PmworkreqeditComponent', () => {
  let component: PmworkreqeditComponent;
  let fixture: ComponentFixture<PmworkreqeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkreqeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkreqeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
