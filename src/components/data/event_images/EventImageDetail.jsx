import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";

const EventImageDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [eventImage, setEventImage] = useState(null);

  const fetchEventImageDetails = async () => {
    try {
      // Fetch event image details
      const response = await axios.get(`http://localhost:8000/event-images/${id}`);
      setEventImage(response.data);
      console.log("Event Image data:", response.data); // Log the event image data
    } catch (error) {
      console.error("Error fetching event image details:", error);
    }
  };

  useEffect(() => {
    fetchEventImageDetails();
  }, [id]);

  if (!eventImage) {
    return <Admin><div>Loading...</div></Admin>; // Show loading message while data is being fetched
  }

  // Construct the image URL
  const imageUrl = eventImage.url ? `http://localhost:8000/${eventImage.url.replace(/\\/g, '/')}` : null;
  console.log("Image URL:", imageUrl);

  return (
    <Admin>
      <div className="title">
        <h2>Event Image Details</h2>
      </div>
      <div className="flex_activity">
        {imageUrl && (
          <div className="activity-image">
            <img src={imageUrl} alt={eventImage.name} style={{ maxWidth: "100%", height: "400px" }} />
          </div>
        )}
        <div className="activity-details">
          <p><strong>ID:</strong> {eventImage._id}</p>
          <p><strong>Name:</strong> {eventImage.name}</p>
          <p><strong>Event:</strong> {eventImage.event?.name || "N/A"}</p> {/* Check if event is an object */}
          <Link to="/EventImages" className="back-btn">Back to Event Images</Link>
        </div>
        
      </div>
    </Admin>
  );
};

export default EventImageDetail;
