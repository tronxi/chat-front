import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TokenService} from '../services/token.service';
import {MessageService} from '../services/message.service';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';
import {CypherService} from '../services/cypher.service';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit, OnDestroy{

  private client: Client;

  @ViewChild('scrollMessages') scrollMessages: ElementRef;

  conversationId: string;
  conversationName: string;
  messageList = [];
  message = '';
  key = '';
  keyForm = '';

  constructor(private route: ActivatedRoute,
              private tokenService: TokenService,
              private messageService: MessageService,
              private cypherService: CypherService) { }

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    this.conversationName = this.route.snapshot.paramMap.get('name');

    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(environment.url + '/ws');
    };
    this.client.onConnect = (frame) => {
      this.client.subscribe('/topic/' + this.conversationId, (event) => {
        this.retrieveMessages();
      });
    };

    this.client.activate();
    this.retrieveMessages();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }

  retrieveMessages(): void {
    this.messageService.read(this.conversationId, this.tokenService.retrieveUserId()).subscribe(response => {
      this.messageList = response.map(res => {
        return {
          message: this.decrypt(res.message),
          isMyMessage: res.isMyMessage
        };
      });
      setTimeout(() =>  this.scrollDown(), 500);
    });
  }
  scrollDown(): void {
    this.scrollMessages.nativeElement.scrollTop = this.scrollMessages.nativeElement.scrollHeight;
  }

  send(): void {
    if (this.message === '') { return; }
    const messageToSend = this.encrypt(this.message);
    this.message = '';
    this.messageService.send(this.conversationId, this.tokenService.retrieveUserId(), messageToSend).subscribe(response => {
    });
  }

  changeKey(): void {
    this.key = this.keyForm;
    this.retrieveMessages();
  }

  encrypt(message: string): string {
    return this.cypherService.encrypt(message, this.key);
  }

  decrypt(message: string): string {
    return this.cypherService.decrypt(message, this.key);
  }

}
