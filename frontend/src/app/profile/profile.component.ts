import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public submitted: boolean = false;
  public profileForm!: FormGroup;
  public response!: any;
  public formErrorMessage: string = 'Champ requis ou erroné';
  private userToken!: any;
  private userId!: any;
  public userInfos: any = {};
  private dialogBoxText: string = `Attention :\r\nLa suppression de votre compte engendrera la perte de vos photos et commentaires.\r\nVoulez-vous vraiment supprimer votre compte ?`;

  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
    this.getUserInfos();
    this.initForm();
  }

  get formControls() {
    return this.profileForm.controls;
  }
  
  //Get user informations
  getUserInfos() {
    this.loginService.getUserDetails(this.userToken, this.userId).subscribe({
      next: (data) => {
        this.userInfos = data.user;
        this.response = data.message;
      },
      error: (error) => {
        this.response = error.message;
      },
    });
  }

  //Init formular
  initForm() {
    this.profileForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });
  }

  editProfile() {
    //If formular fields are invalid
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    let body = {
      userId: String(this.userInfos.id),
      name: this.profileForm.get('name')?.value,
      password: this.profileForm.get('password')?.value,
    };

    //Call to service to delete the account
    this.registerService.editProfile(this.userToken, body).subscribe({
      next: (data) => {
        this.response = data.message;
      },
      error: (error) => {
        this.response = error.message;
      },
    });
  }

  //Delete user account
  deleteAccount(userId: string) {
    //Ask confirmation from user
    if (confirm(this.dialogBoxText) == false) {
      return;
    }

    this.registerService.deleteAccount(this.userToken, userId).subscribe({
      next: (data) => {
        this.response = data.message;
        //Logs the user out
        this.loginService.logout();
        //Redirect the user to login page
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 3000);
      },
      error: (error) => {
        this.response = error.message;
      },
    });
  }
}
