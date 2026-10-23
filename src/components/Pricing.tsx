import React from 'react';
import { PRICES } from '../data/constants';

interface PricingProps {
  onContactClick: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onContactClick }) => {
  return (
    <section className="sec" id="prices">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">07 / СТОИМОСТЬ</span>
          <span className="mono">БЕЗ СКРЫТЫХ ПЛАТЕЖЕЙ</span>
        </div>
        <h2 className="h-mega h-sec">
          СТОИМОСТЬ<span className="acc">?</span>
        </h2>
        <div className="price-grid" style={{ marginTop: '8vh' }}>
          {PRICES.map((p, i) => (
            <div key={i} className={`price ${p.hot ? 'hot' : ''}`}>
              {p.hot && <span className="p-tag">ЧАЩЕ ВСЕГО</span>}
              <h3>{p.name}</h3>
              <p className="p-for">{p.forOne}</p>
              <div className="p-val">{p.val}</div>
              <div className="mono">ЧТО ВХОДИТ</div>
              <ul>
                {p.inc.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <button
                className={`btn ${p.hot ? 'btn-acc' : ''}`}
                onClick={onContactClick}
              >
                ОБСУДИТЬ <span className="arr">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
