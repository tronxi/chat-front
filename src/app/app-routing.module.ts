import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {JoinComponent} from './join/join.component';
import {HomeComponent} from './home/home.component';
import {LoggedInGuard} from './guards/logged-in.guard';
import {ConversationListComponent} from './conversation-list/conversation-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ConversationDetailComponent} from './conversation-detail/conversation-detail.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'join', component: JoinComponent},
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: ConversationListComponent
      },
      {
        path: 'conversation-detail/:conversationId/name/:name',
        component: ConversationDetailComponent
      },
      {
        path: 'user-list',
        component: UserListComponent
      },
      {
        path: '**', redirectTo: '', pathMatch: 'full'
      }
    ]
  },
  { path:  '', redirectTo: 'login', pathMatch: 'full' },
  { path:  '**', redirectTo: 'login', pathMatch: 'full' },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
