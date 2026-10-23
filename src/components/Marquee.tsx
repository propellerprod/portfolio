import React from 'react';
import { PropellerIcon } from './PropellerIcon';

const WORDS = [
  'КОНЦЕРТЫ',
  'РЕКЛАМА',
  'КЛИПЫ',
  'REELS',
  'YOUTUBE',
  'МЕРОПРИЯТИЯ',
  'ПОДКАСТЫ',
  'МОНТАЖ',
  'BACKSTAGE'
];

export const Marquee: React.FC = () => {
  // Duplicate list twice for continuous marquee
  const trackItems = [...WORDS, ...WORDS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="mq-track">
        {trackItems.map((word, i) => (
          <React.Fragment key={i}>
            <span>{word}</span>
            <PropellerIcon className="mq-prop vhs-ghost" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
