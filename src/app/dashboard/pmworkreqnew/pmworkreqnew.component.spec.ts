import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkreqnewComponent } from './pmworkreqnew.component';

describe('PmworkreqnewComponent', () => {
  let component: PmworkreqnewComponent;
  let fixture: ComponentFixture<PmworkreqnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkreqnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkreqnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
