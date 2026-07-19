import { useState, useRef } from 'react';
import { X, ImagePlus, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './AddMemoryModal.css';

export default function AddMemoryModal({ date, existingMemory, onClose, onSave }) {
  const [note, setNote] = useState(existingMemory ? existingMemory.note : '');
  const [rating, setRating] = useState(existingMemory ? existingMemory.rating : 5);
  const [repeat, setRepeat] = useState(existingMemory ? existingMemory.repeat : true);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(existingMemory ? existingMemory.image_url : null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = imagePreview; // keep existing if no new file

    if (imageFile) {
      const fileName = `memories/${uuidv4()}.jpg`;
      const { error } = await supabase.storage
        .from('assets')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: true
        });
      
      if (!error) {
        const { data } = supabase.storage.from('assets').getPublicUrl(fileName);
        if (data) {
          finalImageUrl = data.publicUrl;
        }
      } else {
        alert("Asegúrate de haber creado el bucket 'assets' público en Supabase.");
      }
    }

    onSave({
      image: finalImageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop',
      note: note,
      date: date,
      rating,
      repeat
    });
    
    setIsUploading(false);
  };

  const displayDate = typeof date === 'object' 
    ? format(date, "d 'de' MMMM, yyyy", { locale: es })
    : date;

  return (
    <div className="modal-overlay glass">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} disabled={isUploading}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">{existingMemory ? "Editar Recuerdo" : "Nuevo Recuerdo"}</h2>
        <p className="modal-subtitle">{displayDate}</p>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div 
            className="image-upload-placeholder" 
            style={imagePreview ? { backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' } : {}}
            onClick={() => fileInputRef.current?.click()}
          >
            {!imagePreview && (
              <>
                <ImagePlus size={32} color="var(--color-text-muted)" />
                <span>Toca para subir una foto</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          
          <textarea 
            className="modal-textarea" 
            placeholder="Escribe una anécdota o cómo la pasaron..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
            disabled={isUploading}
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
                  disabled={isUploading}
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
                disabled={isUploading}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <button type="submit" className="modal-submit-btn" disabled={!note.trim() || isUploading}>
            {isUploading ? "Guardando..." : "Guardar Recuerdo"}
          </button>
        </form>
      </div>
    </div>
  );
}
