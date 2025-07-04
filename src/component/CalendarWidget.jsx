import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { zhTW } from 'date-fns/locale';
import '../component_styles/CalendarWidget.css';

// 自定義主題
const theme = createTheme({
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          border: 'none',
        },
      }
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          margin: '0', // 移除額外的間距
          justifyContent: 'center',
          fontSize: '1rem',
          color: '#64748b',
          width: '40px', // 與日期單元格寬度一致
        },
        header: {
          justifyContent: 'space-around', // 使用 space-around 來均勻分布
          padding: '0', // 移除內邊距
          '& > *': {
            flex: '1 1 40px', // 確保每個標籤佔據相同的空間
          }
        },
        weekContainer: {
          margin: '0', // 確保週容器沒有額外的間距
          justifyContent: 'space-around', // 與星期標籤對齊
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontSize: '1.0rem',
          fontFamily: 'Inter',
          fontWeight: 'bold',
          margin: '0',
          width: '40px', // 設置固定寬度
          height: '40px', // 保持正方形
          color: '#1e293b',
          '&.Mui-selected': {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            }
          },
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          // 非當前月份的日期樣式
          '&.MuiPickersDay-dayOutsideMonth': {
            color: '#cbd5e1', // 淡化顏色
            '&:hover': {
              backgroundColor: '#f8fafc', // 更淡的懸停背景
            }
          }
        },
      }
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#1e293b',
          '& .MuiPickersCalendarHeader-label': {
            fontSize: '1rem',
            fontWeight: 600,
          },
          '& .MuiIconButton-root': {
            color: '#64748b',
          }
        }
      }
    }
  }
});

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function CalendarWidget({ onDateChange, selectedDate }) {
  const dayOfWeekFormatter = (day) => {
    return weekDays[day.getDay() === 0 ? 6 : day.getDay() - 1];
  };

  return (
    <div className="calendar-widget">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhTW}>
          <DateCalendar 
            showDaysOutsideCurrentMonth
            fixedWeekNumber={6}
            value={selectedDate}
            onChange={onDateChange} // 处理日期变更
            dayOfWeekFormatter={dayOfWeekFormatter}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default CalendarWidget;