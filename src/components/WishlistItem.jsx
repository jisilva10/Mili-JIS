import { Check, Trash2 } from 'lucide-react';
import './WishlistItem.css';

export default function WishlistItem({ item, onToggle, onDelete }) {
  return (
    <div className={`wishlist-item ${item.completed ? 'completed' : ''}`}>
      <button 
        className="wishlist-checkbox" 
        onClick={onToggle}
        aria-label={item.completed ? "Desmarcar" : "Marcar como completado"}
      >
        <div className="checkbox-inner">
          {item.completed && <Check size={16} strokeWidth={3} />}
        </div>
      </button>
      <span className="wishlist-text">{item.text}</span>
      <button 
        className="wishlist-delete-btn" 
        onClick={onDelete}
        aria-label="Eliminar idea"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
