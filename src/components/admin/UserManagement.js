import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await axios.get('http://localhost:3005/admin/fetch/users', {
                headers: {
                    'Authorization': `Bearer ${token}` // Send token in header
                }
            });
            setUsers(response.data); // Set users state
            setLoading(false); // Set loading to false when done
        } catch (err) {
            setError(err.message); // Store error if any
            setLoading(false); // Set loading to false in case of error
        }
    };

    // Use useEffect to fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3005/admin/delete/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Refresh users data after deletion
            fetchUsers();
        } catch (err) {
            setError(err.message); // Store error if any
        }
    };

    const navigateDashboard = () => {
        navigate('/admin'); // Navigate to the admin dashboard
    };

    return (
        <div className="pageContainer">
            <div className="userManagementContainer">
                <h1 className="title">User Management</h1>
                <button className="navButton" onClick={navigateDashboard}>
                    Back to Dashboard
                </button>
                {loading && <p>Loading...</p>}
                {error && <p className="error">Error: {error}</p>}
                {!loading && (
                    <table className="userTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="deleteButton" onClick={() => deleteUser(user._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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

                    .userManagementContainer {
                        width: 60%;
                        padding: 20px;
                        border: 1px solid #BF7AA0; /* Medium pink border */
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        background-color: rgba(2, 56, 89, 0.9); /* Slightly transparent background */
                    }

                    .title {
                        margin-bottom: 20px;
                        font-size: 2rem; /* Slightly larger for prominence */
                        color: #F2D8E1; /* Pink */
                    }

                    .userTable {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    .userTable th, .userTable td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd; /* Light border between rows */
                        color: #F2D8E1; /* Text color */
                    }

                    .userTable th {
                        background-color: #368ABF; /* Light blue background for header */
                        color: #fff; /* White text for header */
                    }

                    .deleteButton {
                        padding: 8px 12px;
                        font-size: 1rem;
                        cursor: pointer;
                        border-radius: 5px;
                        border: none;
                        background-color: #dc3545; /* Red for delete */
                        color: #fff;
                        transition: background-color 0.3s ease;
                    }

                    .deleteButton:hover {
                        background-color: #c82333; /* Darker red on hover */
                    }

                    .error {
                        color: #f44336; /* Red for error messages */
                        margin: 10px 0;
                        font-weight: bold;
                    }

                    .navButton {
                        padding: 10px 15px;
                        font-size: 1rem;
                        cursor: pointer;
                        border-radius: 5px;
                        border: none;
                        background-color: orange; /* Red for logout */
                        color: #fff;
                        transition: background-color 0.3s ease;
                        margin-top: 20px; /* Spacing above logout button */
                    }

                    .navButton:hover {
                        background-color: #c82333; /* Darker red on hover */
                    }
                `}
            </style>
        </div>
    );
};

export default UserManagement;
