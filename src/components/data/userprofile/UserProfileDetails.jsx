import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";

const UserProfileDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfileDetails = async () => {
    try {
      // Fetch user profile details
      const response = await axios.get(`http://localhost:8000/user-profil/${id}`);
      setUserProfile(response.data);
      console.log("User Profile data:", response.data); // Log the user profile data
    } catch (error) {
      console.error("Error fetching user profile details:", error);
    }
  };

  useEffect(() => {
    fetchUserProfileDetails();
  }, [id]);

  if (!userProfile) {
    return <Admin><div>Loading...</div></Admin>; // Show loading message while data is being fetched
  }

  // Construct the image URL
  const imageUrl = userProfile.url ? `http://localhost:8000/${userProfile.url.replace(/\\/g, '/')}` : null;
  console.log("Image URL:", imageUrl);

  return (
    <Admin>
      <div className="title">
        <h2>User Profile Details</h2>
      </div>
      <div className="flex_activity">
        {imageUrl && (
          <div className="activity-image">
            <img src={imageUrl} alt={userProfile.user?.name || "User Profile"} style={{ maxWidth: "100%", height: "400px" }} />
          </div>
        )}
        <div className="activity-details">
          <p><strong>ID:</strong> {userProfile._id}</p>
          <p><strong>User Name:</strong> {userProfile.user?.name || "N/A"}</p> {/* Ensure user name is displayed */}
          <p><strong>Description:</strong> {userProfile.description}</p>
          <Link to="/UserProfiles" className="back-btn">Back to User Profiles</Link>
        </div>
      </div>
    </Admin>
  );
};

export default UserProfileDetails;
