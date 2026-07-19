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
import { ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import './CalendarView.css';

export default function CalendarView({ memories, onMonthSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to get memory for a specific date
  const getMemoryForDate = (date) => {
    return memories.find(m => {
      // Assuming memory.date is either YYYY-MM-DD or a localized string
      // Let's try to handle both.
      try {
        let memDate;
        if (m.date.includes('-') && m.date.length === 10) {
          memDate = parseISO(m.date);
        } else {
          // If it's localized (like '14 Feb 2026'), this might fail with standard parse. 
          // For now, in our new Supabase DB it will be YYYY-MM-DD format (date type).
          memDate = new Date(m.date);
        }
        return isSameDay(memDate, date);
      } catch (e) {
        return false;
      }
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-btn">
          <ChevronLeft size={24} />
        </button>
        <h2 className="calendar-month-title">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <button onClick={nextMonth} className="calendar-nav-btn">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Monday start

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
        
        days.push(
          <div
            className={`calendar-cell ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : memory 
                  ? 'has-memory' 
                  : ''
            }`}
            key={day}
          >
            <span className="calendar-date-number">{formattedDate}</span>
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
      
      <button 
        className="view-cards-btn"
        onClick={() => onMonthSelect(currentMonth)}
      >
        <LayoutList size={20} />
        Ver tarjetas de {format(currentMonth, 'MMMM', { locale: es })}
      </button>
    </div>
  );
}
