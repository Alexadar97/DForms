import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialissueslipeditComponent } from './materialissueslipedit.component';

describe('MaterialissueslipeditComponent', () => {
  let component: MaterialissueslipeditComponent;
  let fixture: ComponentFixture<MaterialissueslipeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialissueslipeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialissueslipeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
