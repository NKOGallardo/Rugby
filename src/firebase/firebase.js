import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLL4M7R1Wwdjqug6Uvdmc9bbWAIoQqCXY",
  authDomain: "rugbyathletes-app.firebaseapp.com",
  projectId: "rugbyathletes-app",
  storageBucket: "rugbyathletes-app.appspot.com",
  messagingSenderId: "853215209706",
  appId: "1:853215209706:web:f7c191c1376a0afd168f93",
  measurementId: "G-2RHZRFGG3H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
