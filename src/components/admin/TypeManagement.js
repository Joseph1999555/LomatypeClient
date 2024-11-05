import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TypeManagement = () => {
    const [types, setTypes] = useState([]);
    const [modules, setModules] = useState([]);
    const [newType, setNewType] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [editType, setEditType] = useState(null);
    const [editTypeValue, setEditTypeValue] = useState('');
    const [typeDescription, setTypeDescription] = useState('');
    const navigate = useNavigate();

    const fetchModulesAndTypes = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch all modules
            const modulesResponse = await axios.get('http://localhost:3005/admin/fetch/modules', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setModules(modulesResponse.data);

            // Fetch all types
            const typesResponse = await axios.get('http://localhost:3005/admin/fetch/types', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTypes(typesResponse.data);
        } catch (error) {
            console.error('Error fetching modules and types:', error);
        }
    };

    const addType = async () => {
        if (!selectedModule) {
            alert('Please select a module first!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3005/admin/create/type',
                {
                    name: newType,
                    module_id: selectedModule,
                    type_description: typeDescription // Include type description
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchModulesAndTypes();
            setNewType('');
            setSelectedModule('');
            setTypeDescription(''); // Clear fields after adding
        } catch (error) {
            console.error('Error adding type:', error);
        }
    };

    const updateType = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3005/admin/update/type/${id}`, { type_name: editTypeValue }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEditType(null);
            setEditTypeValue('');
            fetchModulesAndTypes();
        } catch (error) {
            console.error('Error updating type:', error);
        }
    };

    const deleteType = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3005/admin/delete/type/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchModulesAndTypes();
        } catch (error) {
            console.error('Error deleting type:', error);
        }
    };

    useEffect(() => {
        fetchModulesAndTypes();
    }, []);

    const navigateDashboard = () => {
        navigate('/admin');
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.title}>Type Management</h1>
            <section style={styles.addTypeSection}>
            <button style={styles.navButton} onClick={navigateDashboard}>Back to Dashboard</button>
            <h2 style={{ color: '#fff' }}>Add New Type</h2>
                <input
                    type="text"
                    placeholder="Enter type name"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={styles.typeInput}
                />
                <input
                    type="text"
                    placeholder="Enter type description"
                    value={typeDescription}
                    onChange={(e) => setTypeDescription(e.target.value)}
                    style={styles.typeInput}
                />
                <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    style={styles.moduleSelect}
                >
                    <option value="">Select Module</option>
                    {modules.map((module) => (
                        <option key={module._id} value={module._id}>
                            {module.module_name}
                        </option>
                    ))}
                </select>
                <button style={styles.addButton} onClick={addType}>Add Type</button>
            </section>
            
            <section style={styles.existingTypesSection}>
                <h2>Existing Types</h2>
                {modules.map((module) => (
                    <div key={module._id} style={styles.moduleSection}>
                        <h3>{module.module_name}</h3>
                        <ul style={styles.typeList}>
                            {types
                                .filter(type => type.module_id._id === module._id)
                                .map(filteredType => (
                                    <li key={filteredType._id} style={styles.typeItem}>
                                        {editType === filteredType._id ? (
                                            <input
                                                type="text"
                                                value={editTypeValue}
                                                onChange={(e) => setEditTypeValue(e.target.value)}
                                                style={styles.editInput}
                                            />
                                        ) : (
                                            <span>{filteredType.type_name}</span>
                                        )}

                                        <div style={styles.buttonContainer}>
                                            {editType === filteredType._id ? (
                                                <button style={styles.saveButton} onClick={() => updateType(filteredType._id)}>Save</button>
                                            ) : (
                                                <button style={styles.editButton} onClick={() => {
                                                    setEditType(filteredType._id);
                                                    setEditTypeValue(filteredType.type_name);
                                                }}>Edit</button>
                                            )}

                                            <button style={styles.deleteButton} onClick={() => deleteType(filteredType._id)}>Delete</button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </section>
        </div>
    );
};

// Internal styles
const styles = {
    pageContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
    },
    title: {
        marginBottom: '20px',
        fontSize: '3rem',
        color: '#023859', // Pink
    },
    addTypeSection: {
        width: '80%',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: 'rgba(2, 56, 89, 0.8)', // Slightly transparent background
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    existingTypesSection: {
        width: '80%',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: 'rgba(2, 56, 89, 0.8)', // Slightly transparent background
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        color: '#F2D8E1', // Text color
    },
    typeInput: {
        padding: '10px',
        margin: '10px 5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: 'calc(45% - 20px)',
    },
    moduleSelect: {
        padding: '10px',
        margin: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    addButton: {
        padding: '10px 15px',
        fontSize: '1rem',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff', // Blue for add button
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    moduleSection: {
        margin: '20px 0',
    },
    typeList: {
        listStyleType: 'none',
        padding: 0,
    },
    typeItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd',
        color: '#F2D8E1', // Text color
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px', // Space between buttons
    },
    editInput: {
        padding: '5px',
        marginRight: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    editButton: {
        padding: '8px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff', // Blue for edit button
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    saveButton: {
        padding: '8px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#28a745', // Green for save button
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    deleteButton: {
        padding: '8px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#dc3545', // Red for delete button
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    navButton: {
        padding: '10px 15px',
        fontSize: '1rem',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'orange',
        color: '#fff',
        transition: 'background-color 0.3s ease',
        marginTop: '20px',
    },
    navButtonHover: {
        backgroundColor: '#c82333', // Darker red on hover
    },
};

export default TypeManagement;
