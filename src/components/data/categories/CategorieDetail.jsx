import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css'; // Using the same CSS as UserDetail
import Admin from "../../admin";

const CategoryDetail = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [category, setCategory] = useState(null); // State to hold the category data

  // Fetch category details by ID
  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/category/${id}`);
      setCategory(response.data); // Set category data
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  useEffect(() => {
    fetchCategoryDetails(); // Fetch data when component mounts or ID changes
  }, [id]);

  if (!category) {
    return <Admin><div>Loading...</div></Admin>; // Display a loading message while fetching data
  }

  return (
    <Admin>
      <div className="title">
        <h2>Category Details</h2>
      </div>
      <div className="role-details"> {/* Reusing the same class for consistent styling */}
        <p><strong>ID:</strong> {category._id}</p>
        <p><strong>Name:</strong> {category.name}</p>
        <Link to="/categories" className="back-btn">Back to Categories</Link>
      </div>
    </Admin>
  );
};

export default CategoryDetail;
