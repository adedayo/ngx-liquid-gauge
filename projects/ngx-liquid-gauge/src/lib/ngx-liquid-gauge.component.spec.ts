import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLiquidGaugeComponent } from './ngx-liquid-gauge.component';

describe('NgxLiquidGaugeComponent', () => {
  let component: NgxLiquidGaugeComponent;
  let fixture: ComponentFixture<NgxLiquidGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxLiquidGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxLiquidGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
