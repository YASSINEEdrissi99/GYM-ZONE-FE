import React from "react";
import Main2 from "./Main2";
import { Link } from 'react-router-dom';
import '../assets/css/adm.css'

const Admin = ({ children }) => {
  return (

    <div >
      <Main2 />
      <div className="admin">
            <div className="admin_bx1">
            <Link to="/users" className="datalink">Users Data</Link>
            <Link to="/roles" className="datalink">Roles Data</Link>
            <Link to="/Activities" className="datalink">Activities Data</Link>
            <Link to="/Categories" className="datalink">Categories Data</Link>
            <Link to="/ActivityRegistrations" className="datalink">Activity Registrations Data</Link>
            <Link to="/Eventslist" className="datalink">Events Data</Link>
            <Link to="/EventImages" className="datalink">Events Images</Link>
            <Link to="/UserProfiles" className="datalink">User Profiles</Link>
            
            </div>
            <div className="admin_bx2">
            {children}
            </div>
      </div>
    </div>
  );
};

export default Admin;