import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McseditComponent } from './mcsedit.component';

describe('McseditComponent', () => {
  let component: McseditComponent;
  let fixture: ComponentFixture<McseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
