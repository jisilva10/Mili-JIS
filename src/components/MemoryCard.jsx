import { Star, Repeat, CalendarDays } from 'lucide-react';
import './MemoryCard.css';

export default function MemoryCard({ memory }) {
  return (
    <article className="memory-card">
      {memory.image && (
        <div className="memory-image-container">
          <img src={memory.image} alt="Recuerdo" className="memory-image" loading="lazy" />
          
          <div className="memory-date glass">
            <CalendarDays size={14} />
            <span>{memory.date}</span>
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
                fill={star <= memory.rating ? 'currentColor' : 'none'}
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
