import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lomatypeserver.onrender.com/auth/register', formData);
      console.log('response:', response);
      if (response.status === 200) {
        navigate('/login'); // หลังจากลงทะเบียนเสร็จ กลับไปที่หน้า login
      }
    } catch (err) {
      setError('Registration failed. Please check your information and try again.');
    }
  };

  const switchToLogin = () => {
    navigate('/login'); // กลับไปหน้า Login เมื่อกดปุ่ม
  };

  return (
    <div className="pageContainer">
      <div className="loginContainer">
        <header className="header">
          <div className="logo">LomaType</div>
        </header>
        <div className="loginContent">
          <h1 className="loginTitle">Register</h1>
          <form onSubmit={handleSubmit} className="loginForm">
            <label htmlFor="username" className="formLabel">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="formInput"
            />

            <label htmlFor="email" className="formLabel">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="formInput"
            />

            <label htmlFor="password" className="formLabel">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="formInput"
            />

            {error && <p className="errorMessage">{error}</p>}

            <button type="submit" className="btn btnPrimary">Register</button>
          </form>
          <p className="registerText">
            Already have an account? <button onClick={switchToLogin} className="btn btnLink">Login here</button>
          </p>
        </div>
      </div>
      <style>
        {`
          /* รีเซ็ต margin และ padding ของ body และ html */
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
          }

          /* Page container */
          .pageContainer {
            width: 100%;
            display: flex; 
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('/asset/sea.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-color: #f0f0f0; /* เพิ่ม background color สำรองในกรณีที่ภาพโหลดไม่ขึ้น */
          }

          /* Login container */
          .loginContainer {
            width: 50%;
            height: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            border: 1px solid #BF7AA0; /* Medium pink border */
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Slightly larger shadow for a modern look */
            background-color: rgba(2, 56, 89, 0.9); /* ทำให้สีพื้นหลังโปร่งแสงเล็กน้อย */
          }

          /* Header styling */
          .header {
            margin-bottom: 20px;
          }

          /* Logo styling */
          .logo {
            font-size: 4.4rem; /* Slightly larger for prominence */
            font-weight: bold;
            color: #F2D8E1; /* Pink */
          }

          /* Login content */
          .loginContent {
            margin-top: 20px;
          }

          /* Login title */
          .loginTitle {
            font-size: 1.8rem;
            color: #F2D8E1; /* Pink */
            margin-bottom: 20px;
          }

          /* Form styling */
          .loginForm {
            display: flex;
            flex-direction: column;
            gap: 15px; /* Larger gap for spacing */
          }

          .formLabel {
            text-align: left;
            font-weight: bold;
            color: #F2D8E1; /* Blue */
            font-size: 1.5rem;
          }

          .formInput {
            padding: 12px;
            border: 1px solid #347EBF; /* Slightly darker blue border */
            border-radius: 5px;
            font-size: 1.5rem;
            background-color: #fff; /* Light pink background */
            color: #333; /* Darker text for readability */
          }

          /* Error message */
          .errorMessage {
            color: #f44336; /* Red for error messages */
            margin: 10px 0;
            font-weight: bold;
          }

          /* Button styling */
          .btn {
            padding: 12px;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
          }

          /* Primary button */
          .btnPrimary {
            background-color: #368ABF; /* Light blue */
            color: #F2D8E1; /* Text color blue */
            border: none;
            margin-top: 10px;
            transition: background-color 0.3s ease; /* Smooth hover transition */
            font-size: 1.5rem;
          }

          .btnPrimary:hover {
            background-color: #347EBF; /* Darker blue on hover */
          }

          /* Link button */
          .btnLink {
            background: none;
            color: #BF7AA0; /* Pink */
            border: none;
            text-decoration: underline;
            cursor: pointer;
            font-size: 1.2rem;
          }

          .btnLink:hover {
            color: #F2D8E1; /* Blue on hover */
          }

          /* Register text */
          .registerText {
            margin-top: 20px;
            color: #F2D8E1; /* Pink */
            font-size: 1.2rem;
          }
        `}
      </style>
    </div>
  );
};

export default Register;
