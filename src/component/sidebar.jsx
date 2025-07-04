import { NavLink } from 'react-router-dom';
import '../component_styles/Sidebar.css';

function Sidebar() {
  const menuItems = [
    { text: '首頁', path: '/dashboard', end: true }, // 添加 end: true
    { text: '待辦事項', path: '/dashboard/tasks' },
    { text: '備忘錄', path: '/dashboard/memo' },
    { text: '設定', path: '/dashboard/settings' },
  ];

  return (
    <div className='sidebar'>
      <div className='sidebar-title'>
        <h1>LifeCursor</h1>
      </div>
      <div className='sidebar-menu'>
        {menuItems.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index} 
            className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
            end={item.end} // 動態應用 end 屬性
          >
            <span>{item.text}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;