/*!
* Note this was taken from Curtis Bratton's code: http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6
* I upgraded the D3 API and made minor modifications along the way as I converted it to Typescript from Javascript.
* All credits go to Curtis.
* Dayo Adetoye. 2018. https://github.com/adedayo
*/


import * as d3 from 'd3';
import { LiquidGaugeOptions } from './types/ngx-liquid-gauge-options.type';

/*!
 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 *
 * Liquid Fill Gauge v1.1
 */
export function liquidFillGaugeDefaultSettings(): LiquidGaugeOptions {
  return {
    value: '50',
    minValue: 0, // The gauge minimum value.
    maxValue: 100, // The gauge maximum value.
    heigth: 150, // The circle height
    width: 150, // The circle width
    circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
    circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    circleColor: '#178BCA', // The color of the outer circle.
    waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
    waveCount: 1, // The number of full waves per width of the wave circle.
    waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
    waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    // tslint:disable-next-line:max-line-length
    waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
    waveAnimate: true, // Controls if the wave scrolls or is static.
    waveColor: '#178BCA', // The color of the fill wave.
    waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
    textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
    textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
    // tslint:disable-next-line:max-line-length
    valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
    displayPercent: true, // If true, a % symbol is displayed after the value.
    textColor: '#045681', // The color of the value text when the wave does not overlap it.
    waveTextColor: '#A4DBf8' // The color of the value text when the wave overlaps it.
  };
}

