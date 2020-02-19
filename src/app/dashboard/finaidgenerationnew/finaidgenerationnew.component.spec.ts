import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaidgenerationnewComponent } from './finaidgenerationnew.component';

describe('FinaidgenerationnewComponent', () => {
  let component: FinaidgenerationnewComponent;
  let fixture: ComponentFixture<FinaidgenerationnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinaidgenerationnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinaidgenerationnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
