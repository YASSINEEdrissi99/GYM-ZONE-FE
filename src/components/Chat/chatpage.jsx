import React, { useEffect, useState } from "react";
import Main2 from "../Main2";
import '../../assets/css/chat.css';
import logo from '../../assets/img/image.png';
import ChatMessage from "./chatmessage";
import UpdateProfile from "./updateprofile";
import axios from "axios";
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

// Fetch the user's profile image
const fetchProfileImage = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8000/user-profil/image/${userId}`);
    return response.data.url ? `http://localhost:8000/${response.data.url}` : logo;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return logo;
  }
};

const ChatPage = ({ userIdS }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const [userIdsession, setUserIdsession] = useState(userIdS);
  const [newMessages, setNewMessages] = useState({});

  // Load notifications from localStorage when the component mounts
  useEffect(() => {
    const storedNotifications = localStorage.getItem('newMessages');
    if (storedNotifications) {
      setNewMessages(JSON.parse(storedNotifications));
    }
  }, []);

  // Fetch users and their profile images
  useEffect(() => {
    setUserIdsession(userIdS);
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setUsers(response.data);

        const imagePromises = response.data.map(user => fetchProfileImage(user._id));
        const images = await Promise.all(imagePromises);

        const imagesMap = response.data.reduce((acc, user, index) => {
          acc[user._id] = images[index];
          return acc;
        }, {});

        setProfileImages(imagesMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [userIdS]);

  // Add user to socket session
  useEffect(() => {
    socket.emit("addUser", userIdsession);
  }, [userIdsession]);

  // Listen for notifications and messages
  useEffect(() => {
    // Listen for notifications and messages
    socket.on("new-message-notification", ({ from }) => {
      // Increment the notification count regardless of the selected user
      if (from !== userIdsession) {  // Ensure the message is not from the current user (yourself)
        setNewMessages(prev => {
          const updated = { ...prev, [from]: (prev[from] || 0) + 1 };
          localStorage.setItem('newMessages', JSON.stringify(updated)); // Save notifications to localStorage
          return updated;
        });
      }
    });

    socket.on("msg-receive", ({ message, from }) => {
      console.log(`New message from ${from}: ${message}`);
    });

    return () => {
      socket.off("new-message-notification");
      socket.off("msg-receive");
    };
}, [selectedUserId, userIdsession]);  // Ensure it runs on change of selectedUserId or userIdsession


  // Handle input search
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  // Filter users based on the search input
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle clicking on a user to chat with them
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setNewMessages(prev => {
      const updated = { ...prev, [userId]: 0 };
      localStorage.setItem('newMessages', JSON.stringify(updated)); // Save notifications to localStorage
      return updated;
    });
  };

  return (
    <div>
      <Main2 />
      <div className="chatcontainer">
        <div className="usersboxchat">
          <div className="searchfriend">
            <input
              type="text"
              name="email_friend"
              placeholder="Write email"
              id="email_friend"
              value={searchText}
              onChange={handleInputChange}
            />
          </div>

          {filteredUsers.map((user) => (
            user._id !== userIdsession && (
              <div className="discussionbox" key={user._id} onClick={() => handleUserClick(user._id)}>
                <div className="discussion-item">
                  <img src={profileImages[user._id] || logo} alt={`${user.name}'s profile`} className="discussion-img" />
                  <div className="discussion-text">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  {newMessages[user._id] > 0 && (
                    <span className="new-message-notification">
                      {newMessages[user._id]} new message{newMessages[user._id] > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
        <ChatMessage selectedUserId={selectedUserId} userIdsession={userIdsession} />
        <UpdateProfile selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} userIdsession={userIdsession} />
      </div>
    </div>
  );
};

export default ChatPage;
