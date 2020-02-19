import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StolistComponent } from './stolist.component';

describe('StolistComponent', () => {
  let component: StolistComponent;
  let fixture: ComponentFixture<StolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
