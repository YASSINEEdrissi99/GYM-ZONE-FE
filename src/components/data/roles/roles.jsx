import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importer Link
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Roles = ({userrole}) => {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://localhost:8000/role/${id}`);
        setRoles(roles.filter(role => role._id !== id)); // Update the UI
      } catch (error) {
        console.error("Erreur lors de la suppression du rôle :", error);
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Roles :</h2>
        <div className="add-role">
          
          {userrole === "Admin User" && (
            <>            <span>to Add new Role</span>
               <Link to="/AddRole" className="add-role-btn">Add Role</Link>
               </>

            )}
         
        </div>
      </div>
      <div className="content_table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td>{role._id}</td>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td className="actions">
                  <Link to={`/roledetails/${role._id}`} title="View Details">
                    <FaEye /> </Link>
                    {userrole === "Admin User" && (
            <>          
                <Link to={`/roleedit/${role._id}`} title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(role._id)} title="Delete" className="delete-btn">
                    <FaTrash />
                  </button>
               </>

            )}
                 
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Admin>
  );
};

export default Roles;
