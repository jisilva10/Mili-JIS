import { Check } from 'lucide-react';
import './WishlistItem.css';

export default function WishlistItem({ item, onToggle }) {
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
    </div>
  );
}
