import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import '../../../assets/css/adm.css'; 
import { FaTrash } from 'react-icons/fa';
import Admin from "../../admin";

const EventRegistration = ({ userrole }) => {
  const { id } = useParams(); // Get the event ID from the URL
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // Fetch event details and registrations
  const fetchEventDetails = async () => {
    try {
      const eventResponse = await axios.get(`http://localhost:8000/event/${id}`);
      setEvent(eventResponse.data);
      const userIds = eventResponse.data.registrations || [];

      // Fetch user details in parallel
      const userPromises = userIds.map(userId => axios.get(`http://localhost:8000/user/${userId}`));
      const userResponses = await Promise.all(userPromises);

      const users = userResponses.map(response => response.data);
      setRegistrations(users);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Fetch all users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users'); // Adjust endpoint if needed
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchUsers();
  }, [id]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAddUser = async () => {
    if (selectedUser) {
      if (registrations.find(user => user._id === selectedUser)) {
        toast.info("User is already registered.");
        return;
      }
      try {
        await axios.post(`http://localhost:8000/event/${id}/register`, { userId: selectedUser });
        setRegistrations([...registrations, users.find(user => user._id === selectedUser)]);
        setSelectedUser('');
        toast.success("User successfully added to the event.");
      } catch (error) {
        console.error("Error adding user to event:", error);
        toast.error("Failed to add user to the event.");
      }
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.post(`http://localhost:8000/event/${id}/unregister`, { userId });
      setRegistrations(registrations.filter(user => user._id !== userId));
      toast.success("User successfully unregistered.");
    } catch (error) {
      console.error("Error removing user from event:", error);
      toast.error("Failed to unregister user.");
    }
  };

  if (!event) {
    return <Admin><div>Loading...</div></Admin>; // Show loading message while data is being fetched
  }

  return (
    <Admin>
      <ToastContainer /> {/* Add this to render the toast notifications */}
      <div className="title">
        <h2>Registrations for : {event.name} Event</h2>
      </div>
      {userrole === "Admin User" && (
        <div className="add-role">
          <span>Add New Registrations</span>
          <select value={selectedUser} className="add-regis" required onChange={handleUserChange}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.email}</option>
            ))}
          </select>
          <button onClick={handleAddUser} className="admin-add-user-btn">Add User</button>
        </div>
      )}
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="4">No registrations found.</td>
              </tr>
            ) : (
              registrations.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleRemoveUser(user._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Admin>
  );
};

export default EventRegistration;
