import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private userToken!: any;
  private userId!: any;
  public response!: string;
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.userToken = this.loginService.getTokenFromStorage();
    this.userId = this.loginService.getUserIdFromStorage();
  }

  //isAdmin
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true' ? true : false;
  }
  //If user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }

  //Function logOut()
  logout(): void {
    this.loginService.logout();
  }
}
