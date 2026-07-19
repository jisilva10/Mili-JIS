import { useState, useMemo, useRef } from 'react';
import { Camera } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';
import CalendarView from '../components/CalendarView';
import AddMemoryModal from '../components/AddMemoryModal';
import BannerCropModal from '../components/BannerCropModal';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import defaultBannerImg from '../assets/banner.jpg';
import './Memories.css';

export default function Memories({ activeTab, memories, addMemory, updateMemory, deleteMemory, bannerUrl, updateBanner }) {
  // Modal states
  const [addingDate, setAddingDate] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  
  // Banner states
  const fileInputRef = useRef(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleSaveMemory = (memoryData) => {
    if (editingMemory && updateMemory) {
      updateMemory(editingMemory.id, memoryData);
    } else if (addMemory) {
      addMemory(memoryData);
    }
    setAddingDate(null);
    setEditingMemory(null);
  };

  const onBannerFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedBannerImage(imageUrl);
    }
    e.target.value = null;
  };

  const handleCropComplete = async (croppedBlob) => {
    if (!croppedBlob) return;
    setIsUploadingBanner(true);
    
    try {
      const fileName = `${uuidv4()}.jpg`;
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error("Error uploading banner:", error);
        alert("Asegúrate de haber creado el bucket 'assets' público en Supabase.");
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(fileName);

        if (publicUrlData && updateBanner) {
          await updateBanner(publicUrlData.publicUrl);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploadingBanner(false);
      setSelectedBannerImage(null);
    }
  };

  // Group memories by year
  const groupedMemories = useMemo(() => {
    const groups = {};
    memories.forEach(m => {
      let year;
      try {
        const d = m.date.includes('-') ? new Date(m.date + 'T00:00:00') : new Date(m.date);
        year = d.getFullYear();
        if (isNaN(year)) year = new Date().getFullYear();
      } catch (e) {
        year = new Date().getFullYear();
      }
      if (!groups[year]) groups[year] = [];
      groups[year].push(m);
    });
    
    // Sort years descending
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        items: groups[year]
      }));
  }, [memories]);

  return (
    <div className={`memories-page ${activeTab === 'calendar' ? 'no-scroll' : ''}`}>
      <div className="hero-banner">
        <img 
          src={bannerUrl || defaultBannerImg} 
          alt="Nuestra Historia" 
          className="banner-image" 
          style={{ opacity: isUploadingBanner ? 0.5 : 1 }}
        />
        <button 
          className="edit-banner-btn"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Cambiar foto de banner"
          disabled={isUploadingBanner}
        >
          <Camera size={20} />
        </button>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onBannerFileChange}
        />
      </div>

      <header className="page-header">
        <h1 className="text-title">{activeTab === 'calendar' ? 'Nuestra Historia' : 'Nuestros Recuerdos'}</h1>
        <p className="text-subtitle">{activeTab === 'calendar' ? 'Cada momento cuenta' : 'Un vistazo a todo lo que hemos vivido'}</p>
      </header>

      {activeTab === 'calendar' ? (
        <CalendarView 
          memories={memories} 
          onAddMemoryClick={(date) => setAddingDate(date)}
          onEditMemoryClick={(memory) => setEditingMemory(memory)}
        />
      ) : (
        <div className="memories-feed">
          {groupedMemories.length === 0 ? (
            <div className="empty-state">
              <p>No hay recuerdos guardados aún.</p>
              <p>¡Agrega recuerdos desde el calendario!</p>
            </div>
          ) : (
            groupedMemories.map((group) => (
              <div key={group.year} className="year-group">
                <div className="year-header glass">
                  <h2>{group.year}</h2>
                </div>
                <div className="year-memories">
                  {group.items.map((memory) => (
                    <MemoryCard 
                      key={memory.id} 
                      memory={memory} 
                      onEdit={() => setEditingMemory(memory)}
                      onDelete={() => deleteMemory && deleteMemory(memory.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {(addingDate || editingMemory) && (
        <AddMemoryModal 
          date={addingDate || (editingMemory && editingMemory.date)}
          existingMemory={editingMemory}
          onClose={() => {
            setAddingDate(null);
            setEditingMemory(null);
          }}
          onSave={handleSaveMemory}
        />
      )}

      {selectedBannerImage && (
        <BannerCropModal 
          imageSrc={selectedBannerImage} 
          onClose={() => setSelectedBannerImage(null)}
          onCropCompleteHandler={handleCropComplete}
        />
      )}
    </div>
  );
}
