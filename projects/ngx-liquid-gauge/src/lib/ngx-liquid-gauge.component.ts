import { Component, AfterViewInit, ViewChild, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as liquid from './liquidFillGauge';
import { LiquidGaugeOptions } from './types/ngx-liquid-gauge-options.type';

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
  @Input() private value = this.defaultSettings.value;
  @Input() private minValue = this.defaultSettings.minValue;
  @Input() private maxValue = this.defaultSettings.maxValue;
  @Input() private circleThickness = this.defaultSettings.circleThickness;
  @Input() private circleFillGap = this.defaultSettings.circleFillGap;
  @Input() private circleColor = this.defaultSettings.circleColor;
  @Input() private waveHeight = this.defaultSettings.waveHeight;
  @Input() private waveCount = this.defaultSettings.waveCount;
  @Input() private waveRiseTime = this.defaultSettings.waveRiseTime;
  @Input() private waveAnimateTime = this.defaultSettings.waveAnimateTime;
  @Input() private waveRise = this.defaultSettings.waveRise;
  @Input() private waveHeightScaling = this.defaultSettings.waveHeightScaling;
  @Input() private waveAnimate = this.defaultSettings.waveAnimate;
  @Input() private waveColor = this.defaultSettings.waveColor;
  @Input() private waveOffset = this.defaultSettings.waveOffset;
  @Input() private textVertPosition = this.defaultSettings.textVertPosition;
  @Input() private textSize = this.defaultSettings.textSize;
  @Input() private valueCountUp = this.defaultSettings.valueCountUp;
  @Input() private displayPercent = this.defaultSettings.displayPercent;
  @Input() private textColor = this.defaultSettings.textColor;
  @Input() private waveTextColor = this.defaultSettings.waveTextColor;
  @Input() private heigth = this.defaultSettings.heigth;
  @Input() private width = this.defaultSettings.width;

  constructor() { }

  ngAfterViewInit(): void {
      this.createChart();
      this.initialised = true;
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
    elementSelected.attr('class','center');

    /*d3.select(element)
      .append('svg').attr('id', this.id)
      .attr('width', '150')
      .attr('height', '150');*/
    elementSelected
      .append('svg').attr('id', this.id)
      .attr('width', this.width)
      .attr('height', this.heigth);
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
