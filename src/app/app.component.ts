import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-liquid-gauge-app';
  second = 22;
  add(v:any) {
    this.second = v.target.value;
  }
}
