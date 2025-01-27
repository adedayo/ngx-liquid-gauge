import { Component, AfterViewInit, ViewChild, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import * as d3 from 'd3';
import * as liquid from './liquidFillGauge';
import { LiquidGaugeOptions } from './types/ngx-liquid-gauge-options.type';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'lib-ngx-liquid-gauge',
  template: `<div #gauge></div>`,
  styles: [`
  :host ::ng-deep .center{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }`]
})
export class NgxLiquidGaugeComponent implements OnChanges, AfterViewInit {

  @ViewChild('gauge') gauge: any;
  id = 'gauge' + Math.floor(Math.random() * 100000) + 1; // assign a random ID to SVG component
  initialised = false;
  private defaultSettings = liquid.liquidFillGaugeDefaultSettings();
  @Input() value = +this.defaultSettings.value;
  @Input() minValue = this.defaultSettings.minValue;
  @Input() maxValue = this.defaultSettings.maxValue;
  @Input() circleThickness = this.defaultSettings.circleThickness;
  @Input() circleFillGap = this.defaultSettings.circleFillGap;
  @Input() circleColor = this.defaultSettings.circleColor;
  @Input() waveHeight = this.defaultSettings.waveHeight;
  @Input() waveCount = this.defaultSettings.waveCount;
  @Input() waveRiseTime = this.defaultSettings.waveRiseTime;
  @Input() waveAnimateTime = this.defaultSettings.waveAnimateTime;
  @Input() waveRise = this.defaultSettings.waveRise;
  @Input() waveHeightScaling = this.defaultSettings.waveHeightScaling;
  @Input() waveAnimate = this.defaultSettings.waveAnimate;
  @Input() waveColor = this.defaultSettings.waveColor;
  @Input() waveOffset = this.defaultSettings.waveOffset;
  @Input() textVertPosition = this.defaultSettings.textVertPosition;
  @Input() textSize = this.defaultSettings.textSize;
  @Input() valueCountUp = this.defaultSettings.valueCountUp;
  @Input() displayPercent = this.defaultSettings.displayPercent;
  @Input() textColor = this.defaultSettings.textColor;
  @Input() waveTextColor = this.defaultSettings.waveTextColor;
  @Input() heigth = this.defaultSettings.heigth;
  @Input() width = this.defaultSettings.width;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      //will only run in the browser
      this.createChart();
      this.initialised = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialised) {
      this.createChart();
    }
  }

  createChart(): any {
    const element: Element = this.gauge.nativeElement;
    //clear previous chart
    const elementSelected = d3.select(element);
    //d3.select(element).selectAll('*').remove();
    elementSelected.selectAll('*').remove();
    elementSelected.attr('class', 'center');

    /*d3.select(element)
      .append('svg').attr('id', this.id)
      .attr('width', '150')
      .attr('height', '150');*/
    elementSelected
      .append('svg').attr('id', this.id)
      .attr('width', this.width || 150)
      .attr('height', this.heigth || 150);
    const settings: LiquidGaugeOptions = {
      value: this.value,
      minValue: this.minValue,
      maxValue: this.maxValue,
      circleThickness: this.circleThickness,
      circleFillGap: this.circleFillGap,
      circleColor: this.circleColor,
      waveHeight: this.waveHeight,
      waveCount: this.waveCount,
      waveRiseTime: this.waveRiseTime,
      waveAnimateTime: this.waveAnimateTime,
      waveRise: this.waveRise,
      waveHeightScaling: this.waveHeightScaling,
      waveAnimate: this.waveAnimate,
      waveColor: this.waveColor,
      waveOffset: this.waveOffset,
      textVertPosition: this.textVertPosition,
      textSize: this.textSize,
      valueCountUp: this.valueCountUp,
      displayPercent: this.displayPercent,
      textColor: this.textColor,
      waveTextColor: this.waveTextColor,
      width: this.width,
      heigth: this.heigth
    };
    liquid.loadLiquidFillGauge(elementSelected, settings);
  }

}
