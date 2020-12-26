import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private http: HttpClient) { }

  create(senderId: string, receiverId: string): Observable<any>{
    return this.http.post(environment.url + '/conversations/' + senderId, {receiverId});
  }
}
