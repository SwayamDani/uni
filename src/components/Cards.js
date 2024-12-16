import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFilter } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../firebase';
import { fetchGroups, joinGroup } from '../api/firebase';
import './Cards.css';

const Cards = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilter, setShowFilter] = useState(false);
  const [buttonText, setButtonText] = useState('Join Group');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const cardWrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const groupsData = await fetchGroups(appliedFilter);
      setData(groupsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [appliedFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCardClick = async (item, index) => {
    if (flippedCardIndex === index) {
      setFlippedCardIndex(null);
    } else {
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.destination)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.results.length > 0) {
        const location = geocodeData.results[0].geometry.location;
        item.coordinates = location;
      } else {
        item.coordinates = null;
      }
      setFlippedCardIndex(index);
    }
  };

  const handleButtonClick = async (event, item) => {
    event.stopPropagation();
    const name = user.displayName;
    if (item.ridees.includes(name)) {
      alert('You are already in the group.');
      navigate(`/group/${item.id}`);
    } else if (item.seatsAvailable > 0) {
      try {
        await joinGroup(item.id, name);
        setButtonText('Joined Group');
        setButtonDisabled(true);
        navigate(`/group/${item.id}`);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    } else {
      setButtonText('Group Full');
      setButtonDisabled(true);
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = () => {
    const checkedValues = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);
    setAppliedFilter(checkedValues);
    fetchData();
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const truncateText = (text, wordLimit) => {
    return text.split(' ').slice(0, wordLimit).join(' ');
  };

  if (loading) {
    return (
      <div className="loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
  <div className="groups-container">
    <div className={`cards ${showFilter ? 'filter-visible' : ''}`} id="cards">
      <div className="filter-icon" onClick={toggleFilter}>
        <FontAwesomeIcon icon={faFilter} size="2x" />
      </div>
      {showFilter && (
        <div className="filter-sort-container">
          <div className="filter-box">
            <div className="filter">
              <div>Filter:</div>
              <div>
                <label>
                  Groceries
                  <input type="checkbox" value="groceries" />
                </label>
                <label>
                  Airport
                  <input type="checkbox" value="airport" />
                </label>
                <label>
                  Metro/BART
                  <input type="checkbox" value="metro" />
                </label>
                <label>
                  Home
                  <input type="checkbox" value="home" />
                </label>
                <label>
                  On Campus
                  <input type="checkbox" value="on_campus" />
                </label>
                <label>
                  Other
                  <input type="checkbox" value="other" />
                </label>
              </div>
              <button onClick={applyFilter}>Apply Filter</button>
            </div>
            <div className="sort">
              <label htmlFor="sortOrder">Sort by date:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {sortedData.length === 0 ? (
        <div className="no-data">
          <p>No groups available. Create a new group?</p>
          <button onClick={() => navigate('/create-group')}>
            Create Group
          </button>
        </div>
      ) : (
        <div className="card__group">
          <div className="card-wrapper" ref={cardWrapperRef}>
            {sortedData.map((item, index) => (
              <div
                key={index}
                className={`card text-white bg-transparent ${flippedCardIndex === index ? 'flipped' : ''}`}
                onClick={() => handleCardClick(item, index)}
              >
                <div className="card-front">
                  <div className="card-header">
                    {item.destination || 'Unknown Destination'}
                  </div>
                  <div className="card-body">
                    <p>Owner: {item.owner || 'Unknown'}</p>
                    <p>
                      Start Point: {truncateText(item.startPoint || '', 6)}
                    </p>
                    <p>
                      Date:{' '}
                      {item.date
                        ? isNaN(new Date(item.date))
                          ? 'Invalid'
                          : new Date(item.date).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                    <p>Time: {item.startTime || 'Unknown'}</p>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={(event) => handleButtonClick(event, item)}
                      disabled={buttonDisabled}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default Cards;
