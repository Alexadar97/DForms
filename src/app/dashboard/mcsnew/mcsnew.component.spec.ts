import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McsnewComponent } from './mcsnew.component';

describe('McsnewComponent', () => {
  let component: McsnewComponent;
  let fixture: ComponentFixture<McsnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McsnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McsnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
