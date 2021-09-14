import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyAegEJCmDN0WBhC7DyA74sh1eoM3m4ItVE",
    authDomain: "chat-web-app-651fc.firebaseapp.com",
    databaseURL: "https://chat-web-app-651fc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-web-app-651fc",
    storageBucket: "chat-web-app-651fc.appspot.com",
    messagingSenderId: "1079980904021",
    appId: "1:1079980904021:web:13c66773284ab42ffe8edc"
  };
  const app = firebase.initializeApp(firebaseConfig);
  export const auth = app.auth();
  export const database = app.database();
  export const storage = app.storage();