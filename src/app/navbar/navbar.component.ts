import {Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {Router} from '@angular/router';
import {NotificationTokenService} from '../services/notification-token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private tokenService: TokenService,
              private router: Router,
              private notificationTokenService: NotificationTokenService) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.notificationTokenService.delete(this.tokenService.retrieveUserId()).subscribe();
    this.tokenService.destroy();
    this.router.navigateByUrl('/login');
  }
}
