import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModuleManagement = () => {
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState('');
    const [newModuleDescription, setNewModuleDescription] = useState('');
    const [editModuleId, setEditModuleId] = useState(null);
    const [editModuleValue, setEditModuleValue] = useState('');
    const [editModuleDescription, setEditModuleDescription] = useState('');
    const navigate = useNavigate();

    const fetchModules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lomatypeserver.onrender.com/admin/fetch/modules', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const addModule = async () => {
        if (!newModule || !newModuleDescription) {
            alert("Module name and description are required!");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://lomatypeserver.onrender.com/admin/create/module', {
                name: newModule,
                description: newModuleDescription,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNewModule('');
            setNewModuleDescription('');
            fetchModules();
        } catch (error) {
            console.error('Error adding module:', error);
        }
    };

    const updateModule = async (id) => {
        if (!editModuleValue || !editModuleDescription) {
            alert("Module name and description are required!");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://lomatypeserver.onrender.com/admin/update/module/${id}`, {
                name: editModuleValue,
                description: editModuleDescription,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEditModuleId(null);
            setEditModuleValue('');
            setEditModuleDescription('');
            fetchModules();
        } catch (error) {
            console.error('Error updating module:', error);
        }
    };

    const deleteModule = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://lomatypeserver.onrender.com/admin/delete/module/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchModules();
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const navigateDashboard = () => {
        navigate('/admin');
    };

    return (
        <div className="pageContainer">
            <div className="moduleManagementContainer">
                <h1 className="title">Module Management</h1>
                <button className="navButton" onClick={navigateDashboard}>Back to Dashboard</button>
                {/* Section for adding new module */}
                <section className="addModuleSection">
                    <h2>Add New Module</h2>
                    <input
                        type="text"
                        placeholder="Enter module name"
                        value={newModule}
                        onChange={(e) => setNewModule(e.target.value)}
                        className="moduleInput"
                    />
                    <input
                        type="text"
                        placeholder="Enter module description"
                        value={newModuleDescription}
                        onChange={(e) => setNewModuleDescription(e.target.value)}
                        className="moduleInput"
                    />
                    <button className="addButton" onClick={addModule}>Add Module</button>
                </section>


                {/* Section for displaying existing modules */}
                <section className="existingModulesSection">
                    <h2>Existing Modules</h2>
                    <ul className="moduleList">
                        {modules.map((module) => (
                            <li key={module._id} className="moduleItem">
                                {editModuleId === module._id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editModuleValue}
                                            onChange={(e) => setEditModuleValue(e.target.value)}
                                            className="moduleInput"
                                        />
                                        <input
                                            type="text"
                                            value={editModuleDescription}
                                            onChange={(e) => setEditModuleDescription(e.target.value)}
                                            className="moduleInput"
                                        />
                                        <button className="saveButton" onClick={() => updateModule(module._id)}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{module.module_name} - {module.module_description}</span>
                                        {/* Container for Edit and Delete buttons */}
                                        <div className="buttonContainer">
                                            <button className="editButton" onClick={() => {
                                                setEditModuleId(module._id);
                                                setEditModuleValue(module.module_name);
                                                setEditModuleDescription(module.module_description);
                                            }}>Edit</button>
                                            <button className="deleteButton" onClick={() => deleteModule(module._id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
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

                    .moduleManagementContainer {
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

                    .addModuleSection, .existingModulesSection {
                        margin-bottom: 20px;
                        color: #F2D8E1; /* Text color */
                    }

                    .moduleInput {
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

                    .moduleList {
                        list-style-type: none;
                        padding: 0;
                    }

                    .moduleItem {
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
    );
};

export default ModuleManagement;
