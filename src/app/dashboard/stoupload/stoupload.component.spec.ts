import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StouploadComponent } from './stoupload.component';

describe('StouploadComponent', () => {
  let component: StouploadComponent;
  let fixture: ComponentFixture<StouploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StouploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StouploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
