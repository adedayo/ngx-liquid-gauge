import { HostListener } from '@angular/core';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-liquid-gauge-app';
  second = 22;
  _innerWidth:number = 1000;
  _posicionMouse:BehaviorSubject<{positionX: number,positionY: number}> = new BehaviorSubject<{positionX: number,positionY: number}>({positionX:0,positionY: 0})
  posicionMouse$:Observable<{positionX: number,positionY: number}> = this._posicionMouse.asObservable();
  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e) {
    this._posicionMouse.next({positionX: e.layerX,positionY:e.layerY})
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._innerWidth = window.innerWidth;
  }
  add(v:any) {
    this.second = v.target.value;
  }
}
