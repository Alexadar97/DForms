import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcsnewComponent } from './umcsnew.component';

describe('UmcsnewComponent', () => {
  let component: UmcsnewComponent;
  let fixture: ComponentFixture<UmcsnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcsnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcsnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
