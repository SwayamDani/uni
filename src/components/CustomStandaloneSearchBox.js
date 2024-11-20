import React, { useRef, useEffect } from 'react';

const CustomStandaloneSearchBox = ({ onPlacesChanged, placeholder, className }) => {
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (searchBoxRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (onPlacesChanged) {
          onPlacesChanged(places);
        }
      });
    }
  }, [onPlacesChanged]);

  return (
    <input
      ref={searchBoxRef}
      type="text"
      placeholder={placeholder}
      className={className}
    />
  );
};

export default CustomStandaloneSearchBox;
