import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Admin from '../../admin';
import '../../../assets/css/addactivity.css'; // Import the CSS file

const UpdateEventImage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    image: null, // This will be the new image file
    currentImage: '', // This is for displaying the already uploaded image
  });
  const [events, setEvents] = useState([]); // State to hold events

  useEffect(() => {
    // Fetch event image details
    const fetchEventImageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/event-images/${id}`);
        setFormData({
          name: response.data.name,
          event: response.data.event,
          currentImage: response.data.url, // Store the URL of the existing image
        });
      } catch (error) {
        console.error('Error fetching event image details:', error);
      }
    };

    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEventImageDetails();
    fetchEvents();
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
    data.append('event', formData.event);
    if (formData.image) {
      data.append('image', formData.image); // Append new image only if it's selected
    }

    try {
      const response = await axios.put(`http://localhost:8000/event-images/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      alert('Event image updated successfully');
      navigate('/EventImages');
    } catch (error) {
      console.error('Error updating event image:', error);
      alert('Failed to update event image');
    }
  };

  return (
    <Admin>
      <form onSubmit={handleSubmit} className="admin-add-activity-form">
        <div className="form-column">
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Name" 
          />
         <select 
  name="event" 
  onChange={handleInputChange} 
  value={formData.event} // Bind the selected value
>
  <option value="">Select an Event</option>
  {events.map((event) => (
    <option 
      key={event._id} 
      value={event._id}
      selected={formData.event === event._id} // This condition checks if the event is selected
    >
      {event.name}
    </option>
  ))}
</select>


          <input 
            type="file" 
            name="image" 
            onChange={handleImageChange} 
          />

          {/* Display the current image if it's available and no new image has been selected */}
          {formData.currentImage && !formData.image && (
            <div className="current-image">
              <img 
                src={`http://localhost:8000/${formData.currentImage}`} 
                alt="Current Event" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
            </div>
          )}

          {/* Display the selected image for preview */}
          {formData.image && (
            <div className="current-image">
              <img 
                src={URL.createObjectURL(formData.image)} 
                alt="New Event" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
            </div>
          )}
        </div>
        <button type="submit" className="admin-add-activity-btn">Update Event Image</button>
      </form>
    </Admin>
  );
};

export default UpdateEventImage;
