import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmcsuploadComponent } from './nmcsupload.component';

describe('NmcsuploadComponent', () => {
  let component: NmcsuploadComponent;
  let fixture: ComponentFixture<NmcsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmcsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmcsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
