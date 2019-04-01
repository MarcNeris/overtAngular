import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoffComponent } from './layoff.component';

describe('LayoffComponent', () => {
  let component: LayoffComponent;
  let fixture: ComponentFixture<LayoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
