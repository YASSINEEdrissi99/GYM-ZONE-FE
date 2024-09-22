import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Main from './components/Main';
import Admin from './components/admin';
import Event from './components/Events';
import Register from './components/register';
import Roles from './components/data/roles/roles';
import RoleDetails from './components/data/roles/RoleDetails';
import EditRole from './components/data/roles/EditRole';
import AddRole from './components/data/roles/AddRole';
import Users from './components/data/user/users';
import UserDetails from './components/data/user/UserDetails';
import AddUser from './components/data/user/AddUser';
import EditUser from './components/data/user/EditUser';
import Login from './components/login';
import Activities from './components/data/activities/activities';
import ActivityDetail from './components/data/activities/ActivityDetail';
import Categories from './components/data/categories/categories';
import AddCategory from './components/data/categories/AddCategory';
import CategoryDetail from './components/data/categories/CategorieDetail';
import EditActivity from './components/data/activities/EditActivity';
import AddRegistration from './components/data/activityRegistrations/AddRegistration';
import EditRegistration from './components/data/activityRegistrations/EditRegistration';
import EditCategory from './components/data/categories/EditCategory';
import ActivityRegistrations from './components/data/activityRegistrations/activityRegistrations';
import RegistrationDetail from './components/data/activityRegistrations/RegistrationDetail';
import ClientActivities from './components/clientComponents/clientActivities';
import Clientacti_detail from './components/clientComponents/clientacti_detail';
import ActivityDay from './components/clientComponents/activity_day';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AddActivity from './components/data/activities/AddActivity';
import ActivityCategorie from './components/clientComponents/activityCategorie';
import Eventslist from './components/data/events/events';
import AddEvent from './components/data/events/AddEvent';
import EventDetails from './components/data/events/eventdetail';
import EditEvent from './components/data/events/EditEvent';
import EventRegistration from './components/data/events/eventRegistration';
import EventImages from './components/data/event_images/EventImages';
import AddEventImage from './components/data/event_images/AddEventImage';
import EventImageDetail from './components/data/event_images/EventImageDetail';
import UpdateEventImage from './components/data/event_images/UpdateEventImage';
import ChatPage from './components/Chat/chatpage';
import UserProfiles from './components/data/userprofile/UserProfiles';
import AddUserProfile from './components/data/userprofile/AddProfil';
import UserProfileDetails from './components/data/userprofile/UserProfileDetails';
import UpdateUserProfile from './components/data/userprofile/UpdateUserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userrole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [userIdS, setuserIdS] = useState('');
  const [userName, setUserName] = useState(''); // State for user's name
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);

      const userId = decodedToken.id;
      setuserIdS(userId);
      fetchUserRole(userId);
      fetchUserName(userId);
      console.log(userId)

      // Fetch email from localStorage
      const storedEmail = localStorage.getItem('email');
      setEmail(storedEmail);
    } else {
      // Clear email and name if no token
      setEmail('');
      setUserName('');
    }
  }, [isLoggedIn]);

  const fetchUserRole = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      const roleId = response.data.roles;
      const roleResponse = await axios.get(`http://localhost:8000/role/${roleId}`);
      setUserRole(roleResponse.data.name);
      console.log({userrole})
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      setUserName(response.data.name); // Assuming the API returns user name
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Clear email on logout
    setIsLoggedIn(false);
    setEmail(''); // Clear email state
    setUserName(''); // Clear user name state
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      
      if (event.target.closest('.user-icon') === null) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='navbarhome'>
        <div>
          <Link to="/" className="gym_logo">
            <span className="gym">GYM</span> <span className="zone">ZONE</span>
          </Link>
        </div>
        <div className='links'>
          <div className='link_site'>
            <Link to="/" className="link_site_pages">Home</Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="link_site_pages">Activities</Link>
                <Link to="/login" className="link_site_pages">Events</Link>
                <Link to="/login" className="link_site_pages">Chat</Link>
              </>
            ) : (
              <>
                <Link to="/clientActivities" className="link_site_pages">Activities</Link>
                <Link to="/Events" className="link_site_pages">Events</Link>
                <Link to="/ChatPage" className="link_site_pages">Chat</Link>
              </>
            )}

            {isLoggedIn && userrole !== "Simple User" && (
              <Link to="/administration" className="link_site_pages">Administration</Link>
            )}
          </div>
          <div className='link_log'>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="login_btn">Sign In</Link>
                <Link to="/signup" className="login_btn">Sign up</Link>
              </>
            ) : (
              <div className='welcp'>
                <p>Welcome to our Zone,<span> {userName}</span>.</p>
                <div className="user-icon">
                  <FaUserCircle onClick={handleDropdownToggle} className="user-icon-svg" />
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <div className='flexdrp'>
                        <span className="user-email"> ({userrole})</span>
                        <span className="user-email">{email}</span>
                        <Link to="/" className="dropdown-link">Home</Link>
                        <button onClick={handleLogout} className="logout_link">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Routes>
      <Route path="/ChatPage" element={<ChatPage userIdS={userIdS}/>} />
        <Route path="/" element={<Main isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/Events" element={<Event userIdS={userIdS}/>} />
        <Route path="/administration" element={<Admin />} />
        <Route path="/roles" element={<Roles userrole={userrole} />} />
        <Route path="/roledetails/:id" element={<RoleDetails />} />
        <Route path="/roleedit/:id" element={<EditRole />} />
        <Route path="/AddRole" element={<AddRole />} />
        <Route path="/users" element={<Users userrole={userrole} />} />
        <Route path="/userdetails/:id" element={<UserDetails />} />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/useredit/:id" element={<EditUser />} />
        <Route path="/Activities" element={<Activities userrole={userrole} />} />
        <Route path="/Categories" element={<Categories userrole={userrole} />} />
        <Route path="/EventImages" element={<EventImages userrole={userrole} />} />
        <Route path="/AddCategory" element={<AddCategory />} />
        <Route path="/CategoryDetail/:id" element={<CategoryDetail />} />
        <Route path="/EditCategory/:id" element={<EditCategory />} />
        <Route path="/EditActivity/:id" element={<EditActivity />} />
        <Route path="/ActivityRegistrations" element={<ActivityRegistrations userrole={userrole} />} />
        <Route path="/AddRegistration" element={<AddRegistration />} />
        <Route path="/RegistrationDetail/:id" element={<RegistrationDetail />} />
        <Route path="/UserProfileDetails/:id" element={<UserProfileDetails />} />
        <Route path="/EditRegistration/:id" element={<EditRegistration />} />
        <Route path="/AddActivity" element={<AddActivity />} />
        <Route path="/AddUserProfile" element={<AddUserProfile />} />

        <Route path="/clientActivities" element={<ClientActivities />} />
        <Route path="/Clientacti_detail/:id" element={<Clientacti_detail />} />
        <Route path="/ActivityDay/:day" element={<ActivityDay />} />
        <Route path="/Eventslist" element={<Eventslist userrole={userrole} />} />
        <Route path="/AddEvent" element={<AddEvent />} />
        <Route path="/EventDetails/:id" element={<EventDetails />} />
        <Route path="/EventImageDetail/:id" element={<EventImageDetail />} />
        <Route path="/EditEvent/:id" element={<EditEvent />} />
        <Route path="/UpdateUserProfile/:id" element={<UpdateUserProfile />} />
        <Route path="/UpdateEventImage/:id" element={<UpdateEventImage />} />
        <Route path="/AddEventImage" element={<AddEventImage />} />
        <Route path="/EventRegistration/:id" element={<EventRegistration userrole={userrole} />} />
        <Route path="/ActivityDetail/:id" element={<ActivityDetail />} />
        <Route path="/ActivityCategorie/:categoryId" element={<ActivityCategorie />} />
        <Route path="/UserProfiles" element={<UserProfiles userrole={userrole} />} />
      </Routes>
    </div>
  );
}

export default App;
