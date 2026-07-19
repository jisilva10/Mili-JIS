import { Star, Repeat, CalendarDays, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './MemoryCard.css';

export default function MemoryCard({ memory, onEdit, onDelete }) {
  let dateObj;
  try {
    dateObj = memory.date && memory.date.includes('-') && memory.date.length === 10 
      ? parseISO(memory.date) 
      : new Date(memory.date || Date.now());
  } catch (e) {
    dateObj = new Date();
  }
  
  const displayDate = format(dateObj, "d 'de' MMMM, yyyy", { locale: es });

  return (
    <article className="memory-card">
      {memory.image_url && (
        <div className="memory-image-container">
          <img src={memory.image_url} alt="Recuerdo" className="memory-image" loading="lazy" />
          
          <div className="memory-date glass">
            <CalendarDays size={14} />
            <span>{displayDate}</span>
          </div>
          
          <div className="memory-actions">
            <button className="memory-action-btn edit-btn" onClick={onEdit} aria-label="Editar">
              <Edit2 size={16} />
            </button>
            <button className="memory-action-btn delete-btn" onClick={onDelete} aria-label="Eliminar">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="memory-content">
        <p className="memory-note">{memory.note}</p>
        
        <div className="memory-footer">
          <div className="memory-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                className={star <= memory.rating ? 'star-filled' : 'star-empty'}
                fill={star <= memory.rating ? '#FFD700' : 'none'}
              />
            ))}
          </div>
          
          {memory.repeat && (
            <div className="memory-repeat">
              <Repeat size={14} />
              <span>Para repetir</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
