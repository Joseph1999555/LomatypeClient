import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="pageContainer">
      <div className="adminContainer">
        <h1 className="adminTitle">Admin Dashboard</h1>

        {/* Navigation Links */}
        <section className="navigation">
          <button className="adminButton" onClick={() => navigate('/admin/userManagement')}>
            User Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/languageManagement')}>
            Language Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/moduleManagement')}>
            Module Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/typeManagement')}>
            Type Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/difficultyManagement')}>
            Difficulty Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/codeSnippetManagement')}>
            Code Snippet Management
          </button>
          <button className="adminButton" onClick={() => navigate('/admin/typingStatManagement')}>
            Typing Stats Management
          </button>
        </section>

        {/* Logout Button */}
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <style>
        {`
          .pageContainer {
            width: 100%;
            display: flex; 
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .adminContainer {
            width: 60%;
            padding: 20px;
            text-align: center;
            border: 1px solid #BF7AA0; /* Medium pink border */
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            background-color: rgba(2, 56, 89, 0.9); /* Slightly transparent background */
          }

          .adminTitle {
            margin-bottom: 20px;
            font-size: 2rem; /* Slightly larger for prominence */
            color: #F2D8E1; /* Pink */
          }

          .navigation {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }

          .adminButton {
            padding: 12px;
            font-size: 1.5rem;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #368ABF; /* Light blue */
            color: #F2D8E1; /* Text color */
            transition: background-color 0.3s ease;
          }

          .adminButton:hover {
            background-color: #347EBF; /* Darker blue on hover */
          }

          .logoutButton {
            padding: 12px;
            font-size: 1.5rem;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #dc3545; /* Red for logout */
            color: #fff;
            transition: background-color 0.3s ease;
            margin-top: 20px; /* Spacing above logout button */
          }

          .logoutButton:hover {
            background-color: #c82333; /* Darker red on hover */
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
