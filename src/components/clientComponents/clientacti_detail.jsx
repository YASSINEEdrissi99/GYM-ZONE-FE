import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';

import { useParams  } from 'react-router-dom';
import '../../assets/css/activities.css';
import Main2 from "../Main2";

const Clientacti_detail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [activity, setActivity] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0); // New state for registration count

  const fetchActivityDetails = useCallback(async () => {
    try {
      // Fetch activity details
      const response = await axios.get(`http://localhost:8000/activities/${id}`);
      setActivity(response.data);
      console.log("Activity data:", response.data); // Log the activity data

      // Fetch registration count
      const regResponse = await axios.get(`http://localhost:8000/registrations/count/${id}`);
      setRegistrationCount(regResponse.data.registrationCount);
      console.log("Registration count:", regResponse.data.registrationCount); // Log the registration count
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  }, [id]); // Add 'id' as a dependency

  useEffect(() => {
    fetchActivityDetails();
  }, [fetchActivityDetails]); // Now useCallback ensures the function doesn't change unnecessarily

  if (!activity) {
    return (
      <div>
        <Main2 />
        <div className="show_act_cont">
          Loading...
        </div>
      </div>
    ); // Show loading message while data is being fetched
  }

  // Construct the image URL
  const imageUrl = activity.image ? `http://localhost:8000/${activity.image.replace(/\\/g, '/')}` : null;

  return (
    <div>
      <Main2 />
      <div className="show_act_cont">
        <div className="show_flex_activity">
          {imageUrl && (
            <div className="activity-image1">
              <img src={imageUrl} alt={activity.name} style={{ maxWidth: "100%", height: "400px" }} />

            </div>
          )}
          <div className="activity-details1">
            <p><strong>Name:</strong> {activity.name}</p>
            <p><strong>Description:</strong> {activity.description}</p>
            <p><strong>Instructor:</strong> {activity.instructor?.name || "N/A"}</p> {/* Check if instructor is an object */}
            <p><strong>Day:</strong> {activity.day}</p>
            <p><strong>Start Time:</strong> {activity.start_time}</p>
            <p><strong>End Time:</strong> {activity.end_time}</p>
            <p><strong>Max Participants:</strong> {activity.max_participants}</p>
            <p><strong>Location:</strong> {activity.location}</p>
            <p><strong>Reserved Places:</strong> {registrationCount}</p> 
             
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientacti_detail;
