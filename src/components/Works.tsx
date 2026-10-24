import React from 'react';
import { Project } from '../types';
import { getCover, toMutedLoopEmbed, isShorts, BACKSTAGE_DEFAULT_IMG } from '../utils/video';

interface WorksProps {
  projects: Project[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProject: (project: Project) => void;
}

export const Works: React.FC<WorksProps> = ({
  projects,
  activeCategory,
  onSelectProject,
}) => {
  const isAll = activeCategory === 'all';
  const isReelsCategory = activeCategory === 'reels';

  // Partition into horizontal and vertical Reels
  const horizontalProjects = isReelsCategory ? [] : projects.filter((p) => !isShorts(p));
  const reelsProjects = isReelsCategory ? projects : projects.filter((p) => isShorts(p));

  const renderCard = (p: Project, idx: number, isReel: boolean) => {
    const cover = getCover(p);
    const mutedEmbedUrl = toMutedLoopEmbed(p.video || p.video_url);

    // Check if project has direct video file
    const directVideoSrc =
      p.video_source === 'direct' && p.video_url
        ? p.video_url
        : (p as any).video_preview || null;

    const isYtCover = cover.includes('youtube.com') || cover.includes('ytimg.com');
    const indexStr = String(idx + 1).padStart(2, '0');

    return (
      <button
        type="button"
        key={p.id || idx}
        className={`bw-card ${isReel ? 'is-reels' : 'is-horizontal'}`}
        onClick={() => onSelectProject(p)}
        aria-label={`${p.title} — ${p.client || 'Пропеллер Union'}`}
      >
        {/* Video Box with Dynamic Ambient Light */}
        <div className={`bw-video-container ${isReel ? 'is-reels' : 'is-horizontal'}`}>
          {/* Dynamic Monochrome Ambient Glow Layer */}
          <div
            className="bw-video-ambient"
            style={{ backgroundImage: `url(${cover})` }}
            aria-hidden="true"
          />

          {/* Video Container (16:9 for horizontal, 9:16 for Reels) */}
          <div className={`bw-video-wrapper ${isReel ? 'is-reels' : 'is-horizontal'}`}>
            {/* Poster layer: covers 9:16 without sidebars */}
            <img
              className={`bw-video-poster ${isReel && isYtCover ? 'bw-poster-yt-short' : ''}`}
              src={cover}
              alt=""
              aria-hidden="true"
              loading={idx < 6 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = BACKSTAGE_DEFAULT_IMG;
              }}
            />

            {/* Direct Autoplaying Muted Video Loop */}
            {directVideoSrc ? (
              <video
                className="bw-video-element"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                ref={(el) => {
                  if (el) {
                    el.muted = true;
                    el.play().catch(() => {});
                  }
                }}
              >
                <source src={directVideoSrc} type="video/mp4" />
              </video>
            ) : mutedEmbedUrl ? (
              <div className={`bw-iframe-wrap ${isReel ? 'is-reels' : 'is-horizontal'}`}>
                <iframe
                  src={mutedEmbedUrl}
                  title={p.title}
                  loading={idx < 8 ? 'eager' : 'lazy'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            ) : null}

            {/* Soft perimeter boundary feathering blend */}
            <div className="bw-video-edge-blend" aria-hidden="true" />

            {/* Subtle Index Number */}
            <span className="bw-badge-overlay">{indexStr}</span>
          </div>
        </div>

        {/* Card Title */}
        <h3 className="bw-card-title">{p.title}</h3>

        {/* Client & Format */}
        <div className="bw-card-subtitle">
          <span className="bw-client-name">{p.client || 'ПРОПЕЛЛЕР UNION'}</span>
          {p.format && (
            <>
              <span className="bw-meta-dot">·</span>
              <span className="bw-format-name">{p.format}</span>
            </>
          )}
        </div>
      </button>
    );
  };

  if (projects.length === 0) {
    return (
      <section className="bw-works-section" id="portfolio">
        <div className="bw-container">
          <div className="bw-empty-state">
            <p className="bw-empty-text">В ЭТОЙ КАТЕГОРИИ ПОКА НЕТ ПРОЕКТОВ</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bw-works-section" id="portfolio">
      <div className="bw-container">
        {isAll ? (
          <>
            {/* 16:9 Horizontal Projects Grid (3 per row on desktop) */}
            {horizontalProjects.length > 0 && (
              <div className="bw-grid bw-grid-horizontal">
                {horizontalProjects.map((p, idx) => renderCard(p, idx, false))}
              </div>
            )}

            {/* 9:16 Reels Grid (4 per row on desktop) */}
            {reelsProjects.length > 0 && (
              <div className="bw-reels-section">
                {horizontalProjects.length > 0 && (
                  <div className="bw-reels-header">
                    <span className="bw-reels-tag">[ ВЕРТИКАЛЬНЫЙ ФОРМАТ ]</span>
                    <h2 className="bw-reels-heading">REELS / SHORTS</h2>
                  </div>
                )}
                <div className="bw-grid bw-grid-reels">
                  {reelsProjects.map((p, idx) =>
                    renderCard(p, horizontalProjects.length + idx, true)
                  )}
                </div>
              </div>
            )}
          </>
        ) : isReelsCategory ? (
          /* Reels Dedicated View (4 per row on desktop) */
          <div className="bw-grid bw-grid-reels">
            {reelsProjects.map((p, idx) => renderCard(p, idx, true))}
          </div>
        ) : (
          /* Horizontal Categories: Concerts, Commercials, Clips (3 per row on desktop) */
          <div className="bw-grid bw-grid-horizontal">
            {horizontalProjects.map((p, idx) => renderCard(p, idx, false))}
          </div>
        )}
      </div>
    </section>
  );
};
