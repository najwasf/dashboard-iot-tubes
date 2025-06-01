// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDZIMBtWocHYpiOninuzzqwmun0J4SiXv4",
  authDomain: "iot1-ec509.firebaseapp.com",
  databaseURL: "https://iot1-ec509-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot1-ec509",
  storageBucket: "iot1-ec509.firebasestorage.app",
  messagingSenderId: "723928841452",
  appId: "1:723928841452:web:3e28227d3611f8af8579c9",
  measurementId: "G-NXKKZ5YXVJ"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
