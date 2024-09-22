import React, { useEffect, useState } from "react";
import '../../assets/css/chat.css';
import logo from '../../assets/img/image.png'; // Import the default image
import axios from 'axios';

// Function to fetch user profile by user ID
const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8000/user-profil/user/${userId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
};

// Function to handle file upload
const uploadProfileImage = async (file, userId) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    await axios.post(`http://localhost:8000/user-profil/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error("Error uploading profile image:", error.message);
  }
};

const UpdateProfile = ({ selectedUserId, setSelectedUserId, userIdsession }) => {
  const [profileImage, setProfileImage] = useState(logo); // Default to the logo image
  const [description, setDescription] = useState('No description available yet.'); // Default to no description available
  const [newImage, setNewImage] = useState(null); // For storing the new image file
  const [profileExists, setProfileExists] = useState(false); // Track if profile exists
  const [formData, setFormData] = useState({
    description: '',
    user: '',
    image: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await fetchUserProfile(selectedUserId ? selectedUserId : userIdsession);
      if (userProfile) {
        setProfileImage(userProfile.url ? `http://localhost:8000/${userProfile.url}` : logo);
        setDescription(userProfile.description || 'No description available yet.');
        setProfileExists(true); // Mark that the profile exists
      } else {
        setProfileImage(logo); // Fallback to default image if not found
        setDescription('No description available yet.');
        setProfileExists(false); // Profile does not exist
      }
    };

    fetchProfile();
  }, [selectedUserId, userIdsession]);

  const handleProfileCreateOrUpdate = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('description', description);
    
    if (newImage) {
      data.append('image', newImage); // Only append the image if a new one is selected
    }
  
    try {
      if (profileExists) {
        // Delete the existing profile before creating a new one
        console.log(profileExists)
        const userProfile1 = await fetchUserProfile(userIdsession);
        console.log(userProfile1)
        const deleteUrl = `http://localhost:8000/user-profil/${userProfile1._id}`;
        await axios.delete(deleteUrl); // Delete the existing profile
     
        // After deleting, create a new profile
        data.append('user', userIdsession); // Include the user ID in the create request
        const createUrl = `http://localhost:8000/user-profil`;
        await axios.post(createUrl, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfileExists(true); // Mark that the profile has now been created
        alert(' profile updated successfully!');
      } else {
        // If the profile doesn't exist, create a new one
        data.append('user', userIdsession); // Include the user ID in the create request
        const createUrl = `http://localhost:8000/user-profil`;
        await axios.post(createUrl, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfileExists(true); // Mark that the profile has now been created
        alert('Profile created successfully!');
      }
    } catch (error) {
      console.error("Error creating or updating profile:", error.response ? error.response.data : error.message);
      alert('An error occurred while creating/updating the profile.');
    }
  };
  
  

  
  const handleProfileUpdate = () => {
    if (newImage) {
      uploadProfileImage(newImage, selectedUserId || userIdsession); // Upload the new image
    }
    setSelectedUserId(null); // Reset the selected user ID on "Update my Profile" button click
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update the description state
  };

  return (
    <>
      {selectedUserId === null ? (
        <div className="updateprofilechat">
          <h1 className="profile-name">My Profile</h1>
          <form onSubmit={handleProfileCreateOrUpdate}>
            <div className="profile-image-container">
              <img src={profileImage} alt="Profile" className="profile-image" /> {/* Display the fetched or default image */}
            </div>
            <div className="div_inputimage">
              <input type="file" onChange={handleFileChange} className="input_image" required/>
            </div>

            <div className="profile-info">
              <textarea 
                name="description"
                value={description}
                onChange={handleDescriptionChange} // Handle changes to the textarea
                className="admin-add-user-textarea"
                required
              />
              <div className="div_update_add_pro">
                <button type="submit" className="update_add_pro" >
                  {profileExists ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="updateprofilechat">
          <button onClick={handleProfileUpdate} className="buttonupdatepro">
            Edit my Profile
          </button>
          <div className="profile-image-container">
            <img src={profileImage} alt="Profile" className="profile-image" /> {/* Display the profile image */}
          </div>
          <div className="profile-info">
            <p className="profile-description">{description}</p> {/* Display the profile description */}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
