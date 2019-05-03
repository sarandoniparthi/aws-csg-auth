import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../environments/environment";
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
//import {CognitoAuth} from 'amazon-cognito-auth-js-promises';
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
  accessKeyId: any;
  secretaccesskey: any;
  sessiontoken: any;
  user: any;


  constructor(private router: Router) {

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
      },
      onFailure: error => {
        console.log('Error: ' + error);
        this.onFailureMethod();
      }
    }
    this.auth.parseCognitoWebResponse(this.router.url);
  }

  signedIn(session) {
    this.session = session;
    /*  console.log(session);*/

    // Use the auth credentials to create credentials from the STS metadata service and use it for any further API call
    AWS.config.region = environment.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.identityPoolId,
      Logins: {
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_4wy70wcTZ": this.session.idToken.jwtToken
      }
    });

   
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
    //this.auth.parseCognitoWebResponse(this.router.url);
  }

  signOut() {
    this.auth.signOut();

  }

  details(){

   // Credentials will be available when this function is called.
   AWS.config.getCredentials(function () {

    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretaccesskey = AWS.config.credentials.secretAccessKey;
    var sessiontoken = AWS.config.credentials.sessionToken;
    console.log(`
       accesskeyid: ${accessKeyId} 
       secretaccesskey: ${secretaccesskey} 
       sessiontoken: ${sessiontoken}
       `);
  });
  
  
  //reading dynamodb table names
  AWS.config.update({ region: "us-east-1" });
  var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  ddb.listTables({ Limit: 10 }, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table names are ", data.TableNames);
    }
  });



 // Call S3 to list the buckets
 /* var s3 = new AWS.S3({apiVersion: '2006-03-01'});    
  s3.listBuckets(function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Buckets);
    }
  }); 
  */



  // sending emails using sms from aws

  // var params = {
  //   Destination: { /* required */
  //     CcAddresses: [
  //         /* 'Suresh.Gangavarapu@broadridge.com',
  //     more items */
  //     ],
  //     ToAddresses: [
  //       'saran.doniparthi@broadridge.com',
  //       /* more items */
  //     ]
  //   },
  //   Message: { /* required */
  //     Body: { /* required */
  //       Html: {
  //        Charset: "UTF-8",
  //        Data: "HTML_FORMAT_BODY"
  //       },
  //       Text: {
  //        Charset: "UTF-8",
  //        Data: "TEXT_FORMAT_BODY"
  //       }
  //      },
  //      Subject: {
  //       Charset: 'UTF-8',
  //       Data: 'Test email'
  //      }
  //     },
  //   Source: 'saran.doniparthi@broadridge.com', /* required */
  //   ReplyToAddresses: [
  //      /* 'EMAIL_ADDRESS',
  //     more items */
  //   ],
  // };
  
  // // Create the promise and SES service object
  // var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // // Handle promise's fulfilled/rejected states
  // sendPromise.then(
  //   function(data) {
  //     console.log(data.MessageId);
  //   }).catch(
  //     function(err) {
  //     console.error(err,err.stack);
  //   });
















  // You can use amazon-cognito-identity-js to receive information about your current user:
  var param = {
    UserPoolId: environment.userPoolId,
    ClientId: environment.clientId
  }
  var userPool = new CognitoUserPool(param);
  this.user = userPool.getCurrentUser();

  //After successfull login,getting session tockens.
  this.user.getSession(function (err, session) {
    if (err) {
      console.log(err, err.stack);
    } else {
      // console.log(session);
    }
  });


  this.user.getUserAttributes(function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      //console.log(`user attributes:${data}`);
      for (let i = 0; i < data.length; i++) {
        console.log(`attribute  ${data[i].getName()}  has value  ${data[i].getValue()}`);
      }
    }
  });



  }




}