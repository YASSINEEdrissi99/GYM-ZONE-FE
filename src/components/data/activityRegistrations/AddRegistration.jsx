import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Specific CSS file
import Admin from "../../admin";

const AddRegistration = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  // Fetch activities and users from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Error fetching activities"); // Display error notification
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users"); // Display error notification
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const registrationData = {
      activity: selectedActivity,
      user: selectedUser,
    };

    try {
      const response = await axios.post("http://localhost:8000/registrations", registrationData);
      console.log("Server Response:", response.data);
      toast.success("Registration added successfully!");
      navigate('/activityRegistrations'); // Redirect to activity registrations list
    } catch (error) {
      console.error("There was an error adding the registration:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Add New Registration</h2>
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Activity:
              <select
                name="activity"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                required
                className="admin-add-user-select"
              >
                <option value="">Select an Activity</option>
                {activities.map((activity) => (
                  <option key={activity._id} value={activity._id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-add-user-label">
              User:
              <select
                name="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                className="admin-add-user-select"
              >
                <option value="">Select a User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="admin-add-user-btn">Add Registration</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default AddRegistration;
