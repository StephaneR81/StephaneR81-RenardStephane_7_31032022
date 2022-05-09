import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {}
}
