import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtousereditComponent } from './protouseredit.component';

describe('ProtousereditComponent', () => {
  let component: ProtousereditComponent;
  let fixture: ComponentFixture<ProtousereditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtousereditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtousereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
