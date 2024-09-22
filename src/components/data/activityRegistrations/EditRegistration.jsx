import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/css/adduser.css'; 
import Admin from "../../admin";

const EditRegistration = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState("");
  const [user, setUser] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/registrations/${id}`);
        setActivity(response.data.activity?._id || '');
        setUser(response.data.user?._id || '');
        setRegistrationDate(new Date(response.data.registration_date).toISOString().slice(0, 16));
      } catch (error) {
        toast.error("Error fetching registration details.");
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:8000/activities");
        setActivities(response.data);
      } catch (error) {
        toast.error("Error fetching activities.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching users.");
      }
    };

    fetchActivities();
    fetchUsers();
    fetchRegistrationDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'activity') setActivity(value);
    if (name === 'user') setUser(value);
    if (name === 'registrationDate') setRegistrationDate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!activity || !user || !registrationDate) {
        throw new Error("All fields are required.");
      }

      const registrationData = {
        activity,
        user,
        registration_date: new Date(registrationDate).toISOString(),
      };

      await axios.put(`http://localhost:8000/registrations/${id}`, registrationData);
      toast.success("Registration updated successfully!");
      navigate('/ActivityRegistrations');
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during update.");
    }
  };

  return (
    <Admin>
      <ToastContainer />
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Edit Registration</h2>
        <div className="admin-add-user-form-container">
          <form className="admin-add-user-form" onSubmit={handleSubmit}>
            <label className="admin-add-user-label">Activity:</label>
            <select
              name="activity"
              className="admin-add-user-select"
              value={activity}
              onChange={handleChange}
              required
            >
              <option value="">Select an Activity</option>
              {activities.map((activity) => (
                <option key={activity._id} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>

            <label className="admin-add-user-label">User:</label>
            <select
              name="user"
              className="admin-add-user-select"
              value={user}
              onChange={handleChange}
              required
            >
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <label className="admin-add-user-label">Registration Date:</label>
            <input
              type="datetime-local"
              name="registrationDate"
              className="admin-add-user-input"
              value={registrationDate}
              onChange={handleChange}
              required
            />

            <button type="submit" className="admin-add-user-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default EditRegistration;
