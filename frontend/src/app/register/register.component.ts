import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../models/register';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public submitted: boolean = false;
  public formErrorMessage: string = 'Champ requis ou erroné';
  private dataToPost!: Register;
  public response!: any;

  constructor(
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  //Function initForm
  initForm() {
    this.registerForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
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
    return this.registerForm.controls;
  }

  //Function calling service for POST request
  public saveNewUser(): void {
    this.submitted = true;

    //If the formular is not valid
    if (this.registerForm.invalid) {
      return;
    }
    //Set the dataToPost object containing the body of the POST request
    this.dataToPost = { ...this.registerForm.value, isAdmin: 'false' };

    //Call to the Register service for registering the new user
    this.registerService.registerNewUser(this.dataToPost).subscribe({
      next: (data) => {
        this.response = data.message;
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        this.response = error.error.message;
      },
    });
  }
}
