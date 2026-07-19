import { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';
import CalendarView from '../components/CalendarView';
import AddMemoryModal from '../components/AddMemoryModal';
import BannerCropModal from '../components/BannerCropModal';
import { format, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import defaultBannerImg from '../assets/banner.jpg';
import './Memories.css';

export default function Memories({ memories, addMemory, updateMemory, deleteMemory, bannerUrl, updateBanner }) {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'feed'
  const [selectedMonthDate, setSelectedMonthDate] = useState(null);
  
  // Modal states
  const [addingDate, setAddingDate] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  
  // Banner states
  const fileInputRef = useRef(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleMonthSelect = (date) => {
    setSelectedMonthDate(date);
    setViewMode('feed');
  };

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
    // reset input
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

  const filteredMemories = useMemo(() => {
    if (viewMode === 'calendar' || !selectedMonthDate) return memories;
    
    return memories.filter(m => {
      try {
        const memDate = m.date.includes('-') && m.date.length === 10 ? parseISO(m.date) : new Date(m.date);
        return isSameMonth(memDate, selectedMonthDate);
      } catch (e) {
        return false;
      }
    });
  }, [memories, viewMode, selectedMonthDate]);

  return (
    <div className={`memories-page ${viewMode === 'calendar' ? 'no-scroll' : ''}`}>
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
        {viewMode === 'feed' ? (
          <div className="feed-header">
            <button 
              className="back-to-calendar-btn" 
              onClick={() => setViewMode('calendar')}
            >
              <ArrowLeft size={20} />
              <span>Volver al Calendario</span>
            </button>
            <h1 className="text-title" style={{ marginTop: '12px' }}>
              {selectedMonthDate ? format(selectedMonthDate, 'MMMM yyyy', { locale: es }) : 'Historia'}
            </h1>
          </div>
        ) : (
          <>
            <h1 className="text-title">Nuestra Historia</h1>
            <p className="text-subtitle">Cada momento cuenta</p>
          </>
        )}
      </header>

      {viewMode === 'calendar' ? (
        <CalendarView 
          memories={memories} 
          onMonthSelect={handleMonthSelect} 
          onAddMemoryClick={(date) => setAddingDate(date)}
        />
      ) : (
        <div className="memories-feed">
          {filteredMemories.length === 0 ? (
            <div className="empty-state">
              <p>No hay recuerdos para este mes.</p>
              <p>¡Agrega recuerdos desde el calendario!</p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                onEdit={() => setEditingMemory(memory)}
                onDelete={() => deleteMemory && deleteMemory(memory.id)}
              />
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
