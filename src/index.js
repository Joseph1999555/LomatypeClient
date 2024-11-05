import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Welcome from './components/user/Receive';
import LanguageSelection from './components/user/LanguageSelection';
import ModuleSelection from './components/user/ModuleSelection';
import TypeSelection from './components/user/TypeSelection';
import DifficultySelection from './components/user/DifficultySelection';
import TypingPractice from './components/user/TypingPractise';
import TrainingResults from './components/user/TrainingResults';
import Leaderboard from './components/user/Leaderboard';
import Intro from './components/user/intro';
import MatchMaking from './components/user/MatchMaking';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

import AdminDashbord from './components/admin/AdminDashbord';
import CodeSnippetManagement from './components/admin/CodeSnippetManagement';
import UserManagement from './components/admin/UserManagement';
import ModuleManagement from './components/admin/ModuleManagement';
import TypeManagement from './components/admin/TypeManagement';
import DifficultyManagement from './components/admin/DifficultyManagement';
import LanguageManagement from './components/admin/LanguageManagement';
import TypingStatManagement from './components/admin/TypingStatManagement';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // ตรวจสอบว่ามี token หรือไม่
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/receive" />} />
        <Route path="receive" element={<Welcome />} />
        <Route path="login" element={<Login switchToRegister={switchToRegister} />} />
        <Route path="register" element={<Register switchToLogin={switchToLogin} />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="intro" element={<Intro />} />
        <Route path="LanguageSelection" element={<LanguageSelection setSelectedLanguage={setSelectedLanguage} />} />
        <Route path="ModuleSelection" element={<ModuleSelection selectedLanguage={selectedLanguage} setSelectedModule={setSelectedModule} />} />
        <Route path="TypeSelection" element={<TypeSelection selectedModule={selectedModule} setSelectedType={setSelectedType} />} />
        <Route path="DifficultySelection" element={<DifficultySelection setSelectedDifficulty={setSelectedDifficulty} />} />
        <Route path="TypingPractice" element={
          <TypingPractice
            selectedLanguage={selectedLanguage}
            selectedModule={selectedModule}
            selectedType={selectedType}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            setSelectedLanguage={setSelectedLanguage}
            setSelectedType={setSelectedType}
          />
        } />
        <Route path="TrainingResults" element={<TrainingResults />} />
        <Route path="Leaderboard" element={<Leaderboard />} />
        <Route path="MatchMaking" element={<MatchMaking />} />

        {/* ใช้ PrivateRoute ห่อ Admin Routes */}
        <Route path="admin" element={<PrivateRoute element={<AdminDashbord />} />} />
        <Route path="admin/codeSnippetManagement" element={<PrivateRoute element={<CodeSnippetManagement />} />} />
        <Route path="admin/userManagement" element={<PrivateRoute element={<UserManagement />} />} />
        <Route path="admin/moduleManagement" element={<PrivateRoute element={<ModuleManagement />} />} />
        <Route path="admin/typeManagement" element={<PrivateRoute element={<TypeManagement />} />} />
        <Route path="admin/difficultyManagement" element={<PrivateRoute element={<DifficultyManagement />} />} />
        <Route path="admin/languageManagement" element={<PrivateRoute element={<LanguageManagement />} />} />
        <Route path="admin/typingStatManagement" element={<PrivateRoute element={<TypingStatManagement />} />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
