import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../assets/css/adm.css';
import '../../../assets/css/formupdate.css';
import Admin from "../../admin";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState({ name: '', description: '' });

  const fetchRoleDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/role/${id}`);
      setRole(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du rôle :", error);
    }
  };

  const handleChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/role/${id}`, role);
      navigate('/roles');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, [id]);

  return (
    <Admin>
        <div>
      <div className="title">
        <h2>Edit Role</h2>
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
          <button type="submit" className="add-role-btn">Save Changes</button>
        </form>
      </div>
      </div>
    </Admin>
  );
};

export default EditRole;
