import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Memories from './pages/Memories';
import Wishlist from './pages/Wishlist';
import { supabase } from './supabaseClient';
import { format } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  const [memories, setMemories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // ... (keeping existing fetch and CRUD functions)

  const fetchData = async () => {
    setLoading(true);
    try {
      const [memoriesRes, wishlistRes, settingsRes] = await Promise.all([
        supabase.from('memories').select('*').order('date', { ascending: false }),
        supabase.from('wishlist').select('*').order('created_at', { ascending: false }),
        supabase.from('app_settings').select('*').eq('id', 1).single()
      ]);
      
      if (memoriesRes.data) setMemories(memoriesRes.data);
      if (wishlistRes.data) setWishlist(wishlistRes.data);
      if (settingsRes.data && settingsRes.data.banner_url) {
        setBannerUrl(settingsRes.data.banner_url);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (newUrl) => {
    const { error } = await supabase.from('app_settings').upsert({ id: 1, banner_url: newUrl });
    if (!error) {
      setBannerUrl(newUrl);
    }
  };

  const addMemory = async (newMemory) => {
    let dateToSave = newMemory.date;
    try {
      if (dateToSave && !dateToSave.includes('-')) {
         dateToSave = new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      dateToSave = new Date().toISOString().split('T')[0];
    }

    const memoryData = {
      image_url: newMemory.image,
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
      setMemories([data[0], ...memories].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  const updateWishlist = async (newList) => {
    setWishlist(newList);
  };

  const updateMemory = async (id, updatedMemory) => {
    const memoryData = {
      image_url: updatedMemory.image,
      note: updatedMemory.note,
      date: updatedMemory.date,
      rating: updatedMemory.rating,
      repeat: updatedMemory.repeat
    };
    const { data, error } = await supabase.from('memories').update(memoryData).eq('id', id).select();
    if (!error && data) {
      setMemories(memories.map(m => m.id === id ? data[0] : m).sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  const deleteMemory = async (id) => {
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (!error) {
      setMemories(memories.filter(m => m.id !== id));
    }
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

  const deleteWishlistItem = async (id) => {
    const { error } = await supabase.from('wishlist').delete().eq('id', id);
    if (!error) {
      setWishlist(wishlist.filter(item => item.id !== id));
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-muted)' }}>
            Cargando...
          </div>
        ) : activeTab === 'calendar' || activeTab === 'feed' ? (
          <Memories 
            activeTab={activeTab}
            memories={memories} 
            addMemory={addMemory} 
            updateMemory={updateMemory}
            deleteMemory={deleteMemory}
            bannerUrl={bannerUrl} 
            updateBanner={updateBanner} 
          />
        ) : (
          <Wishlist 
            wishlist={wishlist} 
            updateWishlist={updateWishlist} 
            addWishlistItem={addWishlistItem}
            toggleWishlistItem={toggleWishlistItem}
            deleteWishlistItem={deleteWishlistItem}
          />
        )}
      </main>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
