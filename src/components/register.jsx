import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../assets/css/log.css';
import Main1 from "./Main1";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const userData = {
      name: username, // Backend expects 'name'
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:8000/user", userData);
      console.log("Server Response:", response.data);
      toast.success("Sign-up successful! You can now Sign in.");
    } catch (error) {
      console.error("There was an error signing up:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred during sign-up.");
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="main">
          <Main1 />
          <div className="log_box">
            <h1>Sign Up</h1>
            <div className="input_box">
              <input
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className='bx bxs-user'></i>
            </div>
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
                <input type="checkbox"  /> remember me
              </label>
            </div>
            <button type="submit" className="btn"> Sign Up </button>
            <div className="register_link">
              <p>Already have an account? <Link to="/login">Click here to sign in.</Link></p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Signup;
