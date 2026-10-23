import React, { useState } from 'react';
import { SERVICES } from '../data/constants';

interface ServicesProps {
  onContactClick: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onContactClick }) => {
  const [hoverImg, setHoverImg] = useState<string | null>(null);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = Math.min(e.clientX + 30, window.innerWidth - 320);
    const y = Math.min(Math.max(e.clientY - 100, 10), window.innerHeight - 220);
    setPrevPos({ x, y });
  };

  return (
    <section className="sec" id="services" onMouseMove={handleMouseMove}>
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">04 / УСЛУГИ</span>
          <span className="mono">FULL CYCLE</span>
        </div>

        <h2 className="h-mega h-mid" style={{ marginBottom: '8vh' }}>
          НЕ ПРОСТО СНИМАЕМ.<br />
          ПРИДУМЫВАЕМ, СНИМАЕМ И <span className="acc">ДОВОДИМ ДО РЕЗУЛЬТАТА</span>.
        </h2>

        <ul className="svcList">
          {SERVICES.map((s) => (
            <li
              key={s.n}
              className="svc"
              onMouseEnter={() => setHoverImg(s.img)}
              onMouseLeave={() => setHoverImg(null)}
              onClick={onContactClick}
            >
              <span className="svc-num">{s.n}</span>
              <span className="svc-name">{s.name}</span>
              <span className="svc-tags">{s.tags}</span>
            </li>
          ))}
        </ul>

        <p className="svc-sub mono">
          НУЖНО ДРУГОЕ? <b>ОБСУДИМ.</b>
        </p>
      </div>

      {/* Floating desktop preview */}
      {hoverImg && (
        <img
          id="svcPrev"
          className="show"
          src={hoverImg}
          alt=""
          aria-hidden="true"
          style={{
            transform: `translate3d(${prevPos.x}px, ${prevPos.y}px, 0) scale(1) rotate(-2deg)`,
          }}
        />
      )}
    </section>
  );
};
