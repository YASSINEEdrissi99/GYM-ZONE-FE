import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Specific CSS file
import Admin from "../../admin";

const EditUser = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${id}`);
      setUsername(response.data.name);
      setEmail(response.data.email);
      setRole(response.data.roles?._id || ''); // Ensure this is the role ID
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details.");
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error fetching roles.");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUserDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'role') setRole(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: username,
        email,
        password: password ? password : undefined, // Include password only if it's provided
        role
      };
      const response = await axios.put(`http://localhost:8000/update/user/${id}`, userData);
      console.log("Server Response:", response.data);
      toast.success("User updated successfully!");
      navigate('/users'); // Redirect to users list after successful update
    } catch (error) {
      console.error("There was an error updating the user:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during update.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Edit User</h2>
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Name:
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Email:
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Password:
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Role:
              <select
                name="role"
                value={role}
                onChange={handleChange}
                required
                className="admin-add-user-select"
              >
                <option value="">Select a Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="admin-add-user-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default EditUser;
