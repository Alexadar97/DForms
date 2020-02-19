import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaidgenerationlistComponent } from './finaidgenerationlist.component';

describe('FinaidgenerationlistComponent', () => {
  let component: FinaidgenerationlistComponent;
  let fixture: ComponentFixture<FinaidgenerationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinaidgenerationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinaidgenerationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
