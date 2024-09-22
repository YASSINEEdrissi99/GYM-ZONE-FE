import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Admin from '../../admin';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/addactivity.css'; // Import the CSS file

const AddEventImage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    image: null,
  });
  const [events, setEvents] = useState([]); // State to hold events

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
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
    data.append('name', formData.name);
    data.append('event', formData.event);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:8000/event-images', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Event Image added successfully');
      navigate('/EventImages');
    } catch (error) {
      console.error('Error adding event image:', error);
      alert('Failed to add event image');
    }
  };

  return (
    <Admin>
        <div className='title'>

       
         <h2>Add Event Images</h2>
      <form onSubmit={handleSubmit} className="admin-add-activity-form">
        <div className="form-column">
          <input type="text" name="name" required onChange={handleInputChange} placeholder="Name" />
          <select name="event" required onChange={handleInputChange} value={formData.event}>
            <option value="">Select an Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name} {/* Assuming `event.name` exists */}
              </option>
            ))}
          </select>
          <input type="file" required name="image" onChange={handleImageChange} />
        </div>
        <button type="submit" className="admin-add-activity-btn">Add Event Image</button>
      </form>
      </div>
    </Admin>
  );
};

export default AddEventImage;
