import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtonewComponent } from './protonew.component';

describe('ProtonewComponent', () => {
  let component: ProtonewComponent;
  let fixture: ComponentFixture<ProtonewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtonewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtonewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
