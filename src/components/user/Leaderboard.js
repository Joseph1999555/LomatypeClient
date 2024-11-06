import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('https://lomatypeserver.onrender.com/user/fetch/leaderboard');
            setLeaderboard(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-body">
            <Header />
            <div className="leaderboard-content">
                <h1>Leaderboard (Best Typing Speed)</h1>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Typing Speed</th>
                            <th>Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.user_id?.username}</td>
                                <td>{user.typing_speed ? Number(user.typing_speed).toFixed(2) : '-'}</td>
                                <td>{user.typing_accuracy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }

                    .leaderboard-body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: flex-start;
                        flex-direction: column;
                        min-height: 100vh; /* Ensure it covers the full height */
                    }

                    .leaderboard-content {
                        padding: 20px;
                        margin-top: 120px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    h1 {
                        color: #023859;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Shadow for better text readability */
                    }

                    .results-table {
                        width: 80%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background for table */
                        border-radius: 10px;
                        overflow: hidden;
                    }

                    .results-table th, .results-table td {
                        padding: 10px;
                        border: 1px solid #BF7AA0; /* Pinkish border */
                        text-align: left;
                        color: #023859; /* Dark blue text */
                    }

                    .results-table th {
                        background-color: #023859;
                        color: #fff; /* White text on dark background */
                    }

                    .results-table td {
                        background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent cells */
                    }
                `}
            </style>
        </div>
    );
}

export default Leaderboard;
