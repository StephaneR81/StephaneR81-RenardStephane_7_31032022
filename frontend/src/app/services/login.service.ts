import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _url: string = 'http://localhost:3000/api/auth/login';
  constructor(private http: HttpClient) {}

  connectUser(user: Login): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(user);
    return this.http.post<Login>(this._url, body, { headers: headers });
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  //Get token from storage
  getTokenFromStorage(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }
}
