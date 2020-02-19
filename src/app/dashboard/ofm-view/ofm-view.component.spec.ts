import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfmViewComponent } from './ofm-view.component';

describe('OfmViewComponent', () => {
  let component: OfmViewComponent;
  let fixture: ComponentFixture<OfmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
