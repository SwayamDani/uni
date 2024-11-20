// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/login'); // Navigate to the login page when the profile icon is clicked
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        UniRides
      </Link>
      <div className="navbar__links">
        <Link to="/join-group" className="navbar__link">
          Join a Group
        </Link>
        <Link to="/create-group" className="navbar__link">
          Create Group
        </Link>
        <Link to="/learn-more" className="navbar__link">
          About Us
        </Link>
        <div
          className="navbar__profile"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-user"></i> {/* Profile Icon */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
