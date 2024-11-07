import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Assuming you store the token in localStorage
        navigate('/login'); // Redirect to login page
    };
    // onClick={handleTypingPractice}
    // href="#contact"

    const handleNavigateResults = () => {
        navigate('/TrainingResults');
    }

    const handleNavigateTypingPractice = () => {
        navigate('/TypingPractice');
    }

    const handleNavigateLeaderboard = () => {
        navigate('/Leaderboard');
    }

    const handleNavigateMatchMaking = () => {
        navigate('/MatchMaking');
    }


    return (
        <header style={headerStyle}>
            <div className="logo">
                <h1>LomaType</h1>
            </div>
            <nav className="nav">
                <ul>
                    <li><a onClick={handleNavigateMatchMaking}>Match Making(Alpha Testing)</a></li>
                    <li><a onClick={handleNavigateTypingPractice}>Typing Practice</a></li>
                    <li><a onClick={handleNavigateResults}>Summary</a></li>
                    <li><a onClick={handleNavigateLeaderboard}>Leader Board</a></li>
                    <li><a onClick={handleLogout}>Sign Out</a></li>
                </ul>
            </nav>
            <style>
                {`
          header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: 10px 0;
            background-color: #023859 !important;
            color: #fff;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .logo h1 {
            margin: 0;
            padding-left: 20px;
            color: #F2D8E1;
            cursor: pointer;
          }

          .nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
          }

          .nav ul li {
            margin: 0 15px;
          }

          .nav ul li a {
            color: #D8EBF2;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s ease;
            cursor: pointer;
          }

          .nav ul li a:hover {
            color: #BF7AA0;
          }
        `}
            </style>
        </header>
    );
};

const headerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
};

export default Header;
