import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmwruploadComponent } from './pmwrupload.component';

describe('PmwruploadComponent', () => {
  let component: PmwruploadComponent;
  let fixture: ComponentFixture<PmwruploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmwruploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmwruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
