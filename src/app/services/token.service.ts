import {Injectable} from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getDecodedAccessToken(): any {
    try {
      return jwt_decode(this.get());
    } catch (Error) {
      return null;
    }
  }

  save(token: string): void {
    sessionStorage.setItem('token', token);
  }

  destroy(): void {
    sessionStorage.removeItem('token');
  }

  get(): string {
    return sessionStorage.getItem('token');
  }

  exist(): boolean {
    return this.get() !== null;
  }

  retrieveUserId(): string {
    return this.getDecodedAccessToken().id;
  }
}
