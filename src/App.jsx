import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Memories from './pages/Memories';
import Wishlist from './pages/Wishlist';
import { supabase } from './supabaseClient';
import { format } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('memories');
  const [memories, setMemories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [memoriesRes, wishlistRes] = await Promise.all([
        supabase.from('memories').select('*').order('date', { ascending: false }),
        supabase.from('wishlist').select('*').order('created_at', { ascending: false })
      ]);
      
      if (memoriesRes.data) setMemories(memoriesRes.data);
      if (wishlistRes.data) setWishlist(wishlistRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (newMemory) => {
    // Format date to YYYY-MM-DD for Supabase 'date' type if needed, 
    // or keep it if it's already properly formatted.
    // In our CompleteDateModal, we might need to send a valid date string.
    // Let's ensure it's saved.
    let dateToSave = newMemory.date;
    try {
      // If it's something like '14 Feb 2026', Supabase might reject it, so we should pass YYYY-MM-DD
      if (dateToSave && !dateToSave.includes('-')) {
         dateToSave = new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      dateToSave = new Date().toISOString().split('T')[0];
    }

    const memoryData = {
      image_url: newMemory.image, // mapping image -> image_url for DB
      note: newMemory.note,
      date: dateToSave,
      rating: newMemory.rating,
      repeat: newMemory.repeat
    };

    const { data, error } = await supabase.from('memories').insert([memoryData]).select();
    
    if (error) {
      console.error('Error adding memory:', error);
      return;
    }
    if (data) {
      setMemories([data[0], ...memories]);
    }
  };

  const updateWishlist = async (newList) => {
    // Since we receive the full list from the component (optimistic update),
    // we need to find what changed, OR we can provide dedicated add/update functions.
    // For simplicity, let's keep the local state updated immediately:
    setWishlist(newList);
  };

  const addWishlistItem = async (text) => {
    const { data, error } = await supabase.from('wishlist').insert([{ text }]).select();
    if (!error && data) {
      setWishlist([data[0], ...wishlist]);
    }
  };

  const toggleWishlistItem = async (id, isCompleted) => {
    const { error } = await supabase.from('wishlist').update({ completed: isCompleted }).eq('id', id);
    if (!error) {
      setWishlist(wishlist.map(item => item.id === id ? { ...item, completed: isCompleted } : item));
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-muted)' }}>
            Cargando...
          </div>
        ) : activeTab === 'memories' ? (
          <Memories memories={memories} addMemory={addMemory} />
        ) : (
          <Wishlist 
            wishlist={wishlist} 
            updateWishlist={updateWishlist} 
            addWishlistItem={addWishlistItem}
            toggleWishlistItem={toggleWishlistItem}
          />
        )}
      </main>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
