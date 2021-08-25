import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {Message} from './message';
import {Subject} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private socket$: WebSocketSubject<Message>;
  private messageSubject = new Subject<Message>();
  public message$ = this.messageSubject.asObservable();


  constructor() { }

  public connect(userId: string): void {
    this.socket$ = this.getWebsocket(userId);
    this.socket$.subscribe(msg => {
      this.messageSubject.next(msg);
    });
  }

  public sendMessage(message: Message): void {
    this.socket$.next(message);
  }

  private getWebsocket(userId: string): WebSocketSubject<any> {
    return webSocket({
      url: environment.wsUrl + '/' + userId,
      openObserver: {
        next: () => {
          console.log('WebRTC connection OK');
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebRTC connection closed');
          this.socket$ = undefined;
          this.connect(userId);
        }
      }
    }, );
  }
}
