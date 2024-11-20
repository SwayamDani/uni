// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import App from './App';
import { GoogleMapsProvider } from './components/GoogleMapsContext';
import './index.css';

const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <LoadScript googleMapsApiKey={api_key} libraries={['places']}>
      <GoogleMapsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </GoogleMapsProvider>
    </LoadScript>
  </React.StrictMode>
);
