import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcmsuploadComponent } from './ucmsupload.component';

describe('UcmsuploadComponent', () => {
  let component: UcmsuploadComponent;
  let fixture: ComponentFixture<UcmsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcmsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcmsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
