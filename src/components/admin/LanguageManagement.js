import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LanguageManagement = () => {
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState("");
    const [editLanguage, setEditLanguage] = useState(null);
    const [editLanguageValue, setEditLanguageValue] = useState("");
    const navigate = useNavigate();

    // Function to fetch languages
    const fetchLanguages = async () => {
        try {
            const token = localStorage.getItem("token");
            const languagesResponse = await axios.get("http://localhost:3005/admin/fetch/languages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLanguages(languagesResponse.data);
        } catch (error) {
            console.error("Error fetching languages:", error);
        }
    };

    // Function to add a new language
    const addLanguage = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3005/admin/create/language",
                { name: newLanguage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewLanguage(""); // Reset input after adding language
            fetchLanguages(); // Refresh languages list
        } catch (error) {
            console.error("Error adding language:", error);
        }
    };

    // Function to update a language
    const updateLanguage = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3005/admin/update/language/${id}`,
                { name: editLanguageValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditLanguage(null); // Reset edit mode
            setEditLanguageValue(""); // Clear input value
            fetchLanguages(); // Refresh languages list
        } catch (error) {
            console.error("Error updating language:", error);
        }
    };

    // Function to remove a language
    const removeLanguage = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3005/admin/delete/language/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchLanguages(); // Refresh languages list
        } catch (error) {
            console.error("Error deleting language:", error);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const navigateDashboard = () => {
        navigate('/admin');
    };

    return (
        <div className="pageContainer">
            <div className="languageManagementContainer">
                <h1 className="title">Language Management</h1>
                <button className="navButton" onClick={navigateDashboard}>Back to Dashboard</button>
                {/* Form to add a new language */}
                <div className="addLanguageForm">
                    <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add new language"
                        className="languageInput"
                    />
                    <button className="addButton" onClick={addLanguage}>Add Language</button>
                    
                </div>

                {/* Displaying the list of languages */}
                <ul className="languageList">
                    {languages.map((language) => (
                        <li key={language._id} className="languageItem">
                            {editLanguage === language._id ? (
                                <input
                                    type="text"
                                    value={editLanguageValue}
                                    onChange={(e) => setEditLanguageValue(e.target.value)}
                                    className="languageInput"
                                />
                            ) : (
                                <span>{language.language_name}</span>
                            )}

                            {/* Container for edit and delete buttons */}
                            <div className="buttonContainer">
                                {/* Edit button */}
                                {editLanguage === language._id ? (
                                    <button className="saveButton" onClick={() => updateLanguage(language._id)}>Save</button>
                                ) : (
                                    <button className="editButton" onClick={() => {
                                        setEditLanguage(language._id);
                                        setEditLanguageValue(language.language_name);
                                    }}>Edit</button>
                                )}

                                {/* Delete button */}
                                <button className="deleteButton" onClick={() => removeLanguage(language._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
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

                    .languageManagementContainer {
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

                    .addLanguageForm {
                        margin-bottom: 20px;
                    }

                    .languageInput {
                        padding: 10px;
                        margin-right: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        width: 200px;
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

                    .languageList {
                        list-style-type: none;
                        padding: 0;
                    }

                    .languageItem {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px;
                        border-bottom: 1px solid #ddd; /* Light border between items */
                        color: #F2D8E1; /* Text color */
                    }

                    .buttonContainer {
                        display: flex;
                        gap: 5px; /* Space between buttons */
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
    );
};

export default LanguageManagement;
