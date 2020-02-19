import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinasworklistComponent } from './finasworklist.component';

describe('FinasworklistComponent', () => {
  let component: FinasworklistComponent;
  let fixture: ComponentFixture<FinasworklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinasworklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinasworklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
