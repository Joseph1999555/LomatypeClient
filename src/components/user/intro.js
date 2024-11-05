import React from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardSimulator from '../Keyboard';

const Intro = () => {
    const navigate = useNavigate();

    const navigateToLanguageSelection = () => {
        navigate('/LanguageSelection');
    };

    return (
        <div className="introContainer">
            <style>{`
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4; /* Light background color */
                }

                .introContainer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    text-align: center;
                    padding: 0;
                    position: relative; /* For positioning the button */
                }

                h1 {
                    font-size: 3rem;
                    color: #2e4a62; /* Dark blue color */
                    margin-bottom: 20px;
                }

                .description {
                    font-size: 1.5rem;
                    color: #3e5871; /* Dark gray-blue color */
                    margin-bottom: 30px;
                    max-width: 600px;
                    padding: 10px;
                    border-radius: 10px;
                    background-color: #e0f7fa; /* Light blue background */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
                }

                .btn {
                    padding: 12px 24px;
                    font-size: 1.5rem;
                    color: #fff;
                    background-color: #50A0BF; /* Button color */
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    position: absolute; /* Positioning the button */
                    top: 20px; /* Distance from the top */
                    right: 20px; /* Distance from the right */
                }

                .btn:hover {
                    background-color: #023859; /* Darker blue on hover */
                }
            `}</style>
            <h1>What Is Typing Practice?</h1>
            <div className="description">
                <p>
                    Touch typing is a method of typing without having to look at the keyboard. 
                    It allows you to increase your typing speed and accuracy, making it easier to focus on your code rather than the keys. 
                    By using all your fingers and developing muscle memory, you can significantly improve your programming efficiency.
                </p>
                <p>
                    Practice regularly and soon you'll be typing like a pro!
                </p>
            </div>
            <KeyboardSimulator />
            <button onClick={navigateToLanguageSelection} className="btn btnPrimary">Skip</button>
        </div>
    );
};

export default Intro;
