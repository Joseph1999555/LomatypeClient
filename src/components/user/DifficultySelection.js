import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from './user.style.css';

const DifficultySelection = ({ selectedLanguage, selectedType, setSelectedDifficulty }) => {
    const [difficulties, setDifficulties] = useState([]);
    const [error, setError] = useState(null);

    const fetchDifficulties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lomatypeserver.onrender.com/user/fetch/difficulties', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDifficulties(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching difficulties:', error);
            setError('Failed to load difficulties. Please try again.'); // แสดงข้อความข้อผิดพลาด
        }
    };

    useEffect(() => {
        fetchDifficulties();
        console.log('selectedLanguage:', selectedLanguage);
        console.log('selectedType:', selectedType);
    }, [selectedLanguage, selectedType]); // เพิ่ม dependency เพื่อให้ fetchDifficulties ทำงานอีกครั้งเมื่อ selectedLanguage หรือ selectedType เปลี่ยน

    const navigate = useNavigate();

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        navigate('/TypingPractice'); // Redirect to typing practice page
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

            <h1>Select a Difficulty</h1>
            <p>Finally, choose the difficulty level you want.
            </p>
            {error && <p className="error-message">{error}</p>}
            <ul className="selection-list">
                {difficulties.length > 0 ? (
                    difficulties.map((difficulty, index) => (
                        <li key={index}>
                            <button className="selection-button" onClick={() => handleDifficultySelect(difficulty)}>
                                {difficulty.difficult_level}
                            </button>
                        </li>
                    ))
                ) : (
                    <p>Loading difficulties...</p>
                )}
            </ul>
        </div>
    );
};

// PropTypes สำหรับ props
DifficultySelection.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    selectedType: PropTypes.string.isRequired,
    setSelectedDifficulty: PropTypes.func.isRequired,
};

export default DifficultySelection;
