import React from 'react';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onContactClick: () => void;
  onCollabsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onContactClick,
  onCollabsClick,
}) => {
  // Requested category tab order: Концерты -> Клипы -> Блогеры -> Reels -> Все
  const categories = [
    { key: 'concerts', label: 'КОНЦЕРТЫ' },
    { key: 'clips', label: 'КЛИПЫ' },
    { key: 'commercials', label: 'БЛОГЕРЫ' },
    { key: 'reels', label: 'REELS' },
    { key: 'all', label: 'ВСЕ' },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onSelectCategory('concerts');
  };

  return (
    <header id="bw-header">
      {/* Main Header Brand Row */}
      <div className="bw-header-main">
        <div className="bw-container bw-header-inner">
          <h1 className="bw-brand-title">
            <a href="/" onClick={handleHomeClick}>
              ПРОПЕЛЛЕР UNION
            </a>
          </h1>
        </div>
      </div>

      {/* Minimalist Sub-Header Category Navigation */}
      <nav className="bw-subnav" aria-label="Категории видеопортфолио">
        <div className="bw-container bw-subnav-inner">
          <div className="bw-categories-track">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`bw-cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.key)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="bw-nav-secondary-links">
            <button
              type="button"
              className="bw-sec-link"
              onClick={onCollabsClick}
            >
              С КЕМ РАБОТАЛИ
            </button>
            <button
              type="button"
              className="bw-sec-link"
              onClick={onContactClick}
            >
              КОНТАКТЫ
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
