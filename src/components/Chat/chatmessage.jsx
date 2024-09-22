import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from '../../assets/img/image.png';
import { io } from 'socket.io-client';
import '../../assets/css/chat.css';

const socket = io('http://localhost:8000'); // Connect to the backend Socket.io server

// Function to fetch profile image URL by user ID
const fetchProfileImage = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8000/user-profil/image/${userId}`);
    return response.data.url ? `http://localhost:8000/${response.data.url}` : logo;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return logo; // Return default image if an error occurs
  }
};

const ChatMessage = ({ selectedUserId, userIdsession }) => {
  const [profileImage, setProfileImage] = useState(logo);
  const [usercurrent1 , setusercurrent1] = useState();
  const [message, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef(); // Reference to handle auto-scrolling

  useEffect(() => {
    if (selectedUserId) {
      const fetchImage = async () => {
        const imageUrl = await fetchProfileImage(selectedUserId);
        setProfileImage(imageUrl);
        const response1 = await axios.get(`http://localhost:8000/user/${selectedUserId}`);
        setusercurrent1(response1.data.email);
      };

      fetchImage();
    } else {
      setProfileImage(logo);
    }

    const getMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get/chat/msg/${userIdsession}/${selectedUserId}`);
        setMessage(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessage();
  }, [selectedUserId, userIdsession]);

  // Connect to socket and listen for new messages
  useEffect(() => {
    if (selectedUserId && userIdsession) {
      socket.emit("addUser", userIdsession); // Ajouter l'utilisateur actuel
  
      socket.on("msg-receive", (msg) => {
        // Vérifiez si le message est destiné à l'utilisateur actuel
        if (msg.from === selectedUserId) {
          setMessage((prevMessages) => [...prevMessages, { myself: false, message: msg.message }]);
        }
      });
    }
  
    return () => {
      socket.off("msg-receive"); // Nettoyer l'écouteur
    };
  }, [selectedUserId, userIdsession]);
  
  
 

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]); // This runs whenever the message state changes

  const sendMsg = () => {
    const newMessage = {
      from: userIdsession,
      to: selectedUserId, // Vérifiez que cela correspond à l'utilisateur que vous souhaitez contacter
      message: inputMessage,
    };
  
    socket.emit("send-msg", newMessage); // Envoyer le message via Socket.io
  
    // Enregistrer le message dans la base de données
    fetch(`http://localhost:8000/msg`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        return response.json();
      })
      .then(data => {
        setMessage((prevMessages) => [...prevMessages, { myself: true, message: inputMessage }]);
        setInputMessage(""); // Effacer l'entrée après l'envoi
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  };
  
  
  

  return ( 
    <div className="messageboxchat">
      <div className="chat_name">
        {selectedUserId && <img src={profileImage} alt="User profile" />}
        <h2>{selectedUserId ? `friend's email: ${usercurrent1}` : 'Open Your Message Tab To Chat With Friend'}</h2>
      </div>
      {selectedUserId &&
        <>
          <div className="messages_cht">
            {message && message.length > 0 && message.map((item, index) => (
              item.myself === false ? (
                <div className="friendmsgbox" key={index}>
                  <img src={profileImage} alt="Chat logo" className="pic_msg" />
                  <div className="friendmsg">
                    <p>{item.message}</p>
                  </div>
                </div>
              ) : (
                <div className="friendmsgbox me" key={index}>
                  <div className="friendmsg">
                    <p>{item.message}</p>
                  </div>
                </div>
              )
            ))}
            {/* This div ensures scrolling to the last message */}
            <div ref={scrollRef}></div>
          </div>

          <div className="box_writemsg">
            <input 
              type="text" 
              name="msg" 
              id="msg" 
              value={inputMessage}
              placeholder="Write your message" 
              onChange={(e) => setInputMessage(e.target.value)} 
            />
            <button onClick={sendMsg}>Send</button>
          </div>
        </>
      }
    </div>
  );
};

export default ChatMessage;
