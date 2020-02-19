import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinasworknewComponent } from './finasworknew.component';

describe('FinasworknewComponent', () => {
  let component: FinasworknewComponent;
  let fixture: ComponentFixture<FinasworknewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinasworknewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinasworknewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
