import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";

const UserDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState(""); // Store role name

  const fetchUserDetails = async () => {
    try {
      // Fetch user details
      const response = await axios.get(`http://localhost:8000/user/${id}`);
      setUser(response.data);
      console.log(response.data.roles);

      // Fetch role name
      if (response.data.roles) {
        const roleResponse = await axios.get(`http://localhost:8000/role/${response.data.roles}`);
        setRoleName(roleResponse.data.name);
      }

    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (!user) {
    return <Admin> <div>Loading...</div> </Admin>; // Show loading message while data is being fetched
  }

  return (
    <Admin>
      <div className="title">
        <h2>User Details</h2>
      </div>
      <div className="role-details">
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {roleName}</p> {/* Display role name */}
        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}</p>
        <Link to="/users" className="back-btn">Back to Users</Link>
      </div>
    </Admin>
  );
};

export default UserDetails;
