import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    university: ''
  });
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          navigate('/welcome'); // Redirect if user is already logged in
        } else {
          setIsNewUser(true);
        }
      }
    };

    checkUser();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await handleUserProfile(user);
    } catch (error) {
      setError('Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let userCredential;
      if (isNewUser) {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      const user = userCredential.user;
      await handleUserProfile(user);
    } catch (error) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserProfile = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      navigate('/welcome');
    } else {
      await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
        mobile: formData.mobile,
        university: formData.university,
      });
      navigate('/welcome');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isNewUser ? 'Sign Up' : 'Sign In'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          {isNewUser && (
            <>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
              />
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                placeholder="University"
              />
            </>
          )}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : isNewUser ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button className="google-signin" onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? 'Redirecting...' : 'Sign in with Google'}
        </button>
        <p onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser ? 'Have an account? Sign In' : 'New user? Sign Up'}
        </p>
      </div>
    </div>
  );
};

export default Login;
