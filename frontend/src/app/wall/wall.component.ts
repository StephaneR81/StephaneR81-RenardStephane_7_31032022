import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { PictureService } from '../services/picture.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
})
export class WallComponent implements OnInit {
  public pictureForm!: any;
  public submitted: boolean = false;
  public formErrorMessage: string = 'Champ requis ou erroné';
  public noPictureMsg: string = '';
  public response!: any;
  public pictures!: any;
  private userToken!: any;
  private userId!: any;
  public selectedFile!: string;
  constructor(
    private pictureService: PictureService,
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
    this.initForm();
    this.getAllPictures();
  }

  //Function initForm()
  initForm() {
    this.pictureForm = this.formBuilder.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      file: ['', Validators.compose([Validators.required])],
    });
  }

  //Return form controls
  get formControls() {
    return this.pictureForm.controls;
  }

  //File change event
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file.name;
      console.log(this.selectedFile);
      this.pictureForm.patchValue({
        file,
      });
    }
  }

  //Function for sending a new picture
  sendPicture() {
    this.submitted = true;
    if (this.pictureForm.invalid) {
      return;
    }

    const body: any = {
      userId: this.userId,
      title: this.pictureForm.get('title').value,
    };

    const formData: FormData = new FormData();
    const file: any = this.pictureForm.get('file').value;
    formData.append('image', file);
    formData.append('picture', JSON.stringify(body));

    this.pictureService.postOnePicture(this.userToken, formData).subscribe({
      next: (data) => {
        this.response = data.message;
        this.getAllPictures();
      },
      error: (error) => {
        this.response = error.error.message;
      },
    });
    this.submitted = false;
    this.pictureForm.reset();
  }

  //Function that request all pictures from PictureService
  getAllPictures() {
    if (this.userToken !== null) {
      this.pictureService.getAllPictures(this.userToken).subscribe({
        next: (data) => {
          this.noPictureMsg = '';
          this.pictures = data;
        },
        error: (error) => {
          if (error.status === 404) {
            this.noPictureMsg = "Il n'y a pas encore de photo à afficher !";
          } else {
            this.noPictureMsg = '';
          }
        },
      });
    }
  }
}
