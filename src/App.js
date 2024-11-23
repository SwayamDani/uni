// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LearnMore from './components/LearnMore';
import Profile from './components/Profile';
import Cards from './components/Cards';
import CreateGroup from './components/CreateGroup';
import Login from './components/Login';
import MyGroups from './components/MyGroups';
import GroupPage from './components/GroupPage';
import LandingPage from './components/LandingPage';

import { App as CapacitorApp } from '@capacitor/app';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              name: user.displayName,
              email: user.email,
            });
            navigate('/welcome');
          } else {
            navigate('/profile');
          }
        } catch (error) {
          console.error('Error handling user document:', error);
        }
      } else {
        navigate('/login');
      }
    });

    const handleRedirect = (data) => {
      console.log('appUrlOpen listener triggered with url:', data.url);
    };

    CapacitorApp.addListener('appUrlOpen', handleRedirect);

    return () => {
      unsubscribe();
      CapacitorApp.removeListener('appUrlOpen', handleRedirect);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/join-group" element={<Cards />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/welcome" element={<LandingPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;