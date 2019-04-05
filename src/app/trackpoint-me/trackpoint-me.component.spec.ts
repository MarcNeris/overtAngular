import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackpointMeComponent } from './trackpoint-me.component';

describe('TrackpointMeComponent', () => {
  let component: TrackpointMeComponent;
  let fixture: ComponentFixture<TrackpointMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackpointMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackpointMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
