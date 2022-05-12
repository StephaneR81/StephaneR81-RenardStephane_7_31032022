import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(private http: HttpClient) {}

  private _url: string = 'http://localhost:3000/api/pictures';

  //Function to post a picture
  postOnePicture(auth_token: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.post(this._url, formData, requestOptions);
  }

  //Function returning all the pictures
  getAllPictures(auth_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.get(this._url, requestOptions);
  }

  //function returning one picture with id
  getOnePicture(auth_token: string, pictureId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.get(this._url + '/' + pictureId, requestOptions);
  }

  //Function getting all comments for the picture
  getAllCommentsFromPicture(auth_token: string, pictureId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    const requestOptions = { headers: headers };
    return this.http.get(this._url + '/comments/' + pictureId, requestOptions);
  }
}
