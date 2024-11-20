import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import the Firestore instance directly
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import './Cards.css'; // Reuse the same CSS

const MyGroups = ({ handleButtonClick, buttonDisabled, buttonText }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const name = userDoc.data().name;
        fetchUserGroups(name);
      } else {
        setError('User is not authenticated');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserGroups = async (name) => {
    setLoading(true);
    try {
      const groupsCollection = collection(db, 'groups');
      const q = query(
        groupsCollection,
        where('ridees', 'array-contains', name)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate(),
      }));
      setUserGroups(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  handleButtonClick = (event, item) => {
    event.preventDefault();
    navigate(`/unirides/group/${item.id}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="groups-container">
      <div className="filter-sort-container">
        {/* Add filter and sort options here if needed */}
      </div>
      <div className="card-wrapper">
        {userGroups.map((group, index) => (
          <div className="card" key={index}>
            <div className="card-front">
              <div className="card-header">
                {group.destination || 'Unknown Destination'}
              </div>
              <div className="card-body">
                <p>Owner: {group.owner || 'Unknown'}</p>
                <p>Start Point: {truncateText(group.startPoint || '', 6)}</p>
                <p>
                  Date:{' '}
                  {group.date
                    ? new Date(group.date).toLocaleDateString()
                    : 'Unknown'}
                </p>
                <p>Time: {group.startTime || 'Unknown'}</p>
              </div>
              <div className="card-footer">
                <button
                  onClick={(event) => handleButtonClick(event, group)}
                  disabled={buttonDisabled}
                >
                  Go To Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to truncate text
function truncateText(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export default MyGroups;
