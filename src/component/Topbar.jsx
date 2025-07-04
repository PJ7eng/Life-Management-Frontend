import { useState, useEffect } from 'react';
import api from '../api';

import '../component_styles/Topbar.css';

import avatar01 from '../assets/avatar01.png';
import remindIconClicked from '../assets/remindIconClicked.svg';
import remindIconUnclicked from '../assets/remindIconUnclicked.svg';
import logoutIcon from '../assets/logoutIcon.svg';

function Topbar({onLogout}) {
  const [isRemindActive, setIsRemindActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUserData(response.data);
      } catch (err) {
        console.error('获取用户信息失败:', err);
        setError('无法加载用户信息');
        if (err.response && err.response.status === 401) {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [onLogout]);

  const handleAvatarError = (e) => {
    e.target.src = avatar01;
  };

  if (loading) {
    return (
      <div className='topbar'>
        <div className='user-profile'>
          <div className="avatar-placeholder" />
          <span className='username'>加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='topbar'>
        <div className='user-profile'>
          <div className="avatar-placeholder error" />
          <span className='username error'>{error}</span>
        </div>
        <div className='topbar-right'>
          <button 
            className='icon-button'
            onClick={() => setIsRemindActive(!isRemindActive)}
          >
            <img 
              src={isRemindActive ? remindIconClicked : remindIconUnclicked} 
              alt="Notifications"
              width="24"
              height="24"
            />
          </button>
          <button 
            className='icon-button'
            onClick={onLogout}
          >
            <img 
              src={logoutIcon} 
              alt="logout"
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='topbar'>
      <div className='user-profile'>
        <img 
          src={userData.avatar || avatar01} 
          alt="User Avatar" 
          className='avatar'
          onError={handleAvatarError}
        />
        <span className='username'>{userData.username || '未知用户'}</span>
      </div>
      
      <div className='topbar-right'>
        <button 
          className='icon-button'
          onClick={() => setIsRemindActive(!isRemindActive)}
        >
          <img 
            src={isRemindActive ? remindIconClicked : remindIconUnclicked} 
            alt="Notifications"
            width="24"
            height="24"
          />
        </button>
        
        <button 
          className='icon-button'
          onClick={onLogout}
        >
          <img 
            src={logoutIcon} 
            alt="logout"
            width="24"
            height="24"
          />
        </button>
      </div>
    </div>
  )
}

export default Topbar;