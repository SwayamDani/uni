// src/GoogleMapsContext.js
import React, { createContext, useContext } from 'react';

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  return (
    <GoogleMapsContext.Provider value={window.google}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};