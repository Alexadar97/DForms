import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisRecallComponent } from './material-dis-recall.component';

describe('MaterialDisRecallComponent', () => {
  let component: MaterialDisRecallComponent;
  let fixture: ComponentFixture<MaterialDisRecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisRecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
