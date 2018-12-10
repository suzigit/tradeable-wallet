// notification.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/publish';


//ref: https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a

@Injectable()
export class NotificationService {

  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().publish().refCount();

constructor() {}

notify(message) {
    this._notification.next(message);
//    setTimeout(() => this._notification.next(null), 3000);
  }
}