import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TokenService} from '../services/token.service';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  @ViewChild('scrollMessages') scrollMessages: ElementRef;

  conversationId: string;
  conversationName: string;
  messageList = [];
  message = '';

  constructor(private route: ActivatedRoute,
              private tokenService: TokenService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    this.conversationName = this.route.snapshot.paramMap.get('name');
    this.retrieveMessages();
  }

  retrieveMessages(): void {
    this.messageService.read(this.conversationId, this.tokenService.retrieveUserId()).subscribe(response => {
      this.messageList = response;
      setTimeout(() =>  this.scrollDown(), 500);
    });
  }
  scrollDown(): void {
    this.scrollMessages.nativeElement.scrollTop = this.scrollMessages.nativeElement.scrollHeight;
  }

  send(): void {
    if (this.message === '') { return; }
    this.messageService.send(this.conversationId, this.tokenService.retrieveUserId(), this.message).subscribe(response => {
      this.retrieveMessages();
      this.message = '';
    });
  }

}
