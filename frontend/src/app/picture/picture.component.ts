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
  public userInfos: any = {};
  public textBoxStyle: any = { color: '#000' };
  public noComment: boolean = true;
  constructor(
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private pictureService: PictureService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.pictureId = this.activatedRoute.snapshot.params['id'];
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
    this.getOnePicture();
    this.getCommentsOfPicture();
    this.getUserInfos();
  }

  //Get form controls
  get formControls() {
    return this.commentForm.controls;
  }

  //Get user informations
  getUserInfos() {
    this.loginService.getUserDetails(this.userToken, this.userId).subscribe({
      next: (data) => {
        this.textBoxStyle.color = 'green';
        this.userInfos = data.user;
        this.response = data.message;
      },
      error: (error) => {
        this.textBoxStyle.color = 'red';
        this.response = error.message;
      },
    });
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
            this.noComment = data.length > 0 ? false : true;
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
          this.textBoxStyle.color = 'green';
          this.response = data.message;
          this.getCommentsOfPicture();
        },
        error: (error) => {
          this.textBoxStyle.color = 'red';
          this.response = error.message;
        },
      });
  }

  //Delete a comment
  deleteComment(commentId: string) {
    if (!confirm('Souhaitez-vous supprimer votre commentaire ?')) {
      return;
    }
    this.commentService.deleteComment(this.userToken, commentId).subscribe({
      next: (data) => {
        this.textBoxStyle.color = 'green';
        this.response = data.message;
        this.getCommentsOfPicture();
      },
      error: (error) => {
        this.textBoxStyle.color = 'red';
        this.response = error.message;
      },
    });
  }

  //Delete the picture
  deletePicture(pictureId: string) {
    if (
      !confirm(
        'Souhaitez-vous supprimer votre photo et tous ses commentaires ?'
      )
    ) {
      return;
    }
    this.pictureService.deletePicture(this.userToken, pictureId).subscribe({
      next: (data) => {
        this.textBoxStyle.color = 'green';
        this.response = data.message;
        setTimeout(() => {
          this.router.navigateByUrl('wall');
        }, 3000);
      },
      error: (error) => {
        this.textBoxStyle.color = 'red';
        this.response = error.message;
      },
    });
  }
}
