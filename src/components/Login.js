// src/components/Login.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import* as firebaseui from 'firebaseui';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Ensure these are correctly exported from firebase.js
import 'firebaseui/dist/firebaseui.css'; // Import FirebaseUI styles
import './Login.css'; // Import your custom styles

const Login = () => {
  const uiRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize FirebaseUI Auth
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(auth);

    // FirebaseUI configuration
    const uiConfig = {
      signInFlow: 'popup', // Use 'redirect' for mobile compatibility
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
        // Add other providers if needed
      ],
      callbacks: {
        signInSuccessWithAuthResult: async (authResult) => {
          console.log("loggedin");
          const user = authResult.user;
          try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              // Existing user: Redirect to profile
              navigate('/welcome');
            } else {
              // New user: Create user document and redirect to welcome
              await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                mobile: '',
                university: '',
              });
              navigate('/welcome');
            }
          } catch (err) {
            console.error('Error fetching or creating user document:', err);
            setError('An error occurred during authentication. Please try again.');
          }

          return false; // Prevent FirebaseUI from automatically redirecting
        },
        signInFailure: (error) => {
          console.error('Sign-in failure:', error);
          setError(error.message);
          return false; // Prevent FirebaseUI from performing default behavior
        },
      },
    };

    // Start FirebaseUI
    ui.start(uiRef.current, uiConfig);

    // Cleanup FirebaseUI on component unmount
    return () => {
      ui.reset();
    };
  }, [auth, navigate, db]);

  return (
    <div className="login-container">
      {error && <p className="error-message">{error}</p>}
      <div ref={uiRef} />
    </div>
  );
};

export default Login;