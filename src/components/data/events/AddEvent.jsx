import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/css/adduser.css'; // Make sure this CSS file includes styles for the event form
import Admin from "../../admin";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState(""); // Added time state
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      name: eventName,
      date: eventDate,
      time: eventTime, // Added time field
      location,
      description,
    };

    try {
      const response = await axios.post("http://localhost:8000/event", eventData);
      toast.success("Event added successfully!");
      navigate('/Eventslist');
    } catch (error) {
      console.error("Error adding event:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred while adding the event.");
    }
  };

  return (
    <Admin>
      <ToastContainer />
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Add New Event</h2>
        <div className="cont_even">
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Event Name:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Event Date:
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Event Time:
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Location:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Description:
              <textarea
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                className="admin-add-user-textarea"
              ></textarea>
            </label>
            <button type="submit" className="admin-add-user-btn">Add Event</button>
          </form>
        </div>
        </div>
      </div>
    </Admin>
  );
};

export default AddEvent;
