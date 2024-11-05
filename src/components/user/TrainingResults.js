import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Header from '../header';

const TrainingResults = () => {
  const [typingStats, setTypingStats] = useState([]);

  // ฟังก์ชันดึงข้อมูลสถิติการพิมพ์จากเซิร์ฟเวอร์
  const fetchTypingStats = async () => {
    try {
      const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage
      const response = await axios.get("http://localhost:3005/user/fetch/typingstats", {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token เพื่อยืนยันตัวตน
        },
      });
      setTypingStats(response.data); // เก็บข้อมูลใน state
      console.log(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติการพิมพ์:", error);
    }
  };

  useEffect(() => {
    fetchTypingStats(); // เรียกใช้ฟังก์ชันเมื่อ component mount
  }, []);

  const latestStats = typingStats.slice(-10); // เรียงข้อมูลย้อนกลับเพื่อให้ recent อยู่ที่ปลายสุด

  return (
    <div className="training-results-container">
      <Header />
      <div className="body">
        <h1>Training Results (Graph)</h1>

        {/* กราฟแสดงผล */}
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={latestStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="language_id.language_name" /> {/* ใช้ dataKey ที่ตรงกับข้อมูล */}
            <YAxis domain={[0, 100]} /> {/* ตั้งแกน Y ให้สูงสุดถึง 100 */}
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="typing_speed" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="typing_accuracy" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <h1>Training Results</h1>
        <table className="results-table">
          <thead>
            <tr>
              <th>Language</th>
              <th>Module</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>WPM</th>
              <th>Accuracy (%)</th>
              <th>Time Spent (s)</th>
              <th>Type On</th>
              {/* <th>Typing Errors</th> */}
            </tr>
          </thead>
          <tbody>
            {typingStats.slice().reverse().map((stat) => (
              <tr key={stat._id}>
                <td>{stat.language_id.language_name}</td>
                <td>{stat.module_id?.module_name}</td>
                <td>{stat.type_id.type_name}</td>
                <td>{stat.difficult_id.difficult_level}</td>
                <td>{stat.typing_speed ? Number(stat.typing_speed).toFixed(2) : '-'}</td>
                <td>{stat.typing_accuracy}</td>
                <td>{stat.typing_time}</td>
                <td>{new Date(stat.created_at).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
                {/* <td>{stat.typing_errors || 0}</td> จำนวนข้อผิดพลาด */}
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

          .training-results-container {
            background-color: #D8EBF2; /* Full-screen background color */
            min-height: 100vh; /* Ensure full-screen height */
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .body {
            padding: 0;
            margin-top: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          h1 {
            color: #023859;
            text-align: center;
          }

          .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .results-table th, .results-table td {
            padding: 10px;
            border: 1px solid #BF7AA0;
            text-align: left;
          }

          .results-table th {
            background-color: #023859;
            color: #fff;
          }

          .results-table td {
            background-color: rgba(255, 255, 255, 0.9);
            color: #023859;
          }
        `}
      </style>
    </div>
  );
};

export default TrainingResults;
