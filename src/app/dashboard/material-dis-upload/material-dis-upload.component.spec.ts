import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisUploadComponent } from './material-dis-upload.component';

describe('MaterialDisUploadComponent', () => {
  let component: MaterialDisUploadComponent;
  let fixture: ComponentFixture<MaterialDisUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
