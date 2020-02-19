import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmcslistComponent } from './umcslist.component';

describe('UmcslistComponent', () => {
  let component: UmcslistComponent;
  let fixture: ComponentFixture<UmcslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmcslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmcslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
