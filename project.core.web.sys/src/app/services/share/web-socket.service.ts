import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CommonModule } from '@angular/common';
import { HttpSign } from '../../models/HttpSign';
import { ConvertUtil } from '../../common/convert-util';

@Injectable()
export class WebSocketService {

  ws: WebSocket;
  protected private_key = "84qudMIhOkX5JMQXVd0f4jneqfP2Lp";

  constructor(private util: ConvertUtil) { }

  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(
      observer => {
        this.ws.onopen = (event) => observer.next(event);
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
      }
    )
  }

  loginSocket(loginService, data) {
    let sign = new HttpSign();
    sign.cmd = "AuthLogin";
    sign.timestamp = Number(this.util.timestamp());
    sign.sign = this.util.toMd5(data + sign.timestamp + this.private_key);
    sign.data = data;
    loginService.sendMesssage(JSON.stringify(sign));
  }

  sendMesssage(message: any) {
    this.ws.send(message);
  }

}
