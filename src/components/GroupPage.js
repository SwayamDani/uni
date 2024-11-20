import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import './GroupPage.css';
import { useGoogleMaps } from './GoogleMapsContext';

const GroupPage = () => {
  const { groupId } = useParams();
  const [user] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const google = useGoogleMaps();

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

  const calculateAndDisplayRoute = useCallback((
    directionsService,
    directionsRenderer,
    startPoint,
    destination
  ) => {
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
  }, [google.maps.TravelMode.DRIVING ]);

  const initMap = useCallback((startPoint, destination) => {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      disableDefaultUI: true,
    });

    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('sidebar'));

    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer,
      startPoint,
      destination
    );
  }, [ google.maps, calculateAndDisplayRoute ]);

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
      navigate('/unirides');
    } catch (error) {
      console.error('Error leaving group: ', error);
    }
  };

  

  

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
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
      <div id="content">
        <div id="map" style={{ width: '100%', margin: '1rem 0' }}></div>
        <div id="sidebar"></div>
      </div>
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/unirides')}
      >
        Back to Groups
      </Button>
      <Button variant="contained" color="secondary" onClick={handleLeaveGroup}>
        Leave Group
      </Button>
    </Container>
  );
};

export default GroupPage;
