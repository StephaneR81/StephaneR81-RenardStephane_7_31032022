import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private pictureId!: string;
  private userToken!: any;
  public userId!: any;
  public commentForm!: FormGroup;
  public submitted: boolean = false;
  public response!: any;
  public formErrorMessage: string = 'Champ requis ou erroné';
  constructor(
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private pictureService: PictureService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.pictureId = this.activatedRoute.snapshot.params['id'];
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
    this.getOnePicture();
    this.getCommentsOfPicture();
  }

  //Get form controls
  get formControls() {
    return this.commentForm.controls;
  }

  //Function initForm()
  initForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(500),
        ]),
      ],
    });
  }

  //Function that requests PictureService to get one picture
  getOnePicture() {
    const token = this.loginService.getTokenFromStorage();
    if (token !== null) {
      this.pictureService.getOnePicture(token, this.pictureId).subscribe({
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
    if (token !== null) {
      this.commentService
        .getCommentsOfPicture(token, this.pictureId)
        .subscribe({
          next: (data) => {
            this.pictureComments = data;
          },
          error: (error) => {},
        });
    }
  }

  //Function for adding a comment
  sendComment() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      return;
    }
    let comment: any = this.commentForm.get('comment')?.value;

    const body = {
      comment: comment,
      pictureId: this.pictureId,
      userId: this.userId,
    };

    this.commentService
      .addComment(this.userToken, JSON.stringify(body))
      .subscribe({
        next: (data) => {
          this.submitted = false;
          this.commentForm.reset();
          this.response = data.message;
          this.getCommentsOfPicture();
        },
        error: (error) => {
          this.response = error.error.message;
        },
      });
  }

  //Delete a comment
  deleteComment(commentId: string) {
    this.commentService.deleteComment(this.userToken, commentId).subscribe({
      next: (data) => {
        this.response = data.message;
        this.getCommentsOfPicture();
      },
      error: (error) => {
        this.response = error.message;
      },
    });
  }
}
