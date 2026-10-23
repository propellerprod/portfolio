import React, { useState, useEffect } from 'react';
import { PropellerIcon } from './PropellerIcon';

export const Hero: React.FC = () => {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [frame, setFrame] = useState('000000');

  useEffect(() => {
    const t0 = performance.now();
    let animId: number;
    let lastTime = 0;

    const tick = (t: number) => {
      animId = requestAnimationFrame(tick);
      if (t - lastTime < 40) return;
      lastTime = t;

      const elapsed = (performance.now() - t0) / 1000;
      const f = Math.floor(elapsed * 24) % 24;
      const s = Math.floor(elapsed) % 60;
      const m = Math.floor(elapsed / 60) % 60;
      const h = Math.floor(elapsed / 3600) % 24;
      const pad = (n: number) => String(n).padStart(2, '0');

      setTimecode(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`);
      setFrame(String(Math.floor(elapsed * 24)).padStart(6, '0'));
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero">
      <div className="hero-media">
        <img
          src="https://github.com/propellerprod/portfolio/blob/main/image/IMG_5566.PNG?raw=true"
          alt="ПРОПЕЛЛЕР на съёмочной площадке"
        />
        <div className="vhs" aria-hidden="true">
          <i className="vhs-scan" />
          <i className="vhs-band" />
          <i className="vhs-glitch" />
        </div>
      </div>

      <div className="hud hud-tl">
        <span className="rec-dot" />
        <span>REC</span>
        <span>{timecode}</span>
        <span className="vhs-tag">VHS</span>
      </div>

      <div className="hud hud-tr">
        <span>FRAME</span>
        <span>{frame}</span>
      </div>

      <div className="hud hud-bl">
        <span>55.7558° N / 37.6173° E — МОСКВА</span>
      </div>

      <div className="hud hud-br">
        <span>PLAY ▸ / 24 FPS</span>
      </div>

      <div className="wrap">
        <p className="mono" style={{ marginBottom: '2vh' }}>
          [ ВИДЕОПРОДАКШН ПОЛНОГО ЦИКЛА ]
        </p>

        <h1 className="hero-title h-mega" aria-label="ПРОПЕЛЛЕР">
          <span>П</span>
          <span>Р</span>
          <PropellerIcon className="prop-o vhs-ghost" />
          <span>П</span>
          <span>Е</span>
          <span>Л</span>
          <span>Л</span>
          <span>Е</span>
          <span>Р</span>
        </h1>

        <p className="hero-phrase">
          ВИДЕО, КОТОРОЕ НЕ ХОЧЕТСЯ СКИПНУТЬ<span className="acc">.</span>
        </p>

        <div className="hero-meta mono">
          <span><b>ОПЕРАТОРЫ / КРЕАТОРЫ / ПРОДАКШН</b></span>
          <span>МОСКВА × ОРЁЛ</span>
        </div>

        <div className="hero-cta">
          <button
            className="btn btn-acc"
            onClick={() => scrollTo('contact')}
          >
            ОБСУДИТЬ ПРОЕКТ <span className="arr">→</span>
          </button>
          <button
            className="btn"
            onClick={() => scrollTo('works')}
          >
            СМОТРЕТЬ РАБОТЫ ↓
          </button>
        </div>
      </div>

      <div className="hero-badge" aria-hidden="true">
        <svg className="vhs-ghost" viewBox="0 0 200 200">
          <defs>
            <path id="circ" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <text>
            <textPath href="#circ">ПРОПЕЛЛЕР • ВИДЕОПРОДАКШН • МОСКВА × ОРЁЛ • </textPath>
          </text>
          <g className="badge-core" transform="translate(100,100) scale(.5)">
            <ellipse cx="0" cy="-25" rx="14" ry="23" />
            <ellipse cx="0" cy="-25" rx="14" ry="23" transform="rotate(120)" />
            <ellipse cx="0" cy="-25" rx="14" ry="23" transform="rotate(240)" />
            <circle r="8" />
          </g>
        </svg>
      </div>
    </section>
  );
};
