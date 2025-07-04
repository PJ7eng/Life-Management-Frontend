import '../component_styles/MainContent.css';
import timeIcon from '../assets/mingcute--time-line.svg';
import placeIcon from '../assets/ic--outline-place.svg';
import descriptionIcon from '../assets/proicons--text-description.svg';

import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '../component_styles/Task.css';

import { useCallback, useMemo, useState, useEffect} from 'react';
import api from '../api';
import { constructFromSymbol } from 'date-fns/constants';


function Tasks() {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [taskError, setTaskError] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: '',
    title: '',
    start: '',
    end: '',
    place: '',
    description: ''
  });
  const today = new Date().toISOString().split('T')[0]; 
  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid()
    ],
    selectedDate: today,
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
    callbacks: {
      onEventClick: (event) => {
        setSelectedEventId(event.id);
      }
    }
  });

  const fetchTasks = async (eventsService) => {
  try {
    const response = await api.get('/tasks');
    
    // 转换数据格式并过滤字段
    const transformedTasks = response.data.map(task => ({
      id: task.id,
      title: task.title,
      start: task.start.replace('T', ' ').substring(0, 16), // 格式轉換
      end: task.end.replace('T', ' ').substring(0, 16),
      place: task.place,
      description: task.description,
    }));
    transformedTasks.forEach(task => {
      if (!eventsService.get(task.id)) {
        eventsService.add(task);
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewEvent({ id: '', title: '', start: '', end: '', place: '', description: '' });
  };

  const handleOpenDeleteModal = useCallback((eventId) => {
    setSelectedEventId(eventId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEventId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedEventId) {
      deleteTasks(selectedEventId);
      if(taskError) {
        setTaskError(false);
        return;
      };
      eventsService.remove(selectedEventId);
      handleCloseDeleteModal();
    }
  };

  const deleteTasks = async(eventId) => {
    try{
      await api.delete(`/tasks/${eventId}`);
    }catch(error){
      console.log("刪除任務失敗喲！", error);
      setTaskError(true);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const eventToAdd = {
        ...newEvent,
        // id: Date.now().toString(),
        start: newEvent.start.replace('T', ' '),
        end: newEvent.end.replace('T', ' ')
      };
      addTasks();

      if(taskError){
        setTaskError(false); 
        return;
      };
      
      eventsService.add(eventToAdd);
      handleCloseAddModal();
    } else {
      alert('請填寫標題、開始時間和結束時間！');
    }
  };
  
  const addTasks = async() => {
    try{
      await api.post("/tasks", {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        place: newEvent.place,
        description: newEvent.description,
      });
    }catch(error) {
      console.log("創建任務失敗喲！", error);
      setTaskError(true);
    }
  };


  useEffect(() => {
    fetchTasks(eventsService);
  }, [eventsService]);


  const customComponents = useMemo (() => ({
  eventModal: ({ calendarEvent }) => {
    return (
      <div className='event-modal'>
        <h1>{calendarEvent.title}</h1>
        <div className='event-modal-item'>
        <img src={timeIcon}/> 
        <h2>{calendarEvent.start.split(" ")[0]}, {calendarEvent.start.split(" ")[1]} - {calendarEvent.end.split(" ")[1]}</h2>
        </div>
        <div className='event-modal-item'>
        <img src={placeIcon}/> 
        <h2>{calendarEvent.place}</h2>
        </div>
        <div className='event-modal-item'>
        <img src={descriptionIcon}/> 
        <h2>{calendarEvent.description}</h2>
        </div>
        <button className='event-modal-delete-button' onClick={() => handleOpenDeleteModal(calendarEvent.id)}>刪除</button>
      </div>
    );
  },
}), [handleOpenDeleteModal])

  return (
    <div className="main-page">
      <button className="add-event-button" onClick={handleOpenAddModal}>
        添加事件
      </button>
      <ScheduleXCalendar
      customComponents={customComponents} 
      calendarApp={calendar} />
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>添加新事件</h2>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="事件標題"
                required
              />
              <label>開始時間 *</label>
              <input
                type="datetime-local"
                name="start"
                value={newEvent.start}
                onChange={handleInputChange}
                required
              />
              <label>結束時間 *</label>
              <input
                type="datetime-local"
                name="end"
                value={newEvent.end}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="place"
                value={newEvent.place}
                onChange={handleInputChange}
                placeholder="地點"
              />
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="描述"
              />
              <div className="modal-buttons">
                <button onClick={handleAddEvent}>創建</button>
                <button onClick={handleCloseAddModal}>取消</button>
              </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>確認刪除</h2>
            <p>您確定要刪除此事件嗎？</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>確認</button>
              <button onClick={handleCloseDeleteModal}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;