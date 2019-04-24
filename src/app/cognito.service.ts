import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuth } from 'amazon-cognito-auth-js';

@Injectable(
  {
  providedIn: 'root'
  }
)
export class CognitoService {

  authData: any;
  auth: any;
  session: any;

  constructor(private router : Router) {
    this.getAuthInstance();
  }

  getAuthInstance() {
    this.authData = {
      ClientId: '2qi96vb65fbcevu1h1av8uen31',
      AppWebDomain: 'csgdev.auth.us-east-1.amazoncognito.com', 
      TokenScopesArray: ['openid', 'email'],
      RedirectUriSignIn: 'http://localhost:4200/home',
      UserPoolId: 'us-east-1_4wy70wcTZ',
      RedirectUriSignOut: 'http://localhost:4200',
      AdvancedSecurityDataCollectionFlag: false
    }

    this.auth = new CognitoAuth(this.authData);

    this.auth.userhandler = {
      onSuccess: session => {
        console.log('Signin success');
        this.signedIn(session);
      },
      onFailure: error => {
        console.log('Error: ' + error);
        this.onFailureMethod();
      }
    }

    //alert(this.router.url);
    //this.auth.useCodeGrantFlow();
    this.auth.parseCognitoWebResponse(this.router.url);
  }

  signedIn(session) {
    this.session = session;
  }

  onFailureMethod() {
    this.session = undefined;
  }

  get accessToken() {
    return this.session && this.session.getAccessToken().getJwtToken();
  }

  get isAuthenticated() {
    return this.auth.isUserSignedIn();
  }

  login() {
    this.auth.getSession();
    this.auth.parseCognitoWebResponse(this.router.url);
  }

  signOut() {
    this.auth.signOut();
  }
}