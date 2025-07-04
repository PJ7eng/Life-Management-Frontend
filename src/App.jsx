import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'; // 引入 axios
import './App.css';
import Dashboard from './component/dashboard';
import Login from './login_signup_component/Login';
import Register from './login_signup_component/register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await axios.post('http://localhost:8000/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('登出失敗:', error);
      }
    }
    localStorage.removeItem('access_token');
    setIsLoggedIn(false); // 更新狀態
  };

  return (
    <div className='appBackground'>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard/*"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;