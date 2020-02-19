import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrofitmentnewComponent } from './retrofitmentnew.component';

describe('RetrofitmentnewComponent', () => {
  let component: RetrofitmentnewComponent;
  let fixture: ComponentFixture<RetrofitmentnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrofitmentnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrofitmentnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
