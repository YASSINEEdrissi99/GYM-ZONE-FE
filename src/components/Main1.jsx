import React from "react";
import logo from '../assets/img/backlogo.png'
import logo2 from '../assets/img/logo2.png'

const Main1 = () => {
  return (
    <div className="main">
      <img src={logo} alt="Gym Zones Logo" className="logo-image" />
      <img src={logo2} alt="Gym Zones Logo" className="logo-image2" />
      
    </div>
  );
};

export default Main1;