import { TestBed } from '@angular/core/testing';

import { NgxLiquidGaugeService } from './ngx-liquid-gauge.service';

describe('NgxLiquidGaugeService', () => {
  let service: NgxLiquidGaugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLiquidGaugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
