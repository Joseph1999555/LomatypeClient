import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const TypeSelection = ({ selectedModule, setSelectedType }) => {
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    console.log('selectedModule:', selectedModule);

    const fetchTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3005/user/fetch/types', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTypes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching types:', error);
            setError('Failed to load types. Please try again.');
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const navigate = useNavigate();

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        navigate('/DifficultySelection');
    };

    // Filter types by selectedModule
    const filteredTypes = types.filter(type => type.module_id.module_name === selectedModule);

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

            <h1>Select a Type</h1>
            <p>Choose atype you want to practice for this module.</p>
            {error && <p className="error-message">{error}</p>}
            <ul className="selection-list">
                {filteredTypes.length > 0 ? (
                    filteredTypes.map((type, index) => (
                        <li key={index}>
                            <button className="selection-button" onClick={() => handleTypeSelect(type)}>
                                {type.type_name}
                            </button>
                        </li>
                    ))
                ) : (
                    <p>Loading types or no types available...</p>
                )}
            </ul>
        </div>
    );
};

// PropTypes สำหรับ props
TypeSelection.propTypes = {
    selectedModule: PropTypes.string.isRequired,
    setSelectedType: PropTypes.func.isRequired,
};

export default TypeSelection;
