import { useState, useEffect, useRef } from 'react';
import api from '../api';

import '../component_styles/MainContent.css';
import '../component_styles/Settings.css';

import avatar01 from '../assets/avatar01.png';
import goright from '../assets/goright.svg';


function Settings({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 新增加載狀態
  const [error, setError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const nameInputRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState('verify'); // 'verify' | 'change'
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUserData(response.data);
        setUserName(response.data?.username || '');
      } catch (err) {
        console.error('获取用户信息失败:', err);
        setError('无法加载用户信息');
      } finally {
        setLoading(false); // 無論成功或失敗，設置加載完成
      }
    };

    fetchUserData();
  }, []); // 空依賴數組，確保只在組件掛載時運行

  const handleClick = () => {
    setIsEditingName(true);
  }

  // 自动聚焦输入框
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const saveNameChange = async () => {
    if (userName.trim() !==''){
      setLoading(true); // 开始更新时设置loading状态
      try{
        const response = await api.put('/auth/update_username', {
          new_username: userName
        });
        // 用户名更改成功后，强制登出
        localStorage.removeItem('access_token');
        if (typeof onLogout === 'function') {
          onLogout();
        } else {
          window.location.href = '/login';
        }
        return; // 不再做后续本地状态更新
      } catch(err) {
        console.error("更新用戶名失敗：", err);
         if (err.response) {
        if (err.response.status === 400) {
          setError("用户名已被使用");
        } else if (err.response.status === 404) {
          setError("用户不存在");
        } else {
          setError("更新用户名失败，请重试");
        }
      } else {
        setError("网络错误，请检查连接");
      }
      // 恢复原用户名
      setUserName(userData?.username || '');
      } finally {
        setLoading(false); // 无论成功失败都要清除loading状态
      }
    }
    setIsEditingName(false);
    setShowNameConfirm(false);
  };

  // 按 Enter 或失去焦点时保存
  const handleEnter = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    saveNameChange();
  };

  const handleBlur = (e) => {
    setIsEditingName(false);
    return;
  }

  //打開確認面板
  const handleNameChangeButton = (e) =>{
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    setShowNameConfirm(true);
  }

  const handleAvatarError = (e) => {
      e.target.src = avatar01;
    };

  // 加載中顯示佔位內容
  if (loading) {
    return (
      <div className="main-page">
        <div className="setting-container">
          <h1>個人資訊</h1>
          <div className="setting-box">
            <div className="avatar-placeholder" /> {/* 佔位符 */}
            <span>加載中...</span>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤時顯示錯誤信息
  if (error) {
    return (
      <div className="main-page">
        <div className="setting-container">
          <h1>個人資訊</h1>
          <div className="setting-box">
            <div className="avatar-placeholder error" />
            <span className="error">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // 打开更改密码模态框
  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
  };

  // 关闭模态框
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setChangePasswordLoading(false);
  };

  // 更改密码
  const handleChangePassword = async () => {
    setPasswordError('');
    if (!passwordInput) {
      setPasswordError('請輸入當前密碼');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('新密碼不能少於6位');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('兩次輸入的新密碼不一致');
      return;
    }
    setChangePasswordLoading(true);
    try {
      // 先验证当前密码
      await api.post('/auth/verify_password', { password: passwordInput });
      // 再更改新密码
      await api.post('/auth/change_password', { new_password: newPassword });
      // 更改成功后自动登出
      localStorage.removeItem('access_token');
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setPasswordError('當前密碼輸入錯誤，請重新輸入');
      } else {
        setPasswordError('更改密碼失敗，請重試');
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // 正常渲染
  return (
    <div className="main-page">
      <div className="setting-container">
        <h1>個人資訊</h1>

        <button className="setting-box">
          <div className='setting-box-title'>頭像：</div>
          <div className='setting-input'>
            <img
              src={userData?.avatar || avatar01} // 使用可選鏈確保安全訪問
              alt="User Avatar"
              className="setting-avatar"
              onError={handleAvatarError}
            />
          </div>
          <img
              src={goright}
              className="setting-go"
              alt="go"
          />
        </button>

        <button className='setting-box' onClick={handleClick}>
          <div className='setting-box-title'>用戶名：</div>
          <div className='setting-input'>
            {isEditingName ? (
              <input 
                type="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                ref={nameInputRef}
                onKeyDown={handleNameChangeButton}
                // onBlur={handleBlur}
              />
            ) : (
              <div>{userData?.username || '未知用户'}</div>
            )}
          </div>
          {isEditingName ? (
            <div className='confirm-cancel-part'>
              <div className='setting-box-name-botton' onClick={(e)=>{e.stopPropagation();handleNameChangeButton(e);}}>
                確認
              </div>
              <div className='cancel-button' onClick={(e)=>{e.stopPropagation();setIsEditingName(false);}}>
                取消
              </div>
            </div>
          ) : (
            <img
              src={goright}
              className="setting-go"
              alt="go"
            />
          )}
        </button>

        <button className='setting-change-password-button' onClick={handleOpenPasswordModal}>更改密碼</button>

      </div>

      {showNameConfirm && (
        <div className='name-confirm-modal'>
          <div className='editor-content'>
            <h1>確定更改用戶名？更改用戶名後，你需要重新登陸。</h1>
            <div className='confirm-cancel-part'>
              <button className='confirm-button' onClick={handleEnter}>確定</button>
              <button className='cancel-button' onClick={() => {setShowNameConfirm(false);setIsEditingName(false);}}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h2>更改密碼</h2>
            <div className="password-warning">更改密碼後，需重新登陸。</div>
            <div className="password-input-group">
              <label>當前密碼</label>
              <input
                type="password"
                placeholder="請輸入當前密碼"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                disabled={changePasswordLoading}
              />
            </div>
            <div className="password-input-group">
              <label>新密碼</label>
              <input
                type="password"
                placeholder="新密碼"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={changePasswordLoading}
              />
            </div>
            <div className="password-input-group">
              <label>確認新密碼</label>
              <input
                type="password"
                placeholder="再次輸入新密碼"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                disabled={changePasswordLoading}
              />
            </div>
            {passwordError && <div className="password-error">{passwordError}</div>}
            <div className="modal-buttons">
              <button className='confirm-button' onClick={handleChangePassword} disabled={changePasswordLoading || !passwordInput || !newPassword || !confirmNewPassword}>確認</button>
              <button className='cancel-button' onClick={handleClosePasswordModal} disabled={changePasswordLoading}>取消</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;