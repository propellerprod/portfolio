import React from 'react';
import { Project } from '../types';
import { getCover, toMutedLoopEmbed, BACKSTAGE_DEFAULT_IMG } from '../utils/video';

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
  // Priority ordering when 'all' is selected:
  // 1. Концерты (concerts)
  // 2. Блогеры (commercials)
  // 3. Клипы (clips)
  // 4. Reels (reels)
  const CATEGORY_RELEVANCE: Record<string, number> = {
    concerts: 1,
    commercials: 2,
    clips: 3,
    reels: 4,
  };

  // Filter projects by active category or sort by relevance for 'all'
  const filteredProjects = activeCategory === 'all'
    ? [...projects].sort((a, b) => {
        const rankA = CATEGORY_RELEVANCE[a.category] ?? 99;
        const rankB = CATEGORY_RELEVANCE[b.category] ?? 99;
        return rankA - rankB;
      })
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="bw-works-section" id="portfolio">
      <div className="bw-container">
        {filteredProjects.length === 0 ? (
          <div className="bw-empty-state">
            <p className="bw-empty-text">В ЭТОЙ КАТЕГОРИИ ПОКА НЕТ ПРОЕКТОВ</p>
          </div>
        ) : (
          <div className="bw-grid">
            {filteredProjects.map((p, idx) => {
              const cover = getCover(p);
              const mutedEmbedUrl = toMutedLoopEmbed(p.video || p.video_url);

              // Check if project has a direct mp4/webm video file or preview
              const directVideoSrc = (p.video_source === 'direct' && p.video_url)
                ? p.video_url
                : (p as any).video_preview || null;

              const indexStr = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={p.id || idx}
                  className="bw-card"
                  onClick={() => onSelectProject(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(p);
                    }
                  }}
                  aria-label={`${p.title} — ${p.client || 'Пропеллер Union'}`}
                >
                  {/* 16:9 Video Box with Dynamic Ambient Light in video color */}
                  <div
                    className="bw-video-container"
                    onClick={() => onSelectProject(p)}
                  >
                    {/* Dynamic Ambient Glow Layer in video frame color */}
                    <div
                      className="bw-video-ambient"
                      style={{ backgroundImage: `url(${cover})` }}
                      aria-hidden="true"
                    />

                    <div className="bw-video-wrapper">
                      {/* Fallback poster while video initializes */}
                      <img
                        className="bw-video-poster"
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
                        <div className="bw-iframe-wrap">
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

                      {/* Delicate edge blend layer: softly blurs the perimeter transition into ambient light */}
                      <div className="bw-video-edge-blend" aria-hidden="true" />

                      {/* Subtle Minimal Index */}
                      <span className="bw-badge-overlay">{indexStr}</span>

                      {/* Click capture layer to ensure modal opens cleanly */}
                      <div
                        className="bw-click-capture"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(p);
                        }}
                      />
                    </div>
                  </div>

                  {/* Title: uppercase bold white */}
                  <h3
                    className="bw-card-title"
                    onClick={() => onSelectProject(p)}
                  >
                    {p.title}
                  </h3>

                  {/* Subtitle / Artist / Client: uppercase muted gray */}
                  <div className="bw-card-subtitle">
                    <span className="bw-client-name">{p.client || 'ПРОПЕЛЛЕР UNION'}</span>
                    {p.format && (
                      <>
                        <span className="bw-meta-dot">·</span>
                        <span className="bw-format-name">{p.format}</span>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
