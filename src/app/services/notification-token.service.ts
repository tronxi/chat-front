import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationTokenService {

  constructor(private http: HttpClient) { }

  save(userId: string, token: string): Observable<any> {
    return this.http.put(environment.url + '/notifications/token/' + userId, {token});
  }

  delete(userId: string): Observable<any> {
    return this.http.delete(environment.url + '/notifications/token/' + userId);
  }
}
