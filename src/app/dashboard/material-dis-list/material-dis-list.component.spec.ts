import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisListComponent } from './material-dis-list.component';

describe('MaterialDisListComponent', () => {
  let component: MaterialDisListComponent;
  let fixture: ComponentFixture<MaterialDisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
