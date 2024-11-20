import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.name || '');
          setEmail(userData.email || '');
          setPhone(userData.mobile || '');
          setUniversity(userData.university || '');
          setPhotoURL(userData.photoURL || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setIsLoading(false);
      navigate('/unirides');
    } catch {
      setIsLoading(false);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleMyGroupsClick = () => {
    navigate('/unirides/my-groups');
  };

  const handleEditProfileClick = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: fullName,
        email: email,
        mobile: phone,
        university: university,
        photoURL: photoURL,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Not Available';
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
    const match = cleanedNumber.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
    return match
      ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
      : phoneNumber;
  };

  return (
    <div className="profile">
      <div className="profile-header">
        {photoURL ? (
          <img src={photoURL} alt="Profile" className="profile-picture" />
        ) : (
          <i
            className="fas fa-user-circle profile-picture"
            aria-hidden="true"
          ></i>
        )}
        <div className="profile-info">
          {isEditing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="edit-input"
              placeholder="Enter your full name"
            />
          ) : (
            <h2>{fullName}</h2>
          )}
        </div>
      </div>

      <div className="profile-details-buttons">
        {isEditing ? (
          <div className="edit-buttons">
            <button
              type="button"
              className="btn btn-save"
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="btn my-groups-button"
              onClick={handleMyGroupsClick}
            >
              My Groups
            </button>
            <button
              type="button"
              className="btn edit-profile-button"
              onClick={handleEditProfileClick}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="btn logout-button"
              id="logout-btn"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging Out...' : 'Logout'}
            </button>
          </>
        )}
      </div>

      <div className="contact-info">
        <h3>Contact Information</h3>
        {isEditing ? (
          <div className="edit-contact-info">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="edit-input"
              placeholder="Email Address"
              disabled
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="edit-input"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="edit-input"
              placeholder="University"
            />
          </div>
        ) : (
          <div className="view-contact-info">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Phone:</strong> {formatPhoneNumber(phone)}
            </p>
            <p>
              <strong>University:</strong> {university}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
