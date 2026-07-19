import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import './CalendarView.css';

export default function CalendarView({ memories, onAddMemoryClick, onEditMemoryClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMemoryForDate = (date) => {
    return memories.find(m => {
      try {
        let memDate;
        if (m.date.includes('-') && m.date.length === 10) {
          memDate = parseISO(m.date);
        } else {
          memDate = new Date(m.date);
        }
        return isSameDay(memDate, date);
      } catch (e) {
        return false;
      }
    });
  };

  const handleMonthChange = (e) => {
    if (e.target.value) {
      const [year, month] = e.target.value.split('-');
      setCurrentMonth(new Date(year, parseInt(month) - 1, 1));
    }
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header centered">
        <label className="month-picker-label">
          <h2 className="calendar-month-title">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <input 
            type="month" 
            className="month-picker-input"
            value={format(currentMonth, 'yyyy-MM')}
            onChange={handleMonthChange}
          />
        </label>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-name" key={i}>
          {format(addDays(startDate, i), 'EEEEEE', { locale: es })}
        </div>
      );
    }
    return <div className="calendar-days-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const memory = getMemoryForDate(cloneDay);
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        
        days.push(
          <div
            className={`calendar-cell ${
              !isCurrentMonth ? 'disabled' : memory ? 'has-memory' : ''
            }`}
            key={day}
            onClick={() => {
              if (isCurrentMonth) {
                if (memory && onEditMemoryClick) {
                  onEditMemoryClick(memory);
                } else if (!memory && onAddMemoryClick) {
                  onAddMemoryClick(format(cloneDay, 'yyyy-MM-dd'));
                }
              }
            }}
          >
            <span className="calendar-date-number">{formattedDate}</span>
            {isCurrentMonth && !memory && (
              <div className="cell-overlay-btn">
                <Plus size={16} />
              </div>
            )}
            {memory && <div className="memory-indicator"></div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card glass">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
