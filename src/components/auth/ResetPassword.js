import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const { token } = useParams(); // รับ token จาก URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3005/auth/reset-password/${token}`, { password });
      if (response.status === 200) {
        setMessage('Password reset successful! Please log in.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="pageContainer">
      <div className="resetPasswordContainer">
        <h1 className="title">Reset Password</h1>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="password" className="formLabel">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="formInput"
          />
          <label htmlFor="confirmPassword" className="formLabel">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="formInput"
          />
          <button type="submit" className="btn btnPrimary">Reset Password</button>
        </form>
        {message && <p className="successMessage">{message}</p>}
        {error && <p className="errorMessage">{error}</p>}
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
            background-color: #f0f0f0;
          }

          /* Reset password container */
          .resetPasswordContainer {
            width: 50%;
            padding: 20px;
            text-align: center;
            border: 1px solid #BF7AA0;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            background-color: rgba(2, 56, 89, 0.9);
          }

          /* Title styling */
          .title {
            font-size: 1.8rem;
            color: #F2D8E1;
            margin-bottom: 20px;
          }

          /* Form styling */
          .form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .formLabel {
            text-align: left;
            font-weight: bold;
            color: #F2D8E1;
            font-size: 1.5rem;
          }

          .formInput {
            padding: 12px;
            border: 1px solid #347EBF;
            border-radius: 5px;
            font-size: 1.5rem;
            background-color: #fff;
            color: #333;
          }

          /* Success and error messages */
          .successMessage {
            color: #4CAF50;
            margin: 10px 0;
            font-weight: bold;
          }

          .errorMessage {
            color: #f44336;
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
            background-color: #368ABF;
            color: #F2D8E1;
            border: none;
            margin-top: 10px;
            transition: background-color 0.3s ease;
            font-size: 1.5rem;
          }

          .btnPrimary:hover {
            background-color: #347EBF;
          }
        `}
      </style>
    </div>
  );
};

export default ResetPassword;
