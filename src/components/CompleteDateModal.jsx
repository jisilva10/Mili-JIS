import { useState } from 'react';
import { X, ImagePlus, Star } from 'lucide-react';
import './CompleteDateModal.css';

export default function CompleteDateModal({ item, onClose, onSave }) {
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(5);
  const [repeat, setRepeat] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate current date
    const today = new Date().toLocaleDateString('es-ES', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
    
    onSave({
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', // Placeholder for demo
      note: note || `Completamos: ${item.text}`,
      date: today,
      rating,
      repeat
    });
  };

  return (
    <div className="modal-overlay glass">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">¡Cita Completada! 🎉</h2>
        <p className="modal-subtitle">Guarda este momento en el Baúl de los Recuerdos</p>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="image-upload-placeholder">
            <ImagePlus size={32} color="var(--color-text-muted)" />
            <span>Toca para subir una foto</span>
          </div>
          
          <textarea 
            className="modal-textarea" 
            placeholder="Escribe una anécdota o cómo la pasaron..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          ></textarea>
          
          <div className="modal-rating-section">
            <span>Calificación:</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="rating-star-btn"
                  onClick={() => setRating(star)}
                >
                  <Star 
                    size={28} 
                    className={star <= rating ? 'star-filled' : 'star-empty'}
                    fill={star <= rating ? '#FFD700' : 'none'}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="modal-repeat-toggle">
            <span>¿Lo volverían a hacer?</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={repeat} 
                onChange={(e) => setRepeat(e.target.checked)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <button type="submit" className="modal-submit-btn">
            Guardar Recuerdo
          </button>
        </form>
      </div>
    </div>
  );
}
