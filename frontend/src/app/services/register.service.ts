import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from 'src/app/models/register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _url: string = 'http://localhost:3000/api/auth/signup';
  constructor(private http: HttpClient) {}

  registerNewUser(newUser: Register): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(newUser);
    return this.http.post<Register>(this._url, body, { headers: headers });
  }
}
