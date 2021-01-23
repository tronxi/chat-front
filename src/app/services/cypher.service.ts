import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CypherService {

  constructor() { }

  encrypt(message: string, key: string): string {
    return CryptoJS.AES.encrypt(message, key).toString();
  }

  decrypt(message: string, key: string): string {
    try {
      return CryptoJS.AES.decrypt(message, key)
        .toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return '';
    }
  }
}
