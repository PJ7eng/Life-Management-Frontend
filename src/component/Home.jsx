import '../component_styles/MainContent.css';
import '../component_styles/Home.css';

import CalendarWidget from './CalendarWidget';
import IncomeExpenseRatioDashboard from './IncomeExpenseRatioDashboard';
import api from '../api';

import { useState, useEffect } from 'react';


function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 修改fetchTasksForDate函数
  const fetchTasksForDate = async (date) => {
    try {
      // const start = new Date(date);
      // start.setHours(0, 0, 0, 0);
      // const end = new Date(date);
      // end.setHours(23, 59, 59, 999);
      const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

      console.log(start.toISOString(),end.toISOString());
      const response = await api.get('/home/tasks', {
        params: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      });

      // 确保数据正确设置
      setTodoList(response.data);
    } catch (error) {
      console.error('获取待办事项失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksForDate(selectedDate);
  }, [selectedDate]);

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化时间显示
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };


  // 处理日期变更的回调函数
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchTasksForDate(newDate);
  };

  return (
    <div className="main-page">
      <div className="home-container">
        <div className="top-sections">
          <div className="small-section">
            <CalendarWidget onDateChange={handleDateChange} selectedDate={selectedDate} />
          </div>
          <div className="small-section">
            <IncomeExpenseRatioDashboard />
          </div>
        </div>
        <div className="large-section">
          <div className="section-title">
            {formatDate(selectedDate)} 的待辦事項
            <span className="todo-count">{todoList.length} 項</span>
          </div>
          <div className="large-section-item-area">
            {loading ? (
              <div className="loading-message">載入中...</div>
            ) : todoList.length > 0 ? (
              todoList.map((todo) => {
                // 确保任务日期与选中日期匹配
                const taskDate = new Date(todo.start);
                const isSameDay = taskDate.getDate() === selectedDate.getDate() &&
                  taskDate.getMonth() === selectedDate.getMonth() &&
                  taskDate.getFullYear() === selectedDate.getFullYear();

                if (!isSameDay) return null;

                return (
                  <div key={todo.id} className="large-section-item">
                    <h1>{todo.title}</h1>
                    <p>時間: {formatTime(todo.start)} - {formatTime(todo.end)}</p>
                    <p>地點: {todo.place || '無地點信息'}</p>
                    <p>備註: {todo.description || '無備註'}</p>
                  </div>
                );
              })
            ) : (
              <div className="no-todos-message">
                這一天沒有待辦事項
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;