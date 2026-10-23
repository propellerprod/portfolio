import React from 'react';

export const Team: React.FC = () => {
  return (
    <section className="sec" id="team">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">08 / КОМАНДА</span>
          <span className="mono">2 UNITS</span>
        </div>
        <h2 className="h-mega h-sec">КТО СНИМАЕТ</h2>
        <div className="team-grid" style={{ marginTop: '8vh' }}>
          <div className="tm-a">
            <figure>
              <img
                src="https://github.com/propellerprod/portfolio/blob/main/image/IMG_1808.JPG?raw=true"
                alt="Оператор ПРОПЕЛЛЕР"
                loading="lazy"
              />
            </figure>
            <div className="tm-cap">
              <div>
                <div className="tm-name">ДАНИЛА ДИНЕИЧ</div>
                <div className="mono tm-roles">ОПЕРАТОР / РЕЖИССЁР / МОНТАЖЁР / ПРОДЮСЕР</div>
              </div>
              <span className="mono">UNIT A</span>
            </div>
          </div>

          <div className="tm-b">
            <figure>
              <img
                src="https://github.com/propellerprod/portfolio/blob/main/image/IMG_3731.PNG?raw=true"
                alt="Режиссёр ПРОПЕЛЛЕР"
                loading="lazy"
              />
            </figure>
            <div className="tm-cap">
              <div>
                <div className="tm-name">ВЛАД ИСАЕВ</div>
                <div className="mono tm-roles">РЕЖИССЁР / ОПЕРАТОР / КРЕАТИВ / МОНТАЖ</div>
              </div>
              <span className="mono">UNIT B</span>
            </div>
          </div>
        </div>

        <div className="team-note">
          <span className="stamp">МЫ ОБА УМЕЕМ ВСЁ</span>
          <p className="mono">НА ПЛОЩАДКЕ НАС ВСЕГДА ДВОЕ</p>
        </div>
      </div>
    </section>
  );
};
