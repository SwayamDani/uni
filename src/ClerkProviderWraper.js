// src/ClerkProviderWrapper.js
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router } from 'react-router-dom';

const frontendApi = "pk_test_dXByaWdodC1waXJhbmhhLTcwLmNsZXJrLmFjY291bnRzLmRldiQ"; // Replace this with your actual key

const ClerkProviderWrapper = ({ children }) => {
  if (!frontendApi) {
    console.error('Missing Clerk frontend API key.');
  }

  return (
    <ClerkProvider frontendApi={frontendApi}>
      <Router>{children}</Router>
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
