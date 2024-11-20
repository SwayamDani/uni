import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import './MyGroups.css';

const MyGroups = () => {
  const { isSignedIn } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [directions, setDirections] = useState(null);
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.example.com/my-groups');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setGroups(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchGroups();
    } else {
      navigate('/unirides/login');
    }
  }, [isSignedIn, navigate]);

  const calculateRoute = async (startPoint, destination) => {
    if (!isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: startPoint,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirections(result);
  };

  if (loading) {
    return (
      <div className='loading'>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-groups">
      <h1>My Groups</h1>
      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        groups.map((group, index) => (
          <div key={index} className="group-card">
            <h2>{group.name}</h2>
            <p><strong>Destination:</strong> {group.destination}</p>
            <p><strong>Start Point:</strong> {group.startPoint}</p>
            <p><strong>Date:</strong> {new Date(group.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {group.startTime}</p>
            <button onClick={() => calculateRoute(group.startPoint, group.destination)}>Show Route</button>
            {directions && (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: directions.routes[0].legs[0].start_location.lat(), lng: directions.routes[0].legs[0].start_location.lng() }}
                zoom={10}
              >
                <DirectionsRenderer directions={directions} />
              </GoogleMap>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyGroups;