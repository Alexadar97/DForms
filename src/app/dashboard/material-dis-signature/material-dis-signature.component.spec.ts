import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisSignatureComponent } from './material-dis-signature.component';

describe('MaterialDisSignatureComponent', () => {
  let component: MaterialDisSignatureComponent;
  let fixture: ComponentFixture<MaterialDisSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDisSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
