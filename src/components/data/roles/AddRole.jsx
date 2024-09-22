import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/adm.css';
import '../../../assets/css/formupdate.css';
import Admin from "../../admin";

const AddRole = () => {
  const [role, setRole] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/role", role);
      navigate('/roles');
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle :", error);
    }
  };

  return (
    <Admin>
      <div className="title">
        <h2>Add New Role</h2>
      </div>
      <div className="content_table1">
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={role.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={role.description}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="add-role-btn">Add Role</button>
        </form>
      </div>
    </Admin>
  );
};

export default AddRole;
