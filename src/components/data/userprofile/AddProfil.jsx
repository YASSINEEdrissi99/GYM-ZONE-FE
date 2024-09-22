import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Admin from '../../admin';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/addactivity.css'; // Import the CSS file

const AddUserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    user: '',
    image: null,
  });
  const [users, setUsers] = useState([]); // State to hold users

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users'); // Adjust the endpoint if necessary
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('description', formData.description);
    data.append('user', formData.user);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:8000/user-profil', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('User profile added successfully');
      navigate('/UserProfiles');
    } catch (error) {
      console.error('Error adding user profile:', error);
      alert('this  user already has profile');
    }
  };

  return (
    <Admin>
      <div className='title'>
        <h2>Add User Profile</h2>
        <form onSubmit={handleSubmit} className="admin-add-activity-form">
          <div className="form-column">
            <textarea
              name="description"
              required
              onChange={handleInputChange}
              placeholder="Description"
            />
            <select
              name="user"
              required
              onChange={handleInputChange}
              value={formData.user}
            >
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {/* Assuming `user.name` exists */}
                </option>
              ))}
            </select>
            <input type="file" required name="image" onChange={handleImageChange} />
          </div>
          <button type="submit" className="admin-add-activity-btn">
            Add User Profile
          </button>
        </form>
      </div>
    </Admin>
  );
};

export default AddUserProfile;
