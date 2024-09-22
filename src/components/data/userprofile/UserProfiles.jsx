import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const UserProfiles = ({ userrole }) => {
  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user-profil");
      setUserProfiles(response.data);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:8000/user-profil/${id}`);
        setUserProfiles(userProfiles.filter(profile => profile._id !== id)); // Update the UI after deletion
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>User Profiles</h2>
        <div className="add-role">
          {userrole === "Admin User" && (
            <>     
              <span>Add a new Profile</span>
              <Link to="/AddUserProfile" className="add-role-btn">Add Profile</Link>    
            </>
          )}
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userProfiles.map((profile) => (
              <tr key={profile._id}>
                <td>{profile.user?.email || 'N/A'}</td> {/* Ensure user has a name */}
                <td>{profile.description}</td>
                <td className="actions">
                  <Link to={`/UserProfileDetails/${profile._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
                    <>     
                      <Link to={`/UpdateUserProfile/${profile._id}`} title="Edit">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(profile._id)} title="Delete" className="delete-btn">
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

export default UserProfiles;
