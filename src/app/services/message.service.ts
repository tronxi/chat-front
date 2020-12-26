import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  read(conversationId: string, userId: string): Observable<any> {
    return this.http.get(environment.url + '/messages/conversations/' + conversationId + '/users/' + userId);
  }

  send(conversationId: string, userId: string, message: string): Observable<any> {
    return this.http.post(environment.url + '/messages/conversations/' + conversationId + '/users/' + userId, {message});
  }
}
