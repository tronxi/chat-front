declare global {
  interface Window {
    env: any;
  }
}

export const environment = {
  production: true,
  url: window.env.url || 'http://localhost:8080',
  wsUrl: window.env.wsUrl || 'ws://localhost:8080/socket',
  baseRef: window.env.baseRef || '/',
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
