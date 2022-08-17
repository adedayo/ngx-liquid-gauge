export interface LiquidGaugeOptions {
  value: string | number;
  width?: number;//width of the circle (new properties)
  heigth?: number;//heigth of the circle
  minValue?: number;
  maxValue?: number;
  circleThickness?: number;
  circleFillGap?: number;
  circleColor?: string;
  waveHeight?: number;
  waveCount?: number;
  waveRiseTime?: number;
  waveAnimateTime?: number;
  waveRise?: boolean;
  waveHeightScaling?: boolean;
  waveAnimate?: boolean;
  waveColor?: string;
  waveOffset?: number;
  textVertPosition?: number;
  textSize?: number;
  valueCountUp?: boolean;
  displayPercent?: boolean;
  textColor?: string;
  waveTextColor?: string;
};
