import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const TypingStatManagement = () => {
    const [typingStats, setTypingStats] = useState([]);
    const navigate = useNavigate();

    // Fetch typing stats from API
    useEffect(() => {
        fetchTypingStats();
    }, []);

    const fetchTypingStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3005/admin/fetch/alltypingstats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTypingStats(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching typing stats:", error);
        }
    };

    const deleteTypingStat = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3005/admin/delete/typingstat/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Remove deleted stat from state
            setTypingStats(prevStats => prevStats.filter(stat => stat._id !== id));
            console.log(`Typing stat with ID ${id} deleted`);
        } catch (error) {
            console.error("Error deleting typing stat:", error);
        }
    };

    const navigateDashboard = () => {
        navigate('/admin');
    };

    return (
        <div className="pageContainer">
            <style>{`
                body {
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 1200px;
                    height: 100vh;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    text-align: center;
                    color: #333;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                th {
                    background-color: #f2f2f2;
                    color: #333;
                }

                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                tr:hover {
                    background-color: #f1f1f1;
                }

                button {
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: #c0392b;
                }

                p {
                    text-align: center;
                    font-size: 16px;
                    color: #666;
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
            `}</style>

            <div className="container">
                <h1>Typing Stat Management</h1>

                <button class= "navButton" onClick={navigateDashboard}>Back to Dashboard</button>

                {/* Check if there are any stats available */}
                {typingStats.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Code Snippet ID</th>
                                <th>Typing Speed</th>
                                <th>Accuracy</th>
                                <th>Errors</th>
                                <th>Time</th>
                                <th>Module</th>
                                <th>Type</th>
                                <th>Difficulty</th>
                                <th>Language</th>
                                <th>type on</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {typingStats.map((stat) => (
                                <tr key={stat._id}>
                                    <td>{stat.user_id?.username}</td>
                                    <td><pre>{stat.code_snippet_id?.snippet_text}</pre></td>
                                    <td>{stat.typing_speed}</td>
                                    <td>{stat.typing_accuracy}</td>
                                    <td>{stat.typing_errors || 0}</td>
                                    <td>{stat.typing_time}</td>
                                    <td>{stat.module_id?.module_name}</td>
                                    <td>{stat.type_id?.type_name}</td>
                                    <td>{stat.difficult_id?.difficult_level}</td>
                                    <td>{stat.language_id?.language_name}</td>
                                    <td>{new Date(stat.created_at).toLocaleString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                    <td>
                                        <button onClick={() => deleteTypingStat(stat._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No typing stats available.</p>
                )}
            </div>
        </div>
    );
};

export default TypingStatManagement;
