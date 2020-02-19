import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkreqlistComponent } from './pmworkreqlist.component';

describe('PmworkreqlistComponent', () => {
  let component: PmworkreqlistComponent;
  let fixture: ComponentFixture<PmworkreqlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkreqlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkreqlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
