import { CalendarDays, LayoutList, ListTodo } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav glass">
      <button 
        className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveTab('calendar')}
      >
        <CalendarDays size={24} className="nav-icon" />
        <span className="nav-label">Calendario</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => setActiveTab('feed')}
      >
        <LayoutList size={24} className="nav-icon" />
        <span className="nav-label">Tarjetas</span>
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
