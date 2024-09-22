import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const EventImages = ({userrole}) => {
  const [eventImages, setEventImages] = useState([]);

  const fetchEventImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/event-images");
      setEventImages(response.data);
    } catch (error) {
      console.error("Error fetching event images:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event image?")) {
      try {
        await axios.delete(`http://localhost:8000/event-images/${id}`);
        setEventImages(eventImages.filter(eventImage => eventImage._id !== id)); // Update the UI after deletion
      } catch (error) {
        console.error("Error deleting event image:", error);
      }
    }
  };

  useEffect(() => {
    fetchEventImages();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Event Images</h2>
        <div className="add-role">
          {userrole === "Admin User" && (
            <>     
              <span>Add a new Event Image</span>
              <Link to="/AddEventImage" className="add-role-btn">Add Event Image</Link>    
            </>
          )}
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventImages.map((eventImage) => (
              <tr key={eventImage._id}>
                <td>{eventImage.name}</td>
                <td>{eventImage.event?.name || 'N/A'}</td> {/* Ensure event has a name */}
                <td className="actions">
                  <Link to={`/EventImageDetail/${eventImage._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
                    <>     
                      <Link to={`/UpdateEventImage/${eventImage._id}`} title="Edit">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(eventImage._id)} title="Delete" className="delete-btn">
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

export default EventImages;
