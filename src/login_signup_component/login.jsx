import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import '../login_signup_component_styles/LoginRegister.css';

import userIcon from '../assets/userIcon.svg';
import passwordIcon from '../assets/passwordIcon.svg';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    // 修改为实际的API调用
    const response = await axios.post('http://localhost:8000/api/auth/login', 
      `username=${username}&password=${password}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // 保存token到localStorage
    localStorage.setItem('access_token', response.data.access_token);
    setIsLoggedIn(true);
    navigate('/dashboard');
  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError('登錄失敗，請檢查賬號或密碼');
    } else {
      setError('登錄失敗，請稍後再試');
      console.error(err);
    }
  }
};

  return(
    <div className = 'login-page'>
      <h1>LifeCursor</h1>
      <div className= 'login-board'>
        <div className = 'inputs'>
          <img src={userIcon} alt="user Icon"/>
          <input type="Account" placeholder='請輸入賬號' onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className = 'inputs'>
          <img src={passwordIcon} alt="password Icon"/>
          <input type="password" placeholder='請輸入密碼' onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>登錄</div>
          <div className='submit' onClick={() => navigate('/register')}>註冊</div>
        </div>
      </div>
    </div>
  );
}

export default Login;