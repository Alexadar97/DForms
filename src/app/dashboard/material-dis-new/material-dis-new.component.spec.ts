import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisNewComponent } from './material-dis-new.component';

describe('MaterialDisNewComponent', () => {
  let component: MaterialDisNewComponent;
  let fixture: ComponentFixture<MaterialDisNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
