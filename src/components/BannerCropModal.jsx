import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';
import './BannerCropModal.css';

export default function BannerCropModal({ imageSrc, onClose, onCropCompleteHandler }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onCropCompleteHandler(croppedImage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="crop-modal-overlay glass">
      <div className="crop-modal-content">
        <div className="crop-header">
          <button className="crop-icon-btn" onClick={onClose} disabled={isProcessing}>
            <X size={24} />
          </button>
          <span className="crop-title">Ajusta tu foto</span>
          <button className="crop-icon-btn primary" onClick={handleSave} disabled={isProcessing}>
            <Check size={24} />
          </button>
        </div>
        
        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={2.5 / 1} // Approximated banner aspect ratio
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="crop-controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-slider"
          />
        </div>
      </div>
    </div>
  );
}
