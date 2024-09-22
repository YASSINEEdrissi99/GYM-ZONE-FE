import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../assets/css/log.css';
import Main1 from "./Main1";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:8000/login", userData);
      console.log("Server Response:", response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email); // Save the email

      const decodedToken = jwtDecode(response.data.token);
      console.log("Decoded Token:", decodedToken);

      toast.success("Login successful! Redirecting...");

      // Set isLoggedIn to true after successful login
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error("Error logging in:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main">
        <Main1 />
        <div className="log_box">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input_box">
              <input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input_box">
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className='bx bxs-lock-alt'></i>
            </div>
            <div className="remember">
              <label>
                <input type="checkbox" /> remember me
              </label>
            </div>
            <button type="submit" className="btn">Login</button>
          </form>
          <div className="register_link">
            <p>Don't have an account? <Link to="/signup">Register</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
