import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewarrayComponent } from './viewarray.component';

describe('ViewarrayComponent', () => {
  let component: ViewarrayComponent;
  let fixture: ComponentFixture<ViewarrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewarrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
