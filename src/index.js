// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { LoadScript } from '@react-google-maps/api';
import App from './App';
import { GoogleMapsProvider } from './components/GoogleMapsContext';
import './index.css';

const clerkKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LoadScript googleMapsApiKey={api_key} libraries={['places']}>
      <GoogleMapsProvider>
        <ClerkProvider publishableKey={clerkKey}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClerkProvider>
      </GoogleMapsProvider>
    </LoadScript>
  </React.StrictMode>
);