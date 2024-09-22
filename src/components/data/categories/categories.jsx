import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Categories = ({userrole}) => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/category/${id}`);
        console.log("Delete response:", response); // Check the response
        if (response.status === 200) {
          setCategories(categories.filter(category => category._id !== id)); // Update the UI
        } else {
          console.error("Failed to delete category:", response.data);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        // Log more specific error messages
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Categories:</h2>
        <div className="add-role">
        {userrole === "Admin User" && (
       <>     
         <span>To Add New Category</span>
         <Link to="/AddCategory" className="add-role-btn">Add Category</Link>   
       </>

        )}
         
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td className="actions">
                  <Link to={`/CategoryDetail/${category._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
       <>     
         <Link to={`/EditCategory/${category._id}`} title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(category._id)} title="Delete" className="delete-btn">
                    <FaTrash />
                  </button> 
       </>

        )}
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Admin>
  );
};

export default Categories;
