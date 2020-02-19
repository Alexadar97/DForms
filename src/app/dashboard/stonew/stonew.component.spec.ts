import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StonewComponent } from './stonew.component';

describe('StonewComponent', () => {
  let component: StonewComponent;
  let fixture: ComponentFixture<StonewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StonewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StonewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
