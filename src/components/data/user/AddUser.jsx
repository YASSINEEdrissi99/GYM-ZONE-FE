import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Specific CSS file
import Admin from "../../admin";

const AddUser = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error fetching roles"); // Display error notification
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle input changes
 
  // Handle form submission
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const userData = {
      name: username, // Backend expects 'name'
      email,
      password,
      role,
    };

    try {
      const response = await axios.post("http://localhost:8000/creatuser", userData);
      console.log("Server Response:", response.data);
      toast.success("Sign-up successful! You can now Sign in.");
      navigate('/users');
    } catch (error) {
      console.error("There was an error signing up:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during sign-up.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Add New User</h2>
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Name:
              <input
                type="text"
                name="name"
                
                onChange={(e) => setUsername(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Email:
              <input
                type="email"
                name="email"
                
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Password:
              <input
                type="password"
                name="password"
                
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <label className="admin-add-user-label">
              Role:
              <select
                name="role"
                onChange={(e) => setRole(e.target.value)}
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
            <button type="submit" className="admin-add-user-btn">Add User</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default AddUser;
