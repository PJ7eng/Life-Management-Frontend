import '../component_styles/MainContent.css';
import '../component_styles/Home.css';
import CalendarWidget from './CalendarWidget';
import IncomeExpenseRatioDashboard from './IncomeExpenseRatioDashboard';
import { useState } from 'react';

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 修改后的待办事项数据结构，使用 start 和 end 字段
  const todoList = [
    {
      id: '1',
      title: '上課',
      start: '2025-06-22 10:30',
      end: '2025-06-22 12:00',
      place: 'FJ701',
      description: '准時上課',
    },
    {
      id: '2',
      title: '會議',
      start: '2025-06-23 14:00',
      end: '2025-06-23 15:30',
      place: '會議室A',
      description: '項目進度報告',
    },
    {
      id: '3',
      title: '健身房',
      start: '2025-06-24 18:00',
      end: '2025-06-24 19:30',
      place: '健身中心',
      description: '有氧運動',
    },
    {
      id: '4',
      title: '醫生預約',
      start: '2025-06-25 09:00',
      end: '2025-06-25 10:00',
      place: '市立醫院',
      description: '年度健康檢查',
    },
    {
      id: '5',
      title: '團隊聚餐',
      start: '2025-06-26 19:00',
      end: '2025-06-26 21:00',
      place: '藍屋餐廳',
      description: '歡迎新同事',
    },
    {
      id: '6',
      title: '線上課程',
      start: '2025-06-27 20:00',
      end: '2025-06-27 22:00',
      place: 'Zoom會議',
      description: 'React進階課程',
    },
    {
      id: '7',
      title: '家庭日',
      start: '2025-06-28 00:00',
      end: '2025-06-28 23:59',
      place: '家裡',
      description: '家庭聚會',
    },
  ];
  
  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 根据选中的日期过滤待办事项
  const filteredTodoList = todoList.filter(todo => 
    todo.start.startsWith(formatDate(selectedDate))
  );
  
  // 格式化时间显示 (HH:mm)
  const formatTime = (dateTime) => {
    return dateTime.split(' ')[1].substring(0, 5);
  };
  
  // 处理日期变更的回调函数
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
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
            <span className="todo-count">{filteredTodoList.length} 項</span>
          </div>
          <div className="large-section-item-area">
            {filteredTodoList.length > 0 ? (
              filteredTodoList.map((todo) => (
                <div key={todo.id} className="large-section-item">
                  <h1>{todo.title}</h1>
                  <p>時間: {formatTime(todo.start)} - {formatTime(todo.end)}</p>
                  <p>地點: {todo.place}</p>
                  <p>備註: {todo.description}</p>
                </div>
              ))
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