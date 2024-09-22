import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Admin from '../../admin';
import '../../../assets/css/addactivity.css'; // Import the CSS file

const UpdateUserProfile = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    user: '', // This will hold the selected user ID
    description: '',
    image: null, // New profile image file
    currentImage: '', // To display the already uploaded image
  });
  const [users, setUsers] = useState([]); // State to hold all users

  useEffect(() => {
    // Fetch user profile details
    const fetchUserProfileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-profil/${id}`);
        setFormData({
          user: response.data.user._id, // Assuming the API returns the user object with an _id field
          description: response.data.description,
          currentImage: response.data.url, // Store the URL of the existing profile image
        });
      } catch (error) {
        console.error('Error fetching user profile details:', error);
      }
    };

    // Fetch all users for the select dropdown
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users'); // Adjust the API endpoint if needed
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserProfileDetails();
    fetchUsers();
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
    data.append('user', formData.user); // Append the selected user ID
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image); // Append new image if selected
    }

    try {
      const response = await axios.put(`http://localhost:8000/user-profil/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      alert('User profile updated successfully');
      navigate('/UserProfiles');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Failed to update user profile');
    }
  };

  return (
    <Admin>
      <form onSubmit={handleSubmit} className="admin-add-activity-form">
        <div className="form-column">
          {/* Replace input with a select dropdown for users */}
          <select 
            name="user" 
            onChange={handleInputChange} 
            value={formData.user} // Bind the selected value
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option 
                key={user._id} 
                value={user._id}
                selected={formData.user === user._id} // Default selected value is the user associated with the profile
              >
                {user.name}
              </option>
            ))}
          </select>

          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Description" 
          />

          <input 
            type="file" 
            name="image" 
            onChange={handleImageChange} 
          />

          {/* Display the current image if available and no new image has been selected */}
          {formData.currentImage && !formData.image && (
            <div className="current-image">
              <img 
                src={`http://localhost:8000/${formData.currentImage}`} 
                alt="Current Profile" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
            </div>
          )}

          {/* Display the selected new image for preview */}
          {formData.image && (
            <div className="current-image">
              <img 
                src={URL.createObjectURL(formData.image)} 
                alt="New Profile" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
            </div>
          )}
        </div>
        <button type="submit" className="admin-add-activity-btn">Update User Profile</button>
      </form>
    </Admin>
  );
};

export default UpdateUserProfile;
