import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmworkSupervisorComponent } from './pmwork-supervisor.component';

describe('PmworkSupervisorComponent', () => {
  let component: PmworkSupervisorComponent;
  let fixture: ComponentFixture<PmworkSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmworkSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmworkSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
