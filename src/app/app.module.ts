import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JoinComponent} from './join/join.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {ConversationListComponent} from './conversation-list/conversation-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {TokenInterceptorService} from './interceptors/tokenInterceptor';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';
import {environment} from '../environments/environment';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JoinComponent,
    HomeComponent,
    NavbarComponent,
    ConversationListComponent,
    UserListComponent,
    ConversationDetailComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, {
    provide: APP_BASE_HREF,
    useValue: environment.baseRef
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
