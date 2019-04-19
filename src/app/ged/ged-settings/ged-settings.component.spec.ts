import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GedSettingsComponent } from './ged-settings.component';

describe('GedSettingsComponent', () => {
  let component: GedSettingsComponent;
  let fixture: ComponentFixture<GedSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GedSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
