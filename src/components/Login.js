// src/components/Login.js
import React, { useEffect, useRef, useState } from 'react';
import * as firebaseui from 'firebaseui';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import {auth, firebase} from '../firebase'
import { useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css'; // Import FirebaseUI CSS
import './Login.css'; // Optional: Your custom styles

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: "/home", // Redirect after login
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          console.log("User signed in:", authResult.user);
          navigate("/home");
          return false; // Prevent FirebaseUI from redirecting
        },
      },
    };

    const ui = new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", uiConfig);

    return () => ui.delete(); // Cleanup on unmount
  }, [navigate]);

  return (
    <div>
      <h2>Login</h2>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Login;