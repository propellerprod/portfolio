import React from 'react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onCollabsClick: () => void;
  onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onCollabsClick,
  onContactClick,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bw-footer">
      <div className="bw-container">
        <div className="bw-footer-content">
          <div className="bw-footer-left">
            <span className="bw-footer-copy">
              © {currentYear} ПРОПЕЛЛЕР UNION · ВИДЕОПРОДАКШН
            </span>
            <span className="bw-footer-subcopy">
              PRODUCTION & DIRECTING
            </span>
          </div>

          <div className="bw-footer-links">
            <button
              type="button"
              className="bw-footer-btn"
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ВСЕ
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={() => {
                onSelectCategory('concerts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              КОНЦЕРТЫ
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={() => {
                onSelectCategory('commercials');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              БЛОГЕРЫ
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={() => {
                onSelectCategory('clips');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              КЛИПЫ
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={() => {
                onSelectCategory('reels');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              REELS
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={onCollabsClick}
            >
              С КЕМ РАБОТАЛИ
            </button>
            <button
              type="button"
              className="bw-footer-btn"
              onClick={onContactClick}
            >
              КОНТАКТЫ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
