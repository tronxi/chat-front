import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {Router} from '@angular/router';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit, OnDestroy {

  private client: Client;

  conversationList = [];

  constructor(private userService: UserService,
              private tokenService: TokenService,
              private router: Router) { }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(environment.url + '/ws');
    };
    this.client.onConnect = (frame) => {
      this.client.subscribe('/topic/' + this.tokenService.retrieveUserId(), (event) => {
        this.retrieveConversations();
      });
    };

    this.client.activate();
    this.retrieveConversations();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }

  retrieveConversations(): void {
    this.userService.findConversationsByUserId(this.tokenService.retrieveUserId()).subscribe(response => {
      this.conversationList = response;
    });
  }

  conversationDetail(conversationId: string, conversationName: string): void {
    this.router.navigateByUrl('/home/conversation-detail/' + conversationId + '/name/' + conversationName);
  }
}
