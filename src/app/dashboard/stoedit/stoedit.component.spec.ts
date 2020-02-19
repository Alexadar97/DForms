import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoeditComponent } from './stoedit.component';

describe('StoeditComponent', () => {
  let component: StoeditComponent;
  let fixture: ComponentFixture<StoeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
