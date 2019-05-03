import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cognitoService: CognitoService, private router: Router) {
    if (this.router.url.indexOf('?') !== -1 && this.cognitoService.isAuthenticated) {
      this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
    } else {
      this.cognitoService.login();
    }
  }


  ngOnInit() { }
  printUserDetails() {
    console.log(this.cognitoService.auth);
  }


  printToken() {
    console.log(this.cognitoService.accessToken);
  }

  signOut() {
    this.cognitoService.signOut();
  }

  getdt(){
this.cognitoService.details();

  }

}