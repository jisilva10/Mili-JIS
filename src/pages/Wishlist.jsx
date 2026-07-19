import { useState } from 'react';
import { Plus } from 'lucide-react';
import WishlistItem from '../components/WishlistItem';
import CompleteDateModal from '../components/CompleteDateModal';
import './Wishlist.css';

export default function Wishlist({ wishlist, updateWishlist, addMemory }) {
  const [newItemText, setNewItemText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Item being completed

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: Date.now(),
      text: newItemText,
      completed: false
    };
    
    updateWishlist([newItem, ...wishlist]);
    setNewItemText('');
  };

  const handleToggleComplete = (id) => {
    const updated = wishlist.map(item => {
      if (item.id === id) {
        const isCompleting = !item.completed;
        if (isCompleting) {
          setSelectedItem(item);
        }
        return { ...item, completed: isCompleting };
      }
      return item;
    });
    updateWishlist(updated);
  };

  const handleSaveMemory = (memoryData) => {
    addMemory({
      ...memoryData,
      id: Date.now(),
    });
    // Remove from wishlist or keep it as completed? Usually keep it or remove. Let's keep it as completed.
    setSelectedItem(null);
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

      {selectedItem && (
        <CompleteDateModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onSave={handleSaveMemory}
        />
      )}
    </div>
  );
}
