import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import '../../../assets/css/activity.css';
import Admin from "../../admin";

const ActivityDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [activity, setActivity] = useState(null);

  const fetchActivityDetails = async () => {
    try {
      // Fetch activity details
      const response = await axios.get(`http://localhost:8000/activities/${id}`);
      setActivity(response.data);
      console.log("Activity data:", response.data); // Log the activity data
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  };

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  if (!activity) {
    return <Admin><div>Loading...</div></Admin>; // Show loading message while data is being fetched
  }

  // Construct the image URL
  const imageUrl = activity.image ? `http://localhost:8000/${activity.image.replace(/\\/g, '/')}` : null;
  console.log("Image URL:", imageUrl);

  return (
    <Admin>
      <div className="title">
        <h2>Activity Details</h2>
      </div>
      <div className="flex_activity">
        {imageUrl && (
          <div className="activity-image">
            <img src={imageUrl} alt={activity.name} style={{ maxWidth: "100%", height: "400px" }} />
          </div>
        )}
        <div className="activity-details">
          <p><strong>ID:</strong> {activity._id}</p>
          <p><strong>Name:</strong> {activity.name}</p>
          <p><strong>Description:</strong> {activity.description}</p>
          <p><strong>Category:</strong> {activity.category?.name || "N/A"}</p> {/* Check if category is an object */}
          <p><strong>Instructor:</strong> {activity.instructor?.name || "N/A"}</p> {/* Check if instructor is an object */}
          <p><strong>Created At:</strong> {new Date(activity.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(activity.updated_at).toLocaleString()}</p>
        </div>
        <div className="activity-details">
          <p><strong>Day:</strong> {activity.day}</p>
          <p><strong>Start Time:</strong> {activity.start_time}</p>
          <p><strong>End Time:</strong> {activity.end_time}</p>
          <p><strong>Max Participants:</strong> {activity.max_participants}</p>
          <p><strong>Location:</strong> {activity.location}</p>
          
          <Link to="/activities" className="back-btn">Back to Activities</Link>
        </div>
      </div>
    </Admin>
  );
};

export default ActivityDetail;
