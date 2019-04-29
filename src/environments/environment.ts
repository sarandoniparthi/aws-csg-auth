// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  region: 'us-east-1',

  appWebDomain: 'csgdev.auth.us-east-1.amazoncognito.com',
  redirectUriSignIn: 'http://localhost:4200/home',
  redirectUriSignOut: 'http://localhost:4200',
  identityPoolId: 'us-east-1:b031029b-d6b6-4754-8e1a-1c3eade9d940',
  userPoolId: 'us-east-1_4wy70wcTZ',
  clientId: '2qi96vb65fbcevu1h1av8uen31'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
