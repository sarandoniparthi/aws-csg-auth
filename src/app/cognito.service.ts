import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../environments/environment";
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

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
      ClientId: environment.clientId,
      AppWebDomain: environment.appWebDomain, 
      TokenScopesArray: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      RedirectUriSignIn: environment.redirectUriSignIn,
      UserPoolId: environment.userPoolId,
      RedirectUriSignOut: environment.redirectUriSignOut,
      AdvancedSecurityDataCollectionFlag: false
    }

    this.auth = new CognitoAuth(this.authData);

    this.auth.userhandler = {
      onSuccess: session => {
        console.log('Signin success');
        this.signedIn(session);
        
        // You can use amazon-cognito-identity-js to receive informationa about your current user:
        var param = {
          UserPoolId: environment.userPoolId,
          ClientId: environment.clientId
        }
        var userPool = new CognitoUserPool(param);
        var user = userPool.getCurrentUser();
        user.getSession(function(err, session) {
          if (err) {
            console.log(err, err.stack)
          } else {
            console.log();
          }
        });

        user.getUserAttributes(function(err, data) {
          if (err) {
            console.log(err, err.stack)
          }
          else {
            console.log(data)
          }
        });

        // Use the auth credentials to create credentials from the STS metadata service and use it for any further API call
        AWS.config.region = 'us-east-1'
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: environment.identityPoolId,
          Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_4wy70wcTZ": this.session.idToken.jwtToken
          }
        });

        AWS.config.getCredentials(function(err){
          if (err) {
            console.log(err, err.stack)
          }
        });
        var sts = new AWS.STS({region: environment.region})
        sts.getCallerIdentity(function(err, data) {
          if (err) {
            console.log(AWS.config.credentials);
            console.log(err, err.stack);
          } else {
            console.log(data);
          }
        });
        
        
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