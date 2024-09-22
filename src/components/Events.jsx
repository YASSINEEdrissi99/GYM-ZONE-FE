import React, { useState, useEffect } from "react";
import Main2 from "./Main2";
import '../assets/css/adm.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const Events = ({ userIdS }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [selectedEventName, setSelectedEventName] = useState(""); // State to store the name of the selected event
  const [userRegistrations, setUserRegistrations] = useState({}); // State to store registration statuses

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events"); // Change this URL to your actual API endpoint
        const data = await response.json();
        setEvents(data);

        // Check registration statuses for fetched events
        const registrations = {};
        for (const event of data) {
          const registrationResponse = await fetch(`http://localhost:8000/event/${event._id}/is-registered`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userIdS }),
          });
          const registrationData = await registrationResponse.json();
          registrations[event._id] = registrationData.isRegistered;
        }
        setUserRegistrations(registrations);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userIdS]);

  const handleShowImages = async (eventId) => {
    const selectedEvent = events.find(event => event._id === eventId);
    setSelectedEventId(eventId);
    setSelectedEventName(selectedEvent ? selectedEvent.name : ""); // Set the selected event name

    try {
      const response = await fetch(`http://localhost:8000/event-images/event/${eventId}`); // Change this URL to your actual API endpoint
      const data = await response.json();
      setEventImages(data);
    } catch (error) {
      console.error("Error fetching event images:", error);
    }
  };

  const handleSubscription = async (eventId, isRegistered) => {
    try {
      const url = `http://localhost:8000/event/${eventId}/${isRegistered ? 'unregister' : 'register'}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userIdS }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "An error occurred");
        return;
      }

      const data = await response.json();
      setUserRegistrations(prev => ({
        ...prev,
        [eventId]: !isRegistered,
      }));

      toast.success(data.message);
    } catch (error) {
      toast.error("An error occurred while processing your request");
      console.error("Error handling subscription:", error);
    }
  };

  return (
    <div>
      <Main2 />
      <div className="events_list">
        <div className="events_list_box">
          <ToastContainer />
          {events.length > 0 ? (
            events.map((event) => (
              <React.Fragment key={event._id}>
                <div className="box_event">
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <p>Event Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Event Location: {event.location}</p>
                  <p>Number of Registrations: {event.registrations ? event.registrations.length : 0}</p>
                </div>
                <div className="subscr">
                  {userRegistrations[event._id] ? (
                    <button 
                      className="button_unsubscribe" 
                      onClick={() => handleSubscription(event._id, true)}
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button 
                      className="button_subscribe" 
                      onClick={() => handleSubscription(event._id, false)}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
                <div className="button_image">
                  <button onClick={() => handleShowImages(event._id)}>Show Images</button>
                </div>
              </React.Fragment>
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
        <div className="events_list_date">
          {selectedEventId && (
            <div>
              <h2 className="titleevent">{selectedEventName}</h2> {/* Display the selected event name */}
              {eventImages.length > 0 ? (
                <div className="event_images">
                  {eventImages.map((image) => (
                    <div className="show2" key={image._id}>
                      <img
                        src={`http://localhost:8000/${image.url}`} // Update to your actual image path
                        alt={image.name}
                      />
                      <h4>{image.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="show1">
                  <h4>Here we display Event images</h4>
                  <p>No images available for this event</p>
                </div>
              )}
            </div>
          )}
          {!selectedEventId && (
            <div className="show1">
              <h4>Here we display Event images</h4>
              <p>Click on "Show Images" to see event images.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
