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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="v-popup-close-box">
        <button
          type="button"
          className="v-popup-close-btn"
          onClick={onClose}
          aria-label="Закрыть фото"
        >
          <svg
            className="v-popup-close-icon"
            width="23px"
            height="23px"
            viewBox="0 0 23 23"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="#fff" fillRule="evenodd">
              <rect
                transform="translate(11.313708, 11.313708) rotate(-45.000000) translate(-11.313708, -11.313708)"
                x="10.3137085"
                y="-3.6862915"
                width="2"
                height="30"
              />
              <rect
                transform="translate(11.313708, 11.313708) rotate(-315.000000) translate(-11.313708, -11.313708)"
                x="10.3137085"
                y="-3.6862915"
                width="2"
                height="30"
              />
            </g>
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
