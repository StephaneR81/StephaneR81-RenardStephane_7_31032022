import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { LoginService } from '../services/login.service';
import { PictureService } from '../services/picture.service';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss'],
})
export class PictureComponent implements OnInit {
  public picture: any[] = [];
  public pictureComments!: any;
  private userToken!: any;
  private userId!: any;
  constructor(
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private pictureService: PictureService,
  ) {}

  ngOnInit(): void {
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
    this.getOnePicture();
    this.getCommentsOfPicture();
  }

  //Function that requests PictureService to get one picture
  getOnePicture() {
    const token = this.loginService.getTokenFromStorage();
    const pictureId = this.activatedRoute.snapshot.params['id'];
    if (token !== null) {
      this.pictureService.getOnePicture(token, pictureId).subscribe({
        next: (data) => {
          this.picture.push(data);
        },
        error: (error) => {},
      });
    }
  }

  //Function that requests comments of the picture
  getCommentsOfPicture() {
    const token = this.loginService.getTokenFromStorage();
    const pictureId = this.activatedRoute.snapshot.params['id'];
    if (token !== null) {
      this.commentService.getCommentsOfPicture(token, pictureId).subscribe({
        next: (data) => {
          this.pictureComments = data;
        },
        error: (error) => {},
      });
    }
  }
}
