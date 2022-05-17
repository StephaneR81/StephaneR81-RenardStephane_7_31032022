import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss'],
})
export class EditCommentComponent implements OnInit {
  private userToken!: any;
  public userId!: any;
  public commentForm!: FormGroup;
  public submitted: boolean = false;
  public response!: any;
  public formErrorMessage: string = 'Champ requis ou erroné';
  public textBoxStyle: any = { color: '#000' };
  public commentId: string = this.activatedRoute.snapshot.params['id'];
  private linkedPicture!: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private loginService: LoginService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.getUserIdFromStorage();
    this.userToken = this.loginService.getTokenFromStorage();
    this.initForm();
    this.getCommentToEdit();
  }

  //Get form controls
  get formControls() {
    return this.commentForm.controls;
  }

  //Function to navigate back
  goBack() {
    this.location.back();
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

  //Get comment to edit by its URL ID
  getCommentToEdit() {
    this.commentService
      .getOneComment(this.userToken, this.commentId)
      .subscribe({
        next: (data) => {
          this.response = data.message;
          this.formControls['comment'].setValue(data.comment);
          this.linkedPicture = data.pictureId;
        },
        error: (error) => {
          this.response = error.message;
        },
      });
  }

  //Function updateComment
  updateComment() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      return;
    }
    //Setting data to update
    const newContent = this.formControls['comment'].value;
    const body = { comment: newContent };

    this.commentService
      .updateComment(this.userToken, JSON.stringify(body), this.commentId)
      .subscribe({
        next: (data) => {
          this.response = data.message;
          setTimeout(() => {
            this.goBack();
          }, 3000);
        },
        error: (error) => {},
      });
  }
}
