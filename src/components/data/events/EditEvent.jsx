import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Specific CSS file
import Admin from "../../admin";

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // Fetch event details
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/event/${id}`);
      const event = response.data;

      // Ensure the date format is YYYY-MM-DD
      const formattedDate = new Date(event.date).toISOString().split('T')[0];

      setEventName(event.name);
      setEventDate(formattedDate);
      setEventTime(event.time);
      setLocation(event.location);
      setDescription(event.description);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Error fetching event details.");
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventName') setEventName(value);
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'location') setLocation(value);
    if (name === 'description') setDescription(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location,
        description
      };
      const response = await axios.put(`http://localhost:8000/event/${id}`, eventData);
      console.log("Server Response:", response.data);
      toast.success("Event updated successfully!");
      navigate('/Eventslist'); // Redirect to events list after successful update
    } catch (error) {
      console.error("There was an error updating the event:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during update.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Edit Event</h2>
        <div className="cont_even">
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Event Name:
              <input
                type="text"
                name="eventName"
                value={eventName}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Event Date:
              <input
                type="date"
                name="eventDate"
                value={eventDate}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Event Time:
              <input
                type="time"
                name="eventTime"
                value={eventTime}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Location:
              <input
                type="text"
                name="location"
                value={location}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Description:
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                className="admin-add-user-textarea"
              ></textarea>
            </label>
            <button type="submit" className="admin-add-user-btn">Save Changes</button>
          </form>
        </div>
        </div>
      </div>
    </Admin>
  );
};

export default EditEvent;
