import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Events = ({userrole}) => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/event/${id}`);
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Events:</h2>
        <div className="add-role">
          {userrole === "Admin User" && (
            <>
              <span>Add New Event</span>
              <Link to="/AddEvent" className="add-role-btn">Add Event</Link>
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
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
              {userrole === "Admin User" && (
                    <>
                   <th>Registrations</th>
                    </>

                  )}
              
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event._id}</td>
                <td>{event.name}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td className="actions">
                  <Link to={`/EventDetails/${event._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (
                    <>
                      <Link to={`/EditEvent/${event._id}`} title="Edit">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(event._id)} title="Delete" className="delete-btn">
                        <FaTrash />
                      </button>
                      
                    </>

                  )}

                </td>
                {userrole === "Admin User" && (
                    <>
                    <td>
                      <Link to={`/EventRegistration/${event._id}`} className="back-btn"> Registrations</Link>
                      </td>
                    </>

                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Admin>
  );
};

export default Events;
