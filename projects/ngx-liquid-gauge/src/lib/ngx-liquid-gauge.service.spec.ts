import { TestBed } from '@angular/core/testing';

import { NgxLiquidGaugeService } from './ngx-liquid-gauge.service';

describe('NgxLiquidGaugeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxLiquidGaugeService = TestBed.get(NgxLiquidGaugeService);
    expect(service).toBeTruthy();
  });
});
