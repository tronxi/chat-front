import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  password = '';
  user = '';
  showError = false;

  constructor(private router: Router,
              private userService: UserService,
              private tokenService: TokenService) { }

  ngOnInit(): void {
    this.tokenService.destroy();
  }

  join(): void {
    this.userService.create(this.user, this.password).subscribe(response => {
      this.router.navigateByUrl('/login');
    }, error => {
      this.password = '';
      this.user = '';
      this.showError = true;
    });
  }

  login(): void {
    this.router.navigateByUrl('/login');
  }

  disabled(): boolean {
      return this.user === '' || this.password === '';
  }
}
