import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialissueslipuploadComponent } from './materialissueslipupload.component';

describe('MaterialissueslipuploadComponent', () => {
  let component: MaterialissueslipuploadComponent;
  let fixture: ComponentFixture<MaterialissueslipuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialissueslipuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialissueslipuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
