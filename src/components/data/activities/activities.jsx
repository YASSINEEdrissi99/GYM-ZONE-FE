import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Activities = ({userrole}) => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axios.delete(`http://localhost:8000/activities/${id}`);
        setActivities(activities.filter(activity => activity._id !== id)); // Update the UI after deletion
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Activities</h2>
        <div className="add-role">
        {userrole === "Admin User" && (
       <>     
         <span>Add a new Activity</span>
          <Link to="/AddActivity" className="add-role-btn">Add Activity</Link>    
       </>

        )}
          
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.name}</td>
                <td>{activity.category?.name || 'N/A'}</td> {/* Ensure category has a name */}
                <td>{activity.day}</td>
                <td>{activity.start_time}</td>
                <td>{activity.end_time}</td>
                <td className="actions">
                  <Link to={`/ActivityDetail/${activity._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
       <>     
          <Link to={`/EditActivity/${activity._id}`} title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(activity._id)} title="Delete" className="delete-btn">
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

export default Activities;
