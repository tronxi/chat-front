import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import {TokenService} from '../services/token.service';
import {Router} from '@angular/router';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {NotificationTokenService} from '../services/notification-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showError = false;
  user = '';
  password = '';

  constructor(private loginService: LoginService,
              private tokenService: TokenService,
              private router: Router,
              private msg: AngularFireMessaging,
              private notificationTokenService: NotificationTokenService) { }

  ngOnInit(): void {
    this.tokenService.destroy();
  }

  disabled(): boolean {
    return this.user === '' || this.password === '';
  }

  login(): void {
    this.loginService.login(this.user, this.password).subscribe(
      response => {
        this.showError = false;
        this.tokenService.save(response);
        this.saveFirebaseToken();
        this.router.navigateByUrl('/home');
      }, error => {
        this.tokenService.destroy();
        this.password = '';
        this.user = '';
        this.showError = true;
      }
    );
  }

  join(): void {
    this.router.navigateByUrl('/join');
  }

  saveFirebaseToken(): void {
    this.msg.requestToken.subscribe(token => {
      this.notificationTokenService.save(this.tokenService.retrieveUserId(), token)
        .subscribe();
    });
    this.msg.onMessage((payload) => {
      console.log(payload.notification);
    });
  }

}
