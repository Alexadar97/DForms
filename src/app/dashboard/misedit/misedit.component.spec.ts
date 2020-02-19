import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseditComponent } from './misedit.component';

describe('MiseditComponent', () => {
  let component: MiseditComponent;
  let fixture: ComponentFixture<MiseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
