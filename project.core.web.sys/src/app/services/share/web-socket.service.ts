import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CommonModule } from '@angular/common';

@Injectable()
export class WebSocketService {

  ws: WebSocket;

  constructor() { }

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

  sendMesssage(message: any) {
    this.ws.send(message);
  }

}
