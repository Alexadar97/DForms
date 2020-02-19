import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McslistComponent } from './mcslist.component';

describe('McslistComponent', () => {
  let component: McslistComponent;
  let fixture: ComponentFixture<McslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
