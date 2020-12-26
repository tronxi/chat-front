import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import {TokenService} from '../services/token.service';
import {Router} from '@angular/router';

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
              private router: Router) { }

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

}
