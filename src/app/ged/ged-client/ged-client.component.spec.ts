import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GedClientComponent } from './ged-client.component';

describe('GedClientComponent', () => {
  let component: GedClientComponent;
  let fixture: ComponentFixture<GedClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GedClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
