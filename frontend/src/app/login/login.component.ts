import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../models/login';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public submitted: boolean = false;
  public formErrorMessage: string = 'Champ requis ou erroné';
  private dataToPost!: Login;
  public response!: any;
  public returnUrl!: string;
  public textBoxStyle: any = { color: '#000' };

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = '/dashboard';
    this.loginService.logout();
  }

  //Function initForm()
  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(6),
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

  //Return form controls
  get formControls() {
    return this.loginForm.controls;
  }

  //Function to connect the user
  connectUser() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    //Set the dataToPost object containing the body of the POST request
    this.dataToPost = { ...this.loginForm.value };

    //Call to the Login service for connecting the user
    this.loginService.connectUser(this.dataToPost).subscribe({
      next: (data) => {
        this.textBoxStyle.color = 'green';
        this.response = data.message;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        this.router.navigateByUrl('/wall');
      },
      error: (error) => {
        this.textBoxStyle.color = 'red';
        this.response = error.error.message;
      },
    });
  }
}
