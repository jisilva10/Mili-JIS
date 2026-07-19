import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';
import CalendarView from '../components/CalendarView';
import AddMemoryModal from '../components/AddMemoryModal';
import { format, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './Memories.css';

export default function Memories({ memories, addMemory }) {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'feed'
  const [selectedMonthDate, setSelectedMonthDate] = useState(null);
  
  // Modal state
  const [addingDate, setAddingDate] = useState(null);

  const handleMonthSelect = (date) => {
    setSelectedMonthDate(date);
    setViewMode('feed');
  };

  const handleSaveMemory = (memoryData) => {
    if (addMemory) {
      addMemory(memoryData);
    }
    setAddingDate(null);
  };

  const filteredMemories = useMemo(() => {
    if (viewMode === 'calendar' || !selectedMonthDate) return memories;
    
    return memories.filter(m => {
      try {
        const memDate = m.date.includes('-') && m.date.length === 10 ? parseISO(m.date) : new Date(m.date);
        return isSameMonth(memDate, selectedMonthDate);
      } catch (e) {
        return false;
      }
    });
  }, [memories, viewMode, selectedMonthDate]);

  return (
    <div className="memories-page">
      <header className="page-header">
        {viewMode === 'feed' ? (
          <div className="feed-header">
            <button 
              className="back-to-calendar-btn" 
              onClick={() => setViewMode('calendar')}
            >
              <ArrowLeft size={20} />
              <span>Volver al Calendario</span>
            </button>
            <h1 className="text-title" style={{ marginTop: '12px' }}>
              {selectedMonthDate ? format(selectedMonthDate, 'MMMM yyyy', { locale: es }) : 'Recuerdos'}
            </h1>
          </div>
        ) : (
          <>
            <h1 className="text-title">El Baúl de los Recuerdos</h1>
            <p className="text-subtitle">Nuestra historia, un momento a la vez ✨</p>
          </>
        )}
      </header>

      {viewMode === 'calendar' ? (
        <CalendarView 
          memories={memories} 
          onMonthSelect={handleMonthSelect} 
          onAddMemoryClick={(date) => setAddingDate(date)}
        />
      ) : (
        <div className="memories-feed">
          {filteredMemories.length === 0 ? (
            <div className="empty-state">
              <p>No hay recuerdos para este mes.</p>
              <p>¡Agrega recuerdos desde el calendario!</p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))
          )}
        </div>
      )}

      {addingDate && (
        <AddMemoryModal 
          date={addingDate}
          onClose={() => setAddingDate(null)}
          onSave={handleSaveMemory}
        />
      )}
    </div>
  );
}
