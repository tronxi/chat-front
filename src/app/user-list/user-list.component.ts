import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {ConversationService} from '../services/conversation.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList = [];

  constructor(private userService: UserService,
              private tokenService: TokenService,
              private conversationService: ConversationService,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.findAll().subscribe(response => {
      this.userList = response;
    });
  }

  conversationDetail(id: string, name: string): void {
    this.conversationService.create(this.tokenService.retrieveUserId(), id).subscribe(response => {
      this.router.navigateByUrl('/home/conversation-detail/' + response.conversationId + '/name/' + name);
    });
  }
}
