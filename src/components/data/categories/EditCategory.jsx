import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import '../../../assets/css/adduser.css'; // Specific CSS file (reusing for categories)
import Admin from "../../admin";

const EditCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Fetch category details
  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/category/${id}`);
      setName(response.data.name);
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("Error fetching category details.");
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    setName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = { name };
      const response = await axios.put(`http://localhost:8000/category/${id}`, categoryData);
      console.log("Server Response:", response.data);
      toast.success("Category updated successfully!");
      navigate('/categories'); // Redirect to categories list after successful update
    } catch (error) {
      console.error("There was an error updating the category:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during update.");
    }
  };

  return (
    <Admin>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="admin-add-user-content">
        <h2 className="admin-add-user-title">Edit Category</h2>
        <div className="admin-add-user-form-container">
          <form onSubmit={handleSubmit} className="admin-add-user-form">
            <label className="admin-add-user-label">
              Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
                className="admin-add-user-input"
              />
            </label>
            <button type="submit" className="admin-add-user-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </Admin>
  );
};

export default EditCategory;
