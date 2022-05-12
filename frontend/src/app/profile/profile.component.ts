import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userToken!: any;
  private userId!: any;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
  }

}
