import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcseditComponent } from './umcsedit.component';

describe('UmcseditComponent', () => {
  let component: UmcseditComponent;
  let fixture: ComponentFixture<UmcseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
