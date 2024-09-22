import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css'; // Import CSS
import Admin from "../../admin";

const RegistrationDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [registration, setRegistration] = useState(null);
  const [activityName, setActivityName] = useState(""); // Store activity name
  const [userName, setUserName] = useState(""); // Store user name

  const fetchRegistrationDetails = async () => {
    try {
      // Fetch registration details
      const response = await axios.get(`http://localhost:8000/registrations/${id}`);
      setRegistration(response.data);
      
      // Extract IDs as strings if necessary
      const activityId = typeof response.data.activity === 'string' ? response.data.activity : response.data.activity?._id;
      const userId = typeof response.data.user === 'string' ? response.data.user : response.data.user?._id;

      // Fetch activity name
      if (activityId) {
        const activityResponse = await axios.get(`http://localhost:8000/activities/${activityId}`);
        setActivityName(activityResponse.data.name);
      }

      // Fetch user name
      if (userId) {
        const userResponse = await axios.get(`http://localhost:8000/user/${userId}`);
        setUserName(userResponse.data.name);
      }

    } catch (error) {
      console.error("Error fetching registration details:", error);
    }
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, [id]);

  if (!registration) {
    return <Admin> <div>Loading...</div> </Admin>; // Show loading message while data is being fetched
  }

  return (
    <Admin>
      <div className="title">
        <h2>Registration Details</h2>
      </div>
      <div className="role-details">
        <p><strong>ID:</strong> {registration._id}</p>
        <p><strong>Activity:</strong> {activityName}</p> {/* Display activity name */}
        <p><strong>User:</strong> {userName}</p> {/* Display user name */}
        <p><strong>Registration Date:</strong> {new Date(registration.registration_date).toLocaleString()}</p>
        <Link to="/ActivityRegistrations" className="back-btn">Back to Registrations</Link>
      </div>
    </Admin>
  );
};

export default RegistrationDetail;
