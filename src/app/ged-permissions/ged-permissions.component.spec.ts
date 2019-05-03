import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GedPermissionsComponent } from './ged-permissions.component';

describe('GedPermissionsComponent', () => {
  let component: GedPermissionsComponent;
  let fixture: ComponentFixture<GedPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GedPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GedPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
