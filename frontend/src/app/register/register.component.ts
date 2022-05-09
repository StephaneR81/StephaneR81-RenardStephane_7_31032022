import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { Register } from '../models/register';
import { RegisterService } from '../services/register/register.service';

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
  response!: any;

  constructor(
    private registerService: RegisterService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
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

  //Function to send data request
  public saveNewUser(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.dataToPost = { ...this.registerForm.value, isAdmin: 'false' };

    this.registerService.registerNewUser(this.dataToPost).subscribe((data) => {
      this.response = data;
    });
  }
}
