import React from "react";
import logo from '../assets/img/backlogo.png';
import logo2 from '../assets/img/logo2.png';
import { Link } from 'react-router-dom';

const Main = ({ isLoggedIn }) => {
  return (
    <div className="main">
      <img src={logo} alt="Gym Zones Logo" className="logo-image" />
      <img src={logo2} alt="Gym Zones Logo" className="logo-image2" />
      <div className="welcome">
        <h1>Welcome to Gym Zone!</h1>
        <p>
          At Gym Zone, we’re dedicated to helping you achieve your fitness goals with ease and convenience. Whether you’re looking to join a new class, connect with top instructors, or stay updated on the latest events, our platform has you covered.
        </p>
        <p>
          Ready to take your fitness journey to the next level? Click below to start exploring all that Gym Zone has to offer!
        </p>
        <div className="btnst">
          {isLoggedIn ? (
            <Link to="/clientActivities" className="login_btn up">
              <h5>Start</h5> <i className='bx bxs-right-arrow-alt'></i>
            </Link>
          ) : (
            <Link to="/signup" className="login_btn up">
              <h5>Start</h5> <i className='bx bxs-right-arrow-alt'></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
