import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Admin from '../../admin';
import '../../../assets/css/addactivity.css'; // Import the CSS file

const UpdateActivity = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    instructor: '',
    day: '', // This will be populated by the select dropdown
    start_time: '',
    end_time: '',
    max_participants: '',
    location: '',
    image: null,
  });
  const [users, setUsers] = useState([]); // State to hold users
  const [categories, setCategories] = useState([]); // State to hold categories

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]; // Array of days for the select dropdown

  useEffect(() => {
    // Fetch activity details
    const fetchActivityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/activities/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching activity details:', error);
      }
    };

    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchActivityDetails();
    fetchUsers();
    fetchCategories();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('instructor', formData.instructor);
    data.append('day', formData.day);
    data.append('start_time', formData.start_time);
    data.append('end_time', formData.end_time);
    data.append('max_participants', formData.max_participants);
    data.append('location', formData.location);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:8000/activities/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Activity updated successfully');
      navigate('/activities'); // Redirect to activities page
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity');
    }
  };

  return (
    <Admin>
      <form onSubmit={handleSubmit} className="admin-add-activity-form">
        <div className="form-column">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
          <select name="category" onChange={handleInputChange} value={formData.category}>
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name} {/* Assuming `category.name` exists */}
              </option>
            ))}
          </select>
          <select name="instructor" onChange={handleInputChange} value={formData.instructor}>
            <option value="">Select an Instructor</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} {/* Assuming `user.name` exists */}
              </option>
            ))}
          </select>
          <select name="day" onChange={handleInputChange} value={formData.day}>
            <option value="">Select a Day</option>
            {daysOfWeek.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input type="number" name="max_participants" value={formData.max_participants} onChange={handleInputChange} placeholder="Max Participants" />
        </div>
        <div className="form-column">
          <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
          <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" />
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit" className="admin-add-activity-btn">Update Activity</button>
      </form>
    </Admin>
  );
};

export default UpdateActivity;
