import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpnewComponent } from './tcpnew.component';

describe('TcpnewComponent', () => {
  let component: TcpnewComponent;
  let fixture: ComponentFixture<TcpnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcpnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcpnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
