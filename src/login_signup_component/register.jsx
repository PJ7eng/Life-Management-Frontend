import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../login_signup_component_styles/LoginRegister.css';

import userIcon from '../assets/userIcon.svg';
import passwordIcon from '../assets/passwordIcon.svg';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
  if (password !== confirmPassword) {
    setError('密碼不匹配');
    return;
  }
  
  try {
    const response = await axios.post('http://localhost:8000/api/auth/register', {
      username,
      password
    });
    
    if (response.data) {
      navigate('/login');
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      setError('註冊失敗，賬號可能已存在');
    } else {
      setError('註冊失敗，請稍後再試');
      console.error(err);
    }
  }
};

  // return(
  //   <div className= "register-page">
  //     <h1>LifeCursor</h1>
  //     <div className = "register-board">
  //       <h2>註冊您的新賬號</h2>
  //       <div className = 'inputs'>
  //         <img src={userIcon} alt="user Icon"/>
  //         <input type="Account" placeholder='請輸入賬號' onChange={(e) => setUsername(e.target.value)}/>
  //       </div>
  //       <div className = 'inputs'>
  //         <img src={passwordIcon} alt="password Icon"/>
  //         <input type="password" placeholder='請輸入密碼' onChange={(e) => setPassword(e.target.value)}/>
  //       </div>
  //       <div className = 'inputs'>
  //         <img src={passwordIcon} alt="password Icon"/>
  //         <input type="password" placeholder='請再輸入密碼' onChange={(e) => setConfirmPassword(e.target.value)}/>
  //       </div>
  //       <div className="submit-container">
  //         <div className="submit" onClick={handleRegister}>註冊</div>
  //         <div className='submit' onClick={() => navigate('/login')}>取消</div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="register-page">
    <h1>LifeCursor</h1>
    <div className="register-board">
      <h2>註冊您的新賬號</h2>
      {error && <div className="error-message">{error}</div>} {/* 顯示錯誤訊息 */}
      <div className="inputs">
        <img src={userIcon} alt="user Icon" />
        <input
          type="text" // 改為 type="text"，因為賬號通常不是 "Account"
          placeholder="請輸入賬號"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="inputs">
        <img src={passwordIcon} alt="password Icon" />
        <input
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="inputs">
        <img src={passwordIcon} alt="password Icon" />
        <input
          type="password"
          placeholder="請再輸入密碼"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleRegister}>
          註冊
        </div>
        <div className="submit" onClick={() => navigate('/login')}>
          取消
        </div>
      </div>
    </div>
  </div>
);
}

export default Register;