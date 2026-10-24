import React, { useEffect } from 'react';

interface PhotoLightboxProps {
  imgUrl: string | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ imgUrl, onClose }) => {
  useEffect(() => {
    if (!imgUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imgUrl, onClose]);

  if (!imgUrl) return null;

  return (
    <div
      className="photo-lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фотографии"
    >
      <div className="v-popup-close-box">
        <button
          type="button"
          className="v-popup-close-btn"
          onClick={onClose}
          aria-label="Закрыть фото"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ pointerEvents: 'none' }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <img
        className="photo-lightbox-img"
        src={imgUrl}
        alt="Фото крупным планом"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
