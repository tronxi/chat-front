import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {JoinComponent} from './join/join.component';
import {HomeComponent} from './home/home.component';
import {LoggedInGuard} from './guards/logged-in.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'join', component: JoinComponent},
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [LoggedInGuard]
  },
  { path:  '', redirectTo: 'login', pathMatch: 'full' },
  { path:  '**', redirectTo: 'login', pathMatch: 'full' },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
