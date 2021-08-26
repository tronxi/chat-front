importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDE3WM57i0zAjs41iU7wNcvoigQLwFy9tI',
  authDomain: 'chat-7617c.firebaseapp.com',
  projectId: 'chat-7617c',
  storageBucket: 'chat-7617c.appspot.com',
  messagingSenderId: '539064365836',
  appId: '1:539064365836:web:a09888ab65755b7c7b4f29',
  measurementId: 'G-8J1TLPYP2Z'
})

const messaging = firebase.messaging();
