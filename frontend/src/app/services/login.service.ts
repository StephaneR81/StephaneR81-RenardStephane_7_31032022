import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _urlBase: string = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) {}

  connectUser(user: Login): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(user);
    return this.http.post<Login>(this._urlBase + '/login', body, {
      headers: headers,
    });
  }

  //Get user details
  getUserDetails(auth_token: string, userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.get<any>(
      this._urlBase + '/user/' + userId,
      requestOptions
    );
  }

  //Get token from storage
  getTokenFromStorage(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }

  //Get token from storage
  getUserIdFromStorage(): string | null {
    const token = localStorage.getItem('userId');
    return token;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}
