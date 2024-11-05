import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div>
            <style>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                    box-sizing: border-box;
                }
                .welcome-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start; /* Align text to the left */
                    justify-content: center;
                    height: 100vh;
                    background-image: url('/asset/sealeftside.jpg'); /* Replace with the correct file name */
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-color: #e0f7fa; /* Add a complementary background color */
                    padding-left: 40px; /* Add space from the left edge */
                }

                .welcome-title {
                    font-size: 3rem;
                    color: #2e4a62; /* Change to dark blue */
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.7); /* Bright shadow */
                    font-weight: bold; /* Increase weight */
                }

                .welcome-description {
                    font-size: 2.5em;
                    color: #3e5871; /* Change to dark gray-blue */
                    text-align: left; /* Align text to the left */
                    margin-bottom: 30px;
                    max-width: 600px;
                    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.7); /* White shadow */
                    font-weight: bold; /* Increase weight */
                    padding: 10px;
                    border-radius: 10px;
                }

                .welcome-button {
                    padding: 12px 24px;
                    font-size: 1.5rem;
                    color: #fff;
                    background-color: #50A0BF;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .welcome-button:hover {
                    background-color: #023859;
                }

                p {
                    text-align: left; /* Align text to the left */
                    font-size: 1.5em;
                    color: #ffffff;
                    font-weight: bold;
                }
            `}</style>
            <div className="welcome-container">
                <h1 className="welcome-title">Welcome to LomaType</h1>
                <p className="welcome-description">
                    A touch typing website for programming languages that helps you practice and improve your coding speed.
                </p>
                <button 
                    className="welcome-button" 
                    onClick={goToLogin} 
                    aria-label="Start typing practice" // Accessibility enhancement
                >
                    Start Typing Practice
                </button>
            </div>
        </div>
    );
};

export default Welcome;
