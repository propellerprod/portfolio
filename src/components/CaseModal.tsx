import React, { useEffect } from 'react';
import { Project } from '../types';
import { toEmbed, isShorts, getCover, BACKSTAGE_DEFAULT_IMG } from '../utils/video';

interface CaseModalProps {
  project: Project | null;
  projectsList: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onOpenPhoto: (imgUrl: string) => void;
  onContactClick: () => void;
}

export const CaseModal: React.FC<CaseModalProps> = ({
  project,
  projectsList,
  onClose,
  onSelectProject,
  onOpenPhoto,
  onContactClick,
}) => {
  useEffect(() => {
    if (!project) return;

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        navigate(1);
      } else if (e.key === 'ArrowLeft') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, projectsList]);

  if (!project) return null;

  const currentIndex = projectsList.findIndex((p) => p.id === project.id);
  const embed = toEmbed(project.video_url || project.video);
  const vertical = isShorts(project);
  const cover = getCover(project);
  const photos = (project.images || []).filter(Boolean);
  const links = (project.links || []).filter(Boolean);

  const navigate = (direction: number) => {
    if (projectsList.length <= 1) return;
    const nextIdx = (currentIndex + direction + projectsList.length) % projectsList.length;
    onSelectProject(projectsList[nextIdx]);
  };

  return (
    <div
      className="bw-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 23px Close Button SVG (Pure White) */}
      <div className="bw-popup-close-box">
        <button
          type="button"
          className="bw-popup-close-btn"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          <svg
            width="23px"
            height="23px"
            viewBox="0 0 23 23"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="#ffffff" fillRule="evenodd">
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

      <div className="bw-popup-container">
        {/* Video Player Box with Ambient Light and Edge-to-Edge Frame */}
        <div className="bw-popup-player-container">
          {/* Dynamic Ambient Glow Layer in video frame color */}
          <div
            className="bw-popup-ambient"
            style={{ backgroundImage: `url(${cover})` }}
            aria-hidden="true"
          />

          <div className={`bw-popup-player-wrap ${vertical ? 'vertical' : ''}`}>
            {embed ? (
              <iframe
                src={embed.includes('?') ? `${embed}&autoplay=1` : `${embed}?autoplay=1`}
                title={project.title}
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                src={cover}
                alt={project.title}
                className="bw-popup-poster-fallback"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = BACKSTAGE_DEFAULT_IMG;
                }}
              />
            )}

            {/* Subtle soft edge blend to blur the boundary into the ambient backlight */}
            <div className="bw-popup-edge-blend" aria-hidden="true" />
          </div>
        </div>

        {/* Project Meta Bar under video */}
        <div className="bw-popup-meta">
          <div>
            <h2 className="bw-popup-title">{project.title}</h2>
            <div className="bw-popup-subtitle">
              <span>{project.client || 'ПРОПЕЛЛЕР UNION'}</span>
              {project.format && (
                <>
                  <span className="bw-meta-dot">·</span>
                  <span>{project.format}</span>
                </>
              )}
              {project.added && (
                <>
                  <span className="bw-meta-dot">·</span>
                  <span>{project.added.slice(0, 4)}</span>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bw-popup-controls">
            {projectsList.length > 1 && (
              <div className="bw-popup-arrows">
                <button
                  type="button"
                  className="bw-popup-nav-btn"
                  onClick={() => navigate(-1)}
                  aria-label="Предыдущий проект"
                >
                  ← ПРЕД
                </button>
                <button
                  type="button"
                  className="bw-popup-nav-btn"
                  onClick={() => navigate(1)}
                  aria-label="Следующий проект"
                >
                  СЛЕД →
                </button>
              </div>
            )}
            <button
              type="button"
              className="bw-popup-contact-btn"
              onClick={() => {
                onClose();
                onContactClick();
              }}
            >
              СВЯЗАТЬСЯ
            </button>
          </div>
        </div>

        {/* Backstage stills if available */}
        {photos.length > 0 && (
          <div className="bw-popup-photos-section">
            <div className="bw-popup-photos-label">КАДРЫ СО СЪЁМОК ({photos.length})</div>
            <div className="bw-popup-photos-grid">
              {photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Кадр со съёмок — ${project.title}`}
                  loading="lazy"
                  onClick={() => onOpenPhoto(url)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Additional links if present */}
        {links.length > 0 && (
          <div className="bw-popup-links-section">
            <div className="bw-popup-photos-label">МАТЕРИАЛЫ И ПУБЛИКАЦИИ</div>
            <div className="bw-popup-links-list">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bw-popup-ext-link"
                >
                  <span>{link}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
