import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ดึง token จาก URL หลังจากที่ Google Login สำเร็จ
    const queryParams = new URLSearchParams(window.location.search); 
    const token = queryParams.get('token');

    if (token) {
      // เก็บ token ลงใน localStorage
      localStorage.setItem('token', token); 

      // ลบ query parameter หลังเก็บ token เพื่อไม่ให้แสดงใน URL
      navigate('/login', { replace: true });

      // Decode token และ redirect ไปยังหน้า intro
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/intro');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lomatypeserver.onrender.com/auth/login', formData);
      if (response.status === 200) {
        const { token } = response.data;

        // Save token to localStorage
        localStorage.setItem('token', token);

        // Decode token to get user info and role
        const decodedToken = jwtDecode(token);
        console.log('User Role:', decodedToken.role);

        // Redirect user based on role
        if (decodedToken.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/intro');
        }
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const loginWithGoogle = () => {
    // Redirect ไปยังหน้า Google Auth โดยตรง
    window.location.href = 'https://lomatypeserver.onrender.com/auth/google';
  };
  const switchToRegister = () => {
    navigate('/register');
  };

  const switchToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="pageContainer">
      <div className="loginContainer">
        <header className="header">
          <div className="logo">LomaType</div>
        </header>
        <div className="loginContent">
          <h1 className="loginTitle">Sign In</h1>
          <form onSubmit={handleSubmit} className="loginForm">
            <label htmlFor="username" className="formLabel">Username:</label>
            <input
              type="username"
              name="username"
              id="username"
              value={formData.username}
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

            <button type="submit" className="btn btnPrimary">Login</button>
          </form>
          <div className="footerOptions">
        <p className="registerText">
          Don't have an account? <button onClick={switchToRegister} className="btn btnLink">Register here</button>
        </p>
        <p className="ForgotText">
          <button onClick={switchToForgotPassword} className="btn btnLink">Forgot password?</button>
        </p>
      </div>
          <button onClick={loginWithGoogle} className="btn btnGoogle">
          <img src="/asset/google.png" alt="Google Icon" className="googleIcon" />
            Sign in with Google
          </button>


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

          .ForgotText {
            margin-top: 20px;
            
            color: #F2D8E1; /* Pink */
            font-size: 1.2rem;
          }

          .footerOptions {
            display: flex;
            justify-content: space-between; /* จัดข้อความไว้คนละฝั่ง */
            align-items: center;
            margin-top: 20px;
          }

          .btnGoogle {
            background-color: #368ABF;
            color: #F2D8E1;;
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 1.2rem;
            cursor: pointer;
            margin-top: 15px;
            display: center;
            align-items: center;
            justify-content: center;
          }

          .btnGoogle:hover {
            background-color: #347EBF;
          }

          .googleIcon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

        `}
      </style>
    </div>
  );
};

export default Login;
