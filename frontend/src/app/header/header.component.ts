import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }
  logout(): void {
    this.loginService.logout();
  }
}
