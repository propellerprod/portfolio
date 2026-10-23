import React from 'react';
import { Collab } from '../types';

interface CollabsProps {
  collabs: Collab[];
}

export const Collabs: React.FC<CollabsProps> = ({ collabs }) => {
  return (
    <section className="bw-section" id="collabs">
      <div className="bw-container">
        <div className="bw-section-header">
          <h2 className="bw-section-title">С КЕМ РАБОТАЛИ</h2>
          <span className="bw-section-subtitle">АРТИСТЫ · БРЕНДЫ · ЛЮДИ</span>
        </div>

        <div className="bw-collabs-grid">
          {collabs.map((c, i) => {
            const firstLink = c.links && c.links.length > 0 ? c.links[0] : undefined;
            const hasLink = Boolean(firstLink && String(firstLink).trim());
            const linkUrl = hasLink ? String(firstLink).trim() : '';

            const cardContent = (
              <>
                <div className="bw-collab-avatar-box">
                  {c.img ? (
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = '<span class="bw-collab-fallback">[ФОТО]</span>';
                        }
                      }}
                    />
                  ) : (
                    <span className="bw-collab-fallback">[ФОТО]</span>
                  )}
                </div>
                <div className="bw-collab-name">
                  <span>{c.name}</span>
                  {hasLink && <span className="bw-arrow-link" aria-hidden="true">↗</span>}
                </div>
              </>
            );

            if (hasLink) {
              return (
                <a
                  key={i}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bw-collab-card is-link"
                  aria-label={`${c.name} — перейти`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={i} className="bw-collab-card">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
