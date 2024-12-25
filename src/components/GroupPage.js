import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import CardChat from '../components/chat';
import {Button, CircularProgress, Container, Typography, Alert, Snackbar} from '@mui/material';
import './GroupPage.css';
import { useGoogleMaps } from './GoogleMapsContext';

const GroupPage = () => {
  const { groupId } = useParams();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const google = useGoogleMaps();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchGroup = async () => {
      try {
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          setGroup({ ...groupData, date: groupData.date.toDate() });
        } else {
          setError('Group not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const calculateAndDisplayRoute = useCallback(
    (directionsService, directionsRenderer, startPoint, destination) => {
      directionsService
        .route({
          origin: startPoint,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
        })
        .catch((e) => window.alert('Directions request failed due to ' + e));
    },
    [google.maps.TravelMode.DRIVING]
  );

  const initMap = useCallback((startPoint, destination) => {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      disableDefaultUI: false, // Enable default UI for better navigation
      zoomControl: true,
    });

    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('sidebar'));

    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer,
      startPoint,
      destination
    );
  }, [google.maps, calculateAndDisplayRoute]);

  useEffect(() => {
    if (group && group.startPoint && group.destination) {
      initMap(group.startPoint, group.destination);
    }
  }, [group, initMap]);

  const handleLeaveGroup = async () => {
    try {
      const groupDoc = doc(db, 'groups', groupId);
      await updateDoc(groupDoc, {
        seatsAvailable: group.seatsAvailable + 1,
        ridees: arrayRemove(user.fullName),
      });
      setFeedback('You have successfully left the group.');
      navigate('/');
    } catch (error) {
      console.error('Error leaving group: ', error);
      setFeedback('An error occurred while leaving the group.');
    }
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress color="primary" />
        <Typography variant="body1" style={{ marginTop: '1rem', color: '#007bff' }}>
          Please wait while we load the group details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container>
        <Alert severity="warning">Group not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="group-page">
      {feedback && (
        <Snackbar
          open={Boolean(feedback)}
          autoHideDuration={6000}
          message={feedback}
          onClose={() => setFeedback(null)}
        />
      )}
        <div id = "content">
          <div id="map" style={{width: '100%', margin: '1rem 0'}}></div>
          <div id="sidebar"></div>
        </div>
        <div id="panels">
        <div id="left-panel">

        <Typography variant="h4" component="h1">
          {group.destination}
        </Typography>
        <Typography variant="body1">Owner: {group.owner}</Typography>
        <Typography variant="body1">Start Point: {group.startPoint}</Typography>
        <Typography variant="body1">
          Date: {group.date ? group.date.toLocaleDateString() : 'Unknown'}
        </Typography>
        <Typography variant="body1">Time: {group.startTime}</Typography>
        <Typography variant="body1">
          Seats Available: {group.seatsAvailable}
        </Typography>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Groups
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLeaveGroup}>
            Leave Group
          </Button>
        </div>
        </div>
      
        <div id="right-panel">
          <div className="chat-container">
            {user ? (
              <CardChat user={user} groupId={groupId} className={"chat"} />
            ) : (
              <p>Please log in to chat.</p>
            )}
          </div>
        </div>
        </div>
    </Container>
  );
};

export default GroupPage;
