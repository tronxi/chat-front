import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {

  conversationList = [];

  constructor(private userService: UserService,
              private tokenService: TokenService,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.findConversationsByUserId(this.tokenService.retrieveUserId()).subscribe(response => {
      this.conversationList = response;
    });
  }

  conversationDetail(conversationId: string, conversationName: string): void {
    console.log(conversationId);
    this.router.navigateByUrl('/home/conversation-detail/' + conversationId + '/name/' + conversationName);
  }
}
