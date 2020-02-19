import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialissuesliplistComponent } from './materialissuesliplist.component';

describe('MaterialissuesliplistComponent', () => {
  let component: MaterialissuesliplistComponent;
  let fixture: ComponentFixture<MaterialissuesliplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialissuesliplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialissuesliplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
