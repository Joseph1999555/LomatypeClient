import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types'; 

const ModuleSelection = ({ selectedLanguage, setSelectedModule }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchModules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3005/user/fetch/modules', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
            setError('Could not load modules. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const navigate = useNavigate();

    const handleModuleSelect = (module) => {
        setSelectedModule(module);
        navigate('/TypeSelection');
    };

    return (
        <div className="SelectionContainer">
            <style>{`

                .SelectionContainer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    color: #e469cf; 
                    padding: 0 20px; 
                    text-align: center;
                }

                h1 {
                    font-size: 3rem;
                    color: #2e4a62; 
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.7);
                    font-weight: bold;
                }

                p {
                    font-size: 1.5rem;
                    color: #3e5871; 
                    margin-bottom: 30px;
                    max-width: 600px;
                    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.7);
                    font-weight: bold;
                }

                .selection-list {
                    list-style: none;
                    padding: 0;
                }

                .selection-button {
                    padding: 12px 24px;
                    font-size: 1.5rem;
                    color: #fff;
                    background-color: #50A0BF; 
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    margin: 10px 0;
                }

                .selection-button:hover {
                    background-color: #023859; 
                }

                .error-message {
                    color: red;
                    font-weight: bold;
                    margin-top: 20px;
                }
            `}</style>
            <h1>Select a Module</h1>
            <p>Select the desired module for this language.</p>
            {loading ? (
                <p>Loading modules...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <ul className="selection-list">
                    {modules.map((module, index) => (
                        <li key={index}>
                            <button className="selection-button" onClick={() => handleModuleSelect(module.module_name)}>
                                {module.module_name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// PropTypes สำหรับ props
ModuleSelection.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    setSelectedModule: PropTypes.func.isRequired,
};

export default ModuleSelection;
