// Enhanced LandingPage.js for better UI/UX - Commercial Version after Login/Signup

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './LandingPage.css';

const LandingPage = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleJoinGroup = () => {
    navigate('/join-group');
  };

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="landing-page">
        <div className="welcome-container">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="welcome-container">
        <h1>Welcome, {fullName || 'Guest'}!</h1>
        <p>
          We're thrilled to have you here! Explore your groups or create a new
          one to get started.
        </p>
      </div>
      <div className="actions">
        <div className="action-card" onClick={() => navigate('/my-groups')}>
          <span className="action-icon">🚗</span>
          <h3>My Groups</h3>
          <p>View and manage the groups you belong to.</p>
        </div>
        <div className="action-card" onClick={handleJoinGroup}>
          <span className="action-icon">👥</span>
          <h3>Join Group</h3>
          <p>Find and join a group that fits your interests.</p>
        </div>
        <div className="action-card" onClick={handleCreateGroup}>
          <span className="action-icon">➕</span>
          <h3>Create Group</h3>
          <p>Create your own group and invite others to join.</p>
        </div>
        <div className="action-card" onClick={handleEditProfile}>
          <span className="action-icon">👤</span>
          <h3>Profile</h3>
          <p>View and edit your profile information.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
