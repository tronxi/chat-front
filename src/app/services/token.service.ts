import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

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
}
