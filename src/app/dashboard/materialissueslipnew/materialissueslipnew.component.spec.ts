import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialissueslipnewComponent } from './materialissueslipnew.component';

describe('MaterialissueslipnewComponent', () => {
  let component: MaterialissueslipnewComponent;
  let fixture: ComponentFixture<MaterialissueslipnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialissueslipnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialissueslipnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
