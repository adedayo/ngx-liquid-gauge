import { Component } from '@angular/core';
import { NgxLiquidGaugeComponent } from 'ngx-liquid-gauge';

@Component({
  selector: 'app-root',
  imports: [NgxLiquidGaugeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngx-liquid-gauge-app';
  second = 22;

  add(v: any) {
    this.second = v.target.value;
  }
}
