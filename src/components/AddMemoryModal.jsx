import { useState } from 'react';
import { X, ImagePlus, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './AddMemoryModal.css';

export default function AddMemoryModal({ date, existingMemory, onClose, onSave }) {
  const [note, setNote] = useState(existingMemory ? existingMemory.note : '');
  const [rating, setRating] = useState(existingMemory ? existingMemory.rating : 5);
  const [repeat, setRepeat] = useState(existingMemory ? existingMemory.repeat : true);
  
  // We'll also allow changing the image if needed, but for simplicity we keep it as is, or use the existing image url.
  const [image, setImage] = useState(existingMemory ? existingMemory.image_url : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSave({
      image: image,
      note: note,
      date: date,
      rating,
      repeat
    });
  };

  const displayDate = typeof date === 'object' 
    ? format(date, "d 'de' MMMM, yyyy", { locale: es })
    : date;

  return (
    <div className="modal-overlay glass">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">{existingMemory ? "Editar Recuerdo" : "Nuevo Recuerdo"}</h2>
        <p className="modal-subtitle">{displayDate}</p>
        
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
            required
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
          
          <button type="submit" className="modal-submit-btn" disabled={!note.trim()}>
            Guardar Recuerdo
          </button>
        </form>
      </div>
    </div>
  );
}
