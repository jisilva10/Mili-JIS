import { useState } from 'react';
import BottomNav from './components/BottomNav';
import Memories from './pages/Memories';
import Wishlist from './pages/Wishlist';

function App() {
  const [activeTab, setActiveTab] = useState('memories');
  const [memories, setMemories] = useState([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
      note: 'Nuestro primer aniversario en la playa. El atardecer estuvo increíble.',
      date: '14 Feb 2026',
      rating: 5,
      repeat: true,
    }
  ]);
  const [wishlist, setWishlist] = useState([
    { id: 1, text: 'Ir a probar el nuevo restaurante de sushi', completed: false },
    { id: 2, text: 'Escapada a la playa el fin de semana', completed: false },
  ]);

  const addMemory = (newMemory) => {
    setMemories([newMemory, ...memories]);
  };

  const updateWishlist = (newList) => {
    setWishlist(newList);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {activeTab === 'memories' ? (
          <Memories memories={memories} />
        ) : (
          <Wishlist 
            wishlist={wishlist} 
            updateWishlist={updateWishlist} 
            addMemory={addMemory} 
          />
        )}
      </main>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
