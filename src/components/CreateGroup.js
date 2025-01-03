import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateGroup.css';
import CustomStandaloneSearchBox from './CustomStandaloneSearchBox';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateGroup = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    groupType: '',
    startPoint: '',
    destination: '',
    startTime: '',
    date: '',
    seats: '',
    uberType: '',
    owner: '',
  });
  const navigate = useNavigate();

  const fetchUserData = useCallback( async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData.name);
          setFormData((prevFormData) => ({
            ...prevFormData,
            owner: userData.name,
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  },[ navigate, setFormData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleStartPointChanged = (places) => {
    if (places.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        startPoint: places[0].formatted_address,
      }));
    }
  };

  const handleDestinationChanged = (places) => {
    if (places.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        destination: places[0].formatted_address,
      }));
    }
  };

  const isDateAfterToday = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDateAfterToday(formData.date)) {
      toast.error('The date must be after today.');
      return;
    }

    try {
      if (
        !formData.groupType ||
        !formData.startPoint ||
        !formData.destination ||
        !formData.startTime ||
        !formData.date ||
        !formData.seats ||
        !formData.uberType
      ) {
        toast.error('Please fill in all required fields.');
        return;
      }

      const groupsCollection = collection(db, 'groups');
      const docRef = await addDoc(groupsCollection, {
        ...formData,
        date: new Date(formData.date),
        ridees: [user],
        seatsAvailable: formData.seats,
      });

      toast.success('Group created successfully!');
      setTimeout(() => navigate(`/group/${docRef.id}`), 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while creating the group.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="background-container">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="create-group-form p-4 shadow rounded">
        <h2 className="text-center mb-4">Create a Group</h2>
        <div className="form-group mb-3">
          <label htmlFor="groupType" className="form-label">
            Group Type
          </label>
          <select
            name="groupType"
            className="form-control"
            id="groupType"
            value={formData.groupType}
            onChange={handleChange}
            required
          >
            <option value="">Select Group Type</option>
            <option value="groceries">GROCERIES</option>
            <option value="airport">AIRPORT</option>
            <option value="metro">METRO/BART</option>
            <option value="home">HOME</option>
            <option value="on_campus">ON CAMPUS</option>
            <option value="other">OTHER</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="startPoint" className="form-label">
            Start Point
          </label>
          <CustomStandaloneSearchBox
            onPlacesChanged={handleStartPointChanged}
            placeholder="Enter Start Point"
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="destination" className="form-label">
            Destination
          </label>
          <CustomStandaloneSearchBox
            onPlacesChanged={handleDestinationChanged}
            placeholder="Enter Destination"
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            className="form-control"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="seats" className="form-label">
            Seats
          </label>
          <input
            type="number"
            name="seats"
            id="seats"
            className="form-control"
            value={formData.seats}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="uberType" className="form-label">
            Uber Type
          </label>
          <select
            name="uberType"
            className="form-control"
            id="uberType"
            value={formData.uberType}
            onChange={handleChange}
            required
          >
            <option value="">Select Uber Type</option>
            <option value="Uber X">Uber Regular</option>
            <option value="Uber Xl">Uber Xl</option>
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
