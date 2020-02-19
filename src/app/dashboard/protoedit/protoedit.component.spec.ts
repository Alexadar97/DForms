import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtoeditComponent } from './protoedit.component';

describe('ProtoeditComponent', () => {
  let component: ProtoeditComponent;
  let fixture: ComponentFixture<ProtoeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtoeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
