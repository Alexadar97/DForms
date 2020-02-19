import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkRecalledComponent } from './pmwork-recalled.component';

describe('PmworkRecalledComponent', () => {
  let component: PmworkRecalledComponent;
  let fixture: ComponentFixture<PmworkRecalledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkRecalledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkRecalledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
