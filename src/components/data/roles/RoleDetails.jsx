import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/adm.css';
import Admin from "../../admin";

const RoleDetails = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [role, setRole] = useState(null);

  const fetchRoleDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/role/${id}`);
      setRole(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du rôle :", error);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, [id]);

  if (!role) {
    return <Admin> <div>Chargement...</div> </Admin>; // Affiche un message de chargement si les données ne sont pas encore disponibles
  }

  return (
    <Admin>
      <div className="title">
        <h2>Role Details</h2>
      </div>
      <div className="role-details">
        <p><strong>ID: </strong>{role._id}</p>
        <p><strong>Name: </strong>{role.name}</p>
        <p><strong>Description: </strong>{role.description}</p>
        <Link to="/roles" className="back-btn">Back to Roles</Link>
      </div>
    </Admin>
  );
};

export default RoleDetails;
