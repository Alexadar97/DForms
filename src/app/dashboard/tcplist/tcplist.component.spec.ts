import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcplistComponent } from './tcplist.component';

describe('TcplistComponent', () => {
  let component: TcplistComponent;
  let fixture: ComponentFixture<TcplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
