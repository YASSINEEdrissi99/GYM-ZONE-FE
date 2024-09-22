import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css'; // Ensure this CSS file contains necessary styles
import Admin from "../../admin";

const EventDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [event, setEvent] = useState(null);

  const fetchEventDetails = async () => {
    try {
      // Fetch event details
      const response = await axios.get(`http://localhost:8000/event/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <Admin> <div>Loading...</div> </Admin>; // Show loading message while data is being fetched
  }

  // Format the dates conditionally
  const createdAt = event.createdAt ? new Date(event.createdAt).toLocaleString() : "Not available";
  const updatedAt = event.updatedAt ? new Date(event.updatedAt).toLocaleString() : "Not available";

  return (
    <Admin>
      <div className="title">
        <h2>Event Details</h2>
      </div>
      <div className="cont_even">
        <div className="role-details">
          <p><strong>ID:</strong> {event._id}</p>
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p> {/* Display event time */}
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Created At:</strong> {createdAt}</p>
          <p><strong>Updated At:</strong> {updatedAt}</p>
          <Link to="/Eventslist" className="back-btn">Back to Events</Link>
        </div>
      </div>
    </Admin>
  );
};

export default EventDetails;
