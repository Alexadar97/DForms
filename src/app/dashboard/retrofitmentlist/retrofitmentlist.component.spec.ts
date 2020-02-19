import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrofitmentlistComponent } from './retrofitmentlist.component';

describe('RetrofitmentlistComponent', () => {
  let component: RetrofitmentlistComponent;
  let fixture: ComponentFixture<RetrofitmentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrofitmentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrofitmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
