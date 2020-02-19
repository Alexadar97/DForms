import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmwrbcaComponent } from './pmwrbca.component';

describe('PmwrbcaComponent', () => {
  let component: PmwrbcaComponent;
  let fixture: ComponentFixture<PmwrbcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmwrbcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmwrbcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
