import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserlistComponent implements OnInit {
  public usersList!: any;
  private userToken!: any;
  public response!: string;
  public textBoxStyle: any = { color: '#000' };
  public noUser: boolean = true;
  public clicked: boolean = false;

  constructor(
    private loginService: LoginService,
    private registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userToken = this.loginService.getTokenFromStorage();
    this.getUsers();
  }

  //Get all users excepted administrator
  getUsers() {
    this.loginService.getAllUsers(this.userToken).subscribe({
      next: (data) => {
        this.textBoxStyle.color = 'green';
        this.response = data.message;
        this.noUser = Object.values(data.users).length > 0 ? false : true;
        this.usersList = data.users;
      },
      error: (error) => {
        this.textBoxStyle.color = 'red';
        this.response = error.message;
      },
    });
  }

  //DeleteUserAccount() function
  deleteUserAccount(userIdToDelete: string, userName: string) {
    if (
      !window.confirm(
        `Souhaitez-vous supprimer définitivement le compte de : ${userName} ?`
      )
    ) {
      return;
    }
    this.registerService
      .deleteAccount(this.userToken, userIdToDelete)
      .subscribe({
        next: (data) => {
          this.textBoxStyle.color = 'green';
          this.response = data.message;
          setTimeout(() => {
            this.getUsers();
          }, 3000);
        },
        error: (error) => {
          this.textBoxStyle.color = 'red';
          this.response = error.message;
        },
      });
  }
}