export function loadLiquidFillGauge(elementSelected: d3.Selection<Element, unknown, null, undefined>, config: LiquidGaugeOptions) {
  if (config == null) {
    config = liquidFillGaugeDefaultSettings();
  }
  const gauge = elementSelected.select('svg');
  const radius = Math.min((config.width || 150), (config.heigth || 150)) / 2;
  const locationX = (config.width || 150) / 2 - radius;
  const locationY = (config.heigth || 150) / 2 - radius;
  let fillPercent = Math.max((config.minValue || 0), Math.min((config.maxValue || 100), parseFloat('' + config.value))) / (config.maxValue || 100);

  const waveHeightScale = config.waveHeightScaling
    ? d3.scaleLinear().range([0, config.waveHeight!, 0]).domain([0, 50, 100])
    : d3.scaleLinear().range([config.waveHeight!, config.waveHeight!]).domain([0, 100]);

  const textPixels = ((config.textSize || 1) * radius / 2);
  const textFinalValue: number = +(+config.value).toFixed(2);

  const textStartValue: number = config.valueCountUp ? config.minValue || 0 : textFinalValue;
  const percentText = config.displayPercent ? '%' : '';
  const circleThickness = (config.circleThickness || 0.05) * radius;
  const circleFillGap = (config.circleFillGap || 0.05) * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;
  let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  const waveLength = fillCircleRadius * 2 / (config.waveCount || 1);
  const waveClipCount = 1 + (config.waveCount || 1);
  const waveClipWidth = waveLength * waveClipCount;

  // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
  let textRounder = (val: number) => Math.round(val);

  if (textFinalValue !== textRounder(textFinalValue)) {
    textRounder = function (val: number) {
      return +val.toFixed(1);
    };
  }
  if (textFinalValue !== textRounder(textFinalValue)) {
    textRounder = function (val: number) {
      return +val.toFixed(2);
    };
  }

  // Data for building the clip wave area.
  const data = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push({
      x: i / (40 * waveClipCount),
      y: (i / (40))
    });
  }

  // Scales for drawing the outer circle.
  const gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
  const gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

  // Scales for controlling the size of the clipping path.
  let waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  let waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

  // Scales for controlling the position of the clipping path.
  let waveRiseScale = d3.scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
    .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
    .domain([0, 1]);
  const waveAnimateScale = d3.scaleLinear()
    .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
    .domain([0, 1]);

  // Scale for controlling the position of the text within the gauge.
  const textRiseScaleY = d3.scaleLinear()
    .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
    .domain([0, 1]);

  // Center the gauge within the parent SVG.
  const gaugeGroup = gauge.append('g')
    .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

  // Draw the outer circle.
  const gaugeCircleArc: any = d3.arc()
    .startAngle(gaugeCircleX(0))
    .endAngle(gaugeCircleX(1))
    .outerRadius(gaugeCircleY(radius))
    .innerRadius(gaugeCircleY(radius - circleThickness));
  gaugeGroup.append('path')
    .attr('d', gaugeCircleArc)
    .style('fill', config.circleColor || 'blue')
    .attr('transform', 'translate(' + radius + ',' + radius + ')');

  // Text where the wave does not overlap.
  const text1 = gaugeGroup.append('text')
    .text(textRounder(textStartValue) + percentText)
    .attr('class', 'liquidFillGaugeText')
    .attr('text-anchor', 'middle')
    .attr('font-size', textPixels + 'px')
    .style('fill', config.textColor || 'blue')
    .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition || 0) + ')');

  // The clipping wave area.
  const clipArea = d3.area()
    .x(function (d: any) {
      return waveScaleX(d.x);
    })
    .y0(function (d: any) {
      return waveScaleY(Math.sin(Math.PI * 2 * (config.waveOffset || 0) * -1 + Math.PI * 2 * (1 - (config.waveCount || 1)) + d.y * 2 * Math.PI));
    })
    .y1(function (d) {
      return (fillCircleRadius * 2 + waveHeight);
    });
  const waveGroup = gaugeGroup.append('defs')
    .append('clipPath')
    .attr('id', 'clipWave' + gauge.attr('id'));
  const wave = waveGroup.append('path')
    .datum(data)
    .attr('d', clipArea as any)
    .attr('T', 0);

  // The inner circle with the clipping wave attached.
  const fillCircleGroup = gaugeGroup.append('g')
    .attr('clip-path', 'url(#clipWave' + gauge.attr('id') + ')');
  fillCircleGroup.append('circle')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', fillCircleRadius)
    .style('fill', config.waveColor || 'blue');


  // Text where the wave does overlap.
  const text2 = fillCircleGroup.append('text')
    .text(textRounder(textStartValue) + percentText)
    .attr('class', 'liquidFillGaugeText')
    .attr('text-anchor', 'middle')
    .attr('font-size', textPixels + 'px')
    .style('fill', config.waveTextColor || 'blue')
    .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition || 0) + ')');

  // Make the value count up.
  if (config.valueCountUp) {
    const textTween = function g(this: any) {
      //remove trailing % sign
      const content = +this.textContent.replace('%', '');

      const i = d3.interpolateNumber(content, textFinalValue);
      const self = this
      return (t: number) => {
        this.textContent = textRounder(i(t)) + percentText;
      };
    };
    text1.transition()
      .duration(config.waveRiseTime || 1000)
      .tween('text', textTween);
    text2.transition()
      .duration(config.waveRiseTime || 1000)
      .tween('text', textTween);
  }

  // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
  const waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
  if (config.waveRise) {

    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
      .transition()
      .duration(config.waveRiseTime || 1000)
      .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
      .on('start', () => {
        wave.attr('transform', 'translate(1,0)');
      }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and
    // config.waveAnimate = false//.The wave will not position correctly without this, but it's not clear why this is actually necessary.
  } else {
    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
  }

  if (config.waveAnimate) {
    animateWave();
  }

  function animateWave(_?: any) {
    wave.attr('transform', 'translate(' + waveAnimateScale(+wave.attr('T')) + ',0)');
    wave.transition()
      .duration((config.waveAnimateTime || 1800) * (1 - +wave.attr('T')))
      .ease(d3.easeLinear)
      .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
      .attr('T', 1)
      .on('end', () => {
        wave.attr('T', 0);
        animateWave(config.waveAnimateTime);
      });
  }

  class GaugeUpdater {

    textContent: string = '0%'

    update(val: number): void {
      const newFinalValue = +val.toFixed(2);
      let textRounderUpdater = function (val2: number) {
        return Math.round(val2);
      };
      if (newFinalValue !== textRounderUpdater(newFinalValue)) {
        textRounderUpdater = function (val2) {
          return +val2.toFixed(1);
        };
      }
      if (newFinalValue !== textRounderUpdater(newFinalValue)) {
        textRounderUpdater = function (val2) {
          return +val2.toFixed(2);
        };
      }

      const textTween = () => {
        //remove trailing % sign
        const content = this.textContent.replace('%', '');
        const i = d3.interpolateNumber(+content, +(+config.value).toFixed(2));
        const self = this
        return function (t: number) {
          self.textContent = textRounderUpdater(i(t)) + percentText;
        };
      };

      text1.transition()
        .duration(config.waveRiseTime || 1000)
        .tween('text', textTween);
      text2.transition()
        .duration(config.waveRiseTime || 1000)
        .tween('text', textTween);

      fillPercent = Math.max(config.minValue || 0, Math.min(config.maxValue || 100, parseFloat('' + config.value))) / (config.maxValue || 100);
      waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
      waveRiseScale = d3.scaleLinear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
        .domain([0, 1]);
      const newHeight = waveRiseScale(fillPercent);
      waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
      waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);
      let newClipArea;
      if (config.waveHeightScaling) {
        newClipArea = d3.area()
          .x((d: any) => {
            return waveScaleX(d.x);
          })
          .y0((d: any) => {
            return waveScaleY(Math.sin(Math.PI * 2 * (config.waveOffset || 0) * -1 + Math.PI * 2 * (1 - (config.waveCount || 1)) + d.y * 2 * Math.PI));
          })
          .y1((d) => {
            return (fillCircleRadius * 2 + waveHeight);
          });
      } else {
        newClipArea = clipArea;
      }

      const newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
      wave.transition()
        .duration(0)
        .transition()
        .duration(config.waveAnimate ? ((config.waveAnimateTime || 1800) * (1 - +wave.attr('T'))) : (config.waveRiseTime || 1000))
        .ease(d3.easeLinear)
        .attr('d', newClipArea as any)
        .attr('transform', 'translate(' + newWavePosition + ',0)')
        .attr('T', '1')
        .on('start', () => {
          if (config.waveAnimate) {
            wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
            animateWave(config.waveAnimateTime);
          }
        });
      waveGroup.transition()
        .duration(config.waveRiseTime || 1000)
        .attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')');


    };
  }

  return new GaugeUpdater();
}
