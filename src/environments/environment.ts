// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/socket',
  firebaseConfig: {
    apiKey: 'AIzaSyDE3WM57i0zAjs41iU7wNcvoigQLwFy9tI',
    authDomain: 'chat-7617c.firebaseapp.com',
    projectId: 'chat-7617c',
    storageBucket: 'chat-7617c.appspot.com',
    messagingSenderId: '539064365836',
    appId: '1:539064365836:web:a09888ab65755b7c7b4f29',
    measurementId: 'G-8J1TLPYP2Z'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
