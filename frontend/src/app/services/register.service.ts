import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from 'src/app/models/register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _urlBase: string = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) {}

  registerNewUser(newUser: Register): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const requestOptions = { headers: headers };
    const body = JSON.stringify(newUser);
    return this.http.post<Register>(
      this._urlBase + '/signup',
      body,
      requestOptions
    );
  }

  //Edit the user profile
  editProfile(auth_token: string, existingUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    const body = JSON.stringify(existingUser);
    return this.http.put<any>(this._urlBase + '/update', body, requestOptions);
  }

  //Delete an user account
  deleteAccount(auth_token: string, userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.delete<any>(
      this._urlBase + '/delete/' + userId,
      requestOptions
    );
  }
}
