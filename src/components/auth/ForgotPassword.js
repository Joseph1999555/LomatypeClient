import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lomatypeserver.onrender.com/auth/forgot-password', { email });
      if (response.status === 200) {
        setMessage('Please check your email for the verification code.');
        setShowCodeInput(true);
      }
    } catch (err) {
      setError('Error sending verification code. Please try again.');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lomatypeserver.onrender.com/auth/verify-reset-code', { email, code });
      if (response.status === 200) {
        setMessage('Verification successful! Redirecting to reset password page...');
        setTimeout(() => navigate(`/reset-password/${response.data.token}`), 3000);
      }
    } catch (err) {
      setError('Invalid or expired verification code. Please try again.');
    }
  };

  return (
    <div className="pageContainer">
      <div className="forgotPasswordContainer">
        <h1 className="title">Forgot Password</h1>
        {!showCodeInput ? (
          <form onSubmit={handleEmailSubmit} className="form">
            <label htmlFor="email" className="formLabel">Enter your registered email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="formInput"
            />
            <button type="submit" className="btn btnPrimary">Send Verification Code</button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="form">
            <label htmlFor="code" className="formLabel">Enter the verification code sent to your email:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="formInput"
            />
            <button type="submit" className="btn btnPrimary">Verify Code</button>
          </form>
        )}
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

          /* Forgot password container */
          .forgotPasswordContainer {
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

export default ForgotPassword;
