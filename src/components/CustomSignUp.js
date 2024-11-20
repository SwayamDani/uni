import React from 'react';
import { SignedIn, SignedOut, SignUp } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import './CustomSignUp.css'; // Import your custom CSS file

const CustomSignUp = () => {
  return (
    <div className="container">
      <SignedIn>
        <Navigate to="/unirides/profile" />
      </SignedIn>
      <SignedOut>
        <SignUp path="/unirides/signup" routing="path" signInUrl="/unirides/login" className="custom-signup" />
      </SignedOut>
    </div>
  );
};

export default CustomSignUp;