import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxLiquidGaugeModule } from 'ngx-liquid-gauge';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxLiquidGaugeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
