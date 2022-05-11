import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PictureService } from '../services/picture.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
})
export class WallComponent implements OnInit {
  public pictures!: any;
  constructor(
    private pictureService: PictureService,
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getAllPictures();
  }

  //Function that request all pictures from PictureService
  getAllPictures() {
    const token = this.loginService.getTokenFromStorage();
    if (token !== null) {
      this.pictureService.getAllPictures(token).subscribe({
        next: (data) => {
          console.log('PICTURES DATA ', data);
          this.pictures = data;
          console.log(this.pictures);
        },
        error: (error) => {
          console.log('PICTURES ERROR ', error);
        },
      });
    }
  }
}
