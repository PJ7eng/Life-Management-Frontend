import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Topbar from './Topbar';
import Home from './Home';
import Tasks from './Tasks';
import Memo from './Memo';
import Settings from './Settings';
import '../component_styles/Dashboard.css';

function Dashboard({onLogout}) {
  return (
    <div className='dashboard'>
      <Sidebar />
      <Topbar onLogout={onLogout}/>
      <div className='Memo-edit'></div>
      <div className='main-content'>
        <Routes>
          <Route index element={<Home />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="memo" element={<Memo />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard;