import { BookHeart, ListTodo } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav glass">
      <button 
        className={`nav-item ${activeTab === 'memories' ? 'active' : ''}`}
        onClick={() => setActiveTab('memories')}
      >
        <BookHeart size={24} className="nav-icon" />
        <span className="nav-label">Recuerdos</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
        onClick={() => setActiveTab('wishlist')}
      >
        <ListTodo size={24} className="nav-icon" />
        <span className="nav-label">Wishlist</span>
      </button>
    </nav>
  );
}
