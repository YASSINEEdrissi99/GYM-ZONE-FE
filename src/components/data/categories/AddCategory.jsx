import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Using the same CSS as AddUser
import Admin from "../../admin";

const AddCategory = () => {
  const [name, setName] = useState(""); // Category name state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const categoryData = {
      name, // Category name for backend
    };

    try {
      const response = await axios.post("http://localhost:8000/category", categoryData);
      console.log("Server Response:", response.data);
      toast.success("Category added successfully!");
      navigate('/categories'); // Navigate back to categories list after successful creation
    } catch (error) {
      console.error("There was an error adding the category:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred while adding the category.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content"> {/* Reusing the same CSS class names */}
        <h2 className="admin-add-user-title">Add New Category</h2>
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="admin-add-user-input"
              />
            </label>
            <button type="submit" className="admin-add-user-btn">Add Category</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default AddCategory;
