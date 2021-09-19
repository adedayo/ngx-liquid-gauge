import { HostListener, Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-liquid-gauge-app';
  second = 22;
  _innerWidth: number = 1000;
  mousePosition: BehaviorSubject<{ positionX: number, positionY: number }> = new BehaviorSubject<{ positionX: number, positionY: number }>({ positionX: 0, positionY: 0 })
  mousePosition$: Observable<{ positionX: number, positionY: number }> = this.mousePosition.asObservable();
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    this.mousePosition.next({ positionX: e.layerX, positionY: e.layerY })
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._innerWidth = window.innerWidth;
  }
  add(v: any) {
    this.second = v.target.value;
  }
}
