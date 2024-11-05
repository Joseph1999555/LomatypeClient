import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DifficultyManagement = () => {
    const [difficulties, setDifficulties] = useState([]);
    const [newDifficulty, setNewDifficulty] = useState('');
    const [editDifficultyId, setEditDifficultyId] = useState(null);
    const [editDifficultyValue, setEditDifficultyValue] = useState('');
    const navigate = useNavigate();

    const fetchDifficulties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3005/admin/fetch/difficulties', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDifficulties(response.data);
        } catch (error) {
            console.error('Error fetching difficulties:', error);
        }
    };

    const addDifficulty = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3005/admin/create/difficulty', {
                name: newDifficulty,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNewDifficulty('');
            fetchDifficulties();
        } catch (error) {
            console.error('Error adding difficulty:', error);
        }
    };

    const updateDifficulty = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3005/admin/update/difficulty/${id}`, {
                name: editDifficultyValue,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEditDifficultyId(null);
            setEditDifficultyValue('');
            fetchDifficulties();
        } catch (error) {
            console.error('Error updating difficulty:', error);
        }
    };

    const deleteDifficulty = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3005/admin/delete/difficulty/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchDifficulties();
        } catch (error) {
            console.error('Error deleting difficulty:', error);
        }
    };

    const navigateDashboard = () => {
        navigate('/admin');
    };


    useEffect(() => {
        fetchDifficulties();
    }, []);

    return (
        <div className="pageContainer">
            <div className="difficultyManagementContainer">
                <h1 className="title">Difficulty Management</h1>
                <button className="navButton" onClick={navigateDashboard}>Back to Dashboard</button>
                {/* Section for adding new difficulty */}
                <section className="addDifficultySection">
                    <h2 style={{ color: '#fff' }}>Add New Difficulty</h2>
                    <input
                        type="text"
                        placeholder="Enter difficulty name"
                        value={newDifficulty}
                        onChange={(e) => setNewDifficulty(e.target.value)}
                        className="difficultyInput"
                    />
                    <button onClick={addDifficulty} className="addButton">Add Difficulty</button>
                </section>

                {/* Section for displaying existing difficulties */}
                <section className="existingDifficultiesSection">
                    <h2 style={{ color: '#fff' }}>Existing Difficulties</h2>
                    <ul className="difficultyList">
                        {difficulties.map((difficulty) => (
                            <li key={difficulty._id} className="difficultyItem">
                                {editDifficultyId === difficulty._id ? (
                                    <input
                                        type="text"
                                        value={editDifficultyValue}
                                        onChange={(e) => setEditDifficultyValue(e.target.value)}
                                        className="difficultyInput"
                                    />
                                ) : (
                                    <span className="difficultyName">{difficulty.difficult_level}</span>
                                )}
                                <div className="buttonContainer">
                                    {editDifficultyId === difficulty._id ? (
                                        <button onClick={() => updateDifficulty(difficulty._id)} className="saveButton">Save</button>
                                    ) : (
                                        <button onClick={() => {
                                            setEditDifficultyId(difficulty._id);
                                            setEditDifficultyValue(difficulty.difficult_level);
                                        }} className="editButton">Edit</button>
                                    )}
                                    <button onClick={() => deleteDifficulty(difficulty._id)} className="deleteButton">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <style>
                    {`
                    .pageContainer {
                        width: 100%;
                        display: flex; 
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .difficultyManagementContainer {
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

                    .addDifficultySection, .existingDifficultiesSection {
                        margin-bottom: 20px;
                        color: '#F2D8E1',
                    }

                    .difficultyInput {
                        padding: 10px;
                        margin: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        width: calc(50% - 20px); /* Responsive width */
                    }

                    .addButton {
                        padding: 10px 15px;
                        font-size: 1rem;
                        cursor: pointer;
                        border-radius: 5px;
                        border: none;
                        background-color: #007bff; /* Blue for add button */
                        color: #fff;
                        transition: background-color 0.3s ease;
                    }

                    .addButton:hover {
                        background-color: #0056b3; /* Darker blue on hover */
                    }

                    .difficultyList {
                        list-style-type: none;
                        padding: 0;
                    }

                    .difficultyItem {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px;
                        border-bottom: 1px solid #ddd; /* Light border between items */
                        color: #F2D8E1; /* Text color */
                    }

                    .buttonContainer {
                        display: flex;
                        gap: 10px; /* Space between buttons */
                    }

                    .editButton, .saveButton, .deleteButton {
                        padding: 8px 12px;
                        font-size: 0.9rem;
                        cursor: pointer;
                        border-radius: 5px;
                        border: none;
                        color: #fff;
                        transition: background-color 0.3s ease;
                    }

                    .editButton {
                        background-color: #007bff; /* Blue for edit button */
                    }

                    .editButton:hover {
                        background-color: #0056b3; /* Darker blue on hover */
                    }

                    .saveButton {
                        background-color: #28a745; /* Green for save button */
                    }

                    .saveButton:hover {
                        background-color: #218838; /* Darker green on hover */
                    }

                    .deleteButton {
                        background-color: #dc3545; /* Red for delete button */
                    }

                    .deleteButton:hover {
                        background-color: #c82333; /* Darker red on hover */
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
        </div>
    );
};

export default DifficultyManagement;
