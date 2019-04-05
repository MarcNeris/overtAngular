import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytrackpointComponent } from './mytrackpoint.component';

describe('MytrackpointComponent', () => {
  let component: MytrackpointComponent;
  let fixture: ComponentFixture<MytrackpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytrackpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytrackpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
