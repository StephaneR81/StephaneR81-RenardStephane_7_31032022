import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  private _url: string = 'http://localhost:3000/api/comments';

  //Function getting all comments for one picture
  getCommentsOfPicture(auth_token: string, pictureId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });

    const requestOptions = { headers: headers };
    return this.http.get(this._url + '/' + pictureId, requestOptions);
  }

  //Function for adding a new comment
  addComment(auth_token: string, pictureId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });

    const requestOptions = { headers: headers };
    return this.http.post(this._url, requestOptions);
  }
}
