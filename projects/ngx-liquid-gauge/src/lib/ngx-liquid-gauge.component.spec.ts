import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLiquidGaugeComponent } from './ngx-liquid-gauge.component';

describe('NgxLiquidGaugeComponent', () => {
  let component: NgxLiquidGaugeComponent;
  let fixture: ComponentFixture<NgxLiquidGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxLiquidGaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxLiquidGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
