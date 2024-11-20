// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/unirides/login'); // Navigate to the login page when the profile icon is clicked
  };

  return (
    <nav className="navbar">
      <Link to="/unirides" className="navbar__logo">
        UniRides
      </Link>
      <div className="navbar__links">
        <Link to="/unirides/join-group" className="navbar__link">
          Join a Group
        </Link>
        <Link to="/unirides/create-group" className="navbar__link">
          Create Group
        </Link>
        <Link to="/unirides/about-us" className="navbar__link">
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
