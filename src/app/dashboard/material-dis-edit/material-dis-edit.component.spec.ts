import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisEditComponent } from './material-dis-edit.component';

describe('MaterialDisEditComponent', () => {
  let component: MaterialDisEditComponent;
  let fixture: ComponentFixture<MaterialDisEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
