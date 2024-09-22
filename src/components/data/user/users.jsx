import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importer Link
import '../../../assets/css/adm.css';
import Admin from "../../admin";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Users = ({userrole} ) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
      console.log("userrole   :");
      console.log({userrole});
    } catch (error) {
      console.error("Erreur lors de la récupération des users :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://localhost:8000/delete/user/${id}`);
        setUsers(users.filter(user => user._id !== id)); // Update the UI
      } catch (error) {
        console.error("Erreur lors de la suppression du user :", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Admin>
      <div className="title">
        <h2>Users :</h2>
        <div className="add-role">
        {userrole === "Admin User" && (
            <>      <span>to Add new User</span>
          <Link to="/AddUser" className="add-role-btn">Add User</Link>     
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
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="actions">
                  <Link to={`/userdetails/${user._id}`} title="View Details">
                    <FaEye />
                  </Link>
                  {userrole === "Admin User" && (     
                <>        
                               <Link to={`/useredit/${user._id}`} title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(user._id)} title="Delete" className="delete-btn">
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

export default Users;
