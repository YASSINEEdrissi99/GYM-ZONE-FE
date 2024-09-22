import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import '../../../assets/css/adm.css'; // Import CSS
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ActivityRegistrations = ({userrole}) => {
  const [registrations, setRegistrations] = useState([]);

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/registrations");
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        console.log("Attempting to delete registration with ID:", id); // Log ID
        await axios.delete(`http://localhost:8000/registrations/${id}`);
        setRegistrations(registrations.filter(registration => registration._id !== id)); // Update the UI
      } catch (error) {
        console.error("Error deleting registration:", error);
      }
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Activity Registrations:</h2>
        <div className="add-role">
        {userrole === "Admin User" && (
       <>     
        <span>Add new Registration</span>
        <Link to="/AddRegistration" className="add-role-btn">Add Registration</Link>
       </>

        )}
          
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th className="centrer">ID</th>
              <th className="centrer">Activity</th>
              <th className="centrer">User</th>
              <th className="centrer">Registration Date</th>
              <th className="centrer">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration._id}>
                <td  className="centrer">{registration._id}</td>
                <td  className="centrer">{registration.activity ? registration.activity.name : 'Unknown Activity'}</td>
                <td  className="centrer">{registration.user ? registration.user.name : 'Unknown User'}</td>
                <td  className="centrer">{registration.registration_date ? new Date(registration.registration_date).toLocaleDateString() : 'N/A'}</td>
                <td className="actions">
                  <Link to={`/RegistrationDetail/${registration._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
       <>     
         <Link to={`/EditRegistration/${registration._id}`} title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(registration._id)} title="Delete" className="delete-btn">
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

export default ActivityRegistrations;
