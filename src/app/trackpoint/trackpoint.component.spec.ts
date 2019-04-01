import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackpointComponent } from './trackpoint.component';

describe('TrackpointComponent', () => {
  let component: TrackpointComponent;
  let fixture: ComponentFixture<TrackpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
