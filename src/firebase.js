// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: "AIzaSyDZIMBtWocHYpiOninuzzqwmun0J4SiXv4",
//   authDomain: "iot1-ec509.firebaseapp.com",
//   databaseURL: "https://iot1-ec509-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "iot1-ec509",
//   storageBucket: "iot1-ec509.firebasestorage.app",
//   messagingSenderId: "723928841452",
//   appId: "1:723928841452:web:3e28227d3611f8af8579c9",
//   measurementId: "G-NXKKZ5YXVJ"
// };
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export default database;
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AlzaSyDZIMBtWocHYpiOninuzzqwmun0J4SiXv4",
//   authDomain: "iot1-ec509.firebaseapp.com",
//   databaseURL: "https://iot1-ec509-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "iot1-ec509",
//   storageBucket: "iot1-ec509.appspot.com",
//   messagingSenderId: "723928841452",
//   appId: "1:723928841452:web:3e28227d3611f8af8579c9"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const auth = getAuth(app);

// // export { db, auth, signInWithEmailAndPassword };
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";

// // Konfigurasi Firebase kamu
// const firebaseConfig = {
//   apiKey: "AlzaSyDZIMBtWocHYpiOninuzzqwmun0J4SiXv4",
//   authDomain: "iot1-ec509.firebaseapp.com",
//   databaseURL: "https://iot1-ec509-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "iot1-ec509",
//   storageBucket: "iot1-ec509.appspot.com",
//   messagingSenderId: "723928841452",
//   appId: "1:723928841452:web:3e28227d3611f8af8579c9"
// };

// // Inisialisasi Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const auth = getAuth(app);

// export { db, auth };
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZIMBtWocHYpiOninuzzqwmun0J4SiXv4",
  authDomain: "iot1-ec509.firebaseapp.com",
  databaseURL: "https://iot1-ec509-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot1-ec509",
  storageBucket: "iot1-ec509.appspot.com",
  messagingSenderId: "723928841452",
  appId: "1:723928841452:web:3e28227d3611f8af8579c9",
  measurementId: "G-NXKKZ5YXVJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
