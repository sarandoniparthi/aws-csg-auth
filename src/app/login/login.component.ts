import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private cognitoService : CognitoService, private router : Router) {
    if(!this.cognitoService.isAuthenticated) {
      console.log("Not authenticated")
    } else {
      console.log("Already authenticated")
      this.router.navigateByUrl(this.router.url + "/home");
    }
   }

  ngOnInit() { }

  loginWithADFS() {
    this.cognitoService.login();
  }
}