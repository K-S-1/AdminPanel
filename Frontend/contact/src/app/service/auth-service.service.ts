import { inject, Injectable } from '@angular/core';
import { LoginResponse } from '../models/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // loginres=inject(LoginResponse)
  constructor() {
    // console.log(this.loginres)
  }
  // constructor() { 
  //   this.isAuthenticated = !!localStorage.getItem(authSecretKey);
  // }
  setLoginData(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getLoginData(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  removeData(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearData(): void {
    sessionStorage.clear();
  }

  logoutData(key: string): void {
    sessionStorage.removeItem(key);
  }
}
