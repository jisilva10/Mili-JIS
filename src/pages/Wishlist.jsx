import { useState } from 'react';
import { Plus } from 'lucide-react';
import WishlistItem from '../components/WishlistItem';
import './Wishlist.css';

export default function Wishlist({ wishlist, updateWishlist, addWishlistItem, toggleWishlistItem }) {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    if (addWishlistItem) {
      await addWishlistItem(newItemText);
    } else {
      const newItem = {
        id: Date.now(),
        text: newItemText,
        completed: false
      };
      updateWishlist([newItem, ...wishlist]);
    }
    setNewItemText('');
  };

  const handleToggleComplete = async (id) => {
    const item = wishlist.find(i => i.id === id);
    if (!item) return;

    const isCompleting = !item.completed;
    
    if (toggleWishlistItem) {
      await toggleWishlistItem(id, isCompleting);
    } else {
      const updated = wishlist.map(i => i.id === id ? { ...i, completed: isCompleting } : i);
      updateWishlist(updated);
    }
  };

  return (
    <div className="wishlist-page">
      <header className="page-header">
        <h1 className="text-title">Wishlist de Citas</h1>
        <p className="text-subtitle">Nuestras próximas aventuras juntos 🚀</p>
      </header>

      <form className="add-item-form" onSubmit={handleAddItem}>
        <input 
          type="text" 
          placeholder="¿Qué hacemos la próxima?" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="add-item-input"
        />
        <button type="submit" className="add-item-button" disabled={!newItemText.trim()}>
          <Plus size={20} />
        </button>
      </form>

      <div className="wishlist-list">
        {wishlist.length === 0 ? (
          <div className="empty-state">
            <p>No hay planes futuros.</p>
            <p>¡Agrega algunas ideas divertidas!</p>
          </div>
        ) : (
          wishlist.map((item) => (
            <WishlistItem 
              key={item.id} 
              item={item} 
              onToggle={() => handleToggleComplete(item.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
}
