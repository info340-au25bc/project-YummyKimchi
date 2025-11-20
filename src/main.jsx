import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './components/App.jsx'
import { BrowserRouter } from 'react-router'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtACkvgx6ONxH73yQtCBvBd2ND6BEyh0o",
  authDomain: "info340-web-app.firebaseapp.com",
  projectId: "info340-web-app",
  storageBucket: "info340-web-app.firebasestorage.app",
  messagingSenderId: "1060014760686",
  appId: "1:1060014760686:web:e31a226d38ee0538a4c9ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><App /></BrowserRouter>);
