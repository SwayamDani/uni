import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSyncAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { collection, getDocs, updateDoc, doc, arrayUnion, query, where } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import './Cards.css';

const Cards = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [filter, setFilter] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilter, setShowFilter] = useState(false);
  const [buttonText, setButtonText] = useState("Join Group");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const cardWrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData();
      } else {
        navigate('/unirides/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = () => {
    setLoading(true);
    const groups = collection(db, 'groups');
    let q = groups;
    if (appliedFilter.length > 0) {
      q = query(groups, where('groupType', 'in', appliedFilter));
    }
    getDocs(q)
      .then(response => {
        const data = response.docs.map(doc => ({ ...doc.data(), date: doc.data().date.toDate(), id: doc.id }));
        setData(data);
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  };

  const handleCardClick = async (item, index) => {
    if (flippedCardIndex === index) {
      setFlippedCardIndex(null);
    } else {
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.destination)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
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

  const handleMapClick = (event) => {
    event.stopPropagation();
  };

  const handleButtonClick = async (event, item) => {
    event.stopPropagation();
    const name = user.displayName;
    if (item.ridees.includes(name)) {
      alert("You are already in the group.");
      navigate(`/unirides/group/${item.id}`);
    } else if (item.seatsAvailable > 0) {
      try {
        const groupDoc = doc(db, 'groups', item.id);
        await updateDoc(groupDoc, {
          seatsAvailable: item.seatsAvailable - 1,
          ridees: arrayUnion(name)
        });
        setButtonText("Joined Group");
        setButtonDisabled(true);
        navigate(`/unirides/group/${item.id}`);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      setButtonText("Group Full");
      setButtonDisabled(true);
    }
  };

  const scrollLeft = () => {
    cardWrapperRef.current.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    cardWrapperRef.current.scrollBy({ left: 600, behavior: 'smooth' });
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = () => {
    const checkedValues = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
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
      <div className='loading'>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="groups-container">
      <div className='cards' id="cards">
        <button className={`scroll-left ${showFilter ? 'shifted' : ''}`} id="scroll-button" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="filter-icon" onClick={toggleFilter}>
          <FontAwesomeIcon icon={faFilter} size="2x" />
        </div>
        {showFilter && (
          <div className="filter-sort-container">
            <div className="filter-box">
              <div className="filter">
                <label>Filter by destination:</label>
                <div>
                  <label>
                    <input type="checkbox" value="groceries"/>
                    Groceries
                  </label>
                  <label>
                    <input type="checkbox" value="airport"/>
                    Airport
                  </label>
                  <label>
                    <input type="checkbox" value="metro"/>
                    Metro/BART
                  </label>
                  <label>
                    <input type="checkbox" value="home"/>
                    Home
                  </label>
                  <label>
                    <input type="checkbox" value="on_campus"/>
                    On Campus
                  </label>
                  <label>
                    <input type="checkbox" value="other"/>
                    Other
                  </label>
                </div>
                <button onClick={applyFilter}>Apply Filter</button>
              </div>
              <div className="sort">
                <label htmlFor="sortOrder">Sort by date:</label>
                <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
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
            <button onClick={() => navigate('/unirides/create-group')}>Create Group</button>
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
                    <div className="card-header">{item.destination || 'Unknown Destination'}</div>
                    <div className="card-body">
                      <p>Owner: {item.owner || 'Unknown'}</p>
                      <p>Start Point: {truncateText(item.startPoint || '', 6)}</p>
                      <p>Date: {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown'}</p>
                      <p>Time: {item.startTime || 'Unknown'}</p>
                    </div>
                    <div className="flip-icon">
                      <FontAwesomeIcon icon={faSyncAlt}/>
                    </div>
                  </div>
                  <div className="card-back">
                    {flippedCardIndex === index && item.coordinates && (
                      <div className="modal-content" onClick={handleMapClick}>
                        <div className="modal-header">
                          {item.destination}
                        </div>
                        <div className="modal-body">
                          <GoogleMap
                            mapContainerStyle={{width: '100%', height: '100%'}}
                            center={item.coordinates}
                            zoom={15}
                          >
                            <Marker position={item.coordinates}/>
                          </GoogleMap>
                        </div>
                        <div className="modal-footer">
                          <button onClick={(event) => handleButtonClick(event, item)} disabled={buttonDisabled}>
                            {buttonText}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-right" id="scroll-button" onClick={scrollRight}>
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;