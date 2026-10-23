import React from 'react';

export const TwoCameras: React.FC = () => {
  return (
    <section className="sec" id="twoone">
      <div className="wrap two-grid">
        <div className="two-sticky">
          <div className="sec-head" style={{ marginBottom: '5vh' }}>
            <span className="mono">06 / ФОРМАТ</span>
          </div>
          <h2 className="two-title">
            2 ОПЕРАТОРА <span className="outl">1 ЦЕНА</span>
          </h2>
          <p className="two-cap">
            Работаем вдвоём на площадке: один снимает основной материал, второй одновременно работает со второй камерой, светом, деталями, backstage и дополнительными планами.
          </p>
        </div>
        <div className="two-media">
          <figure>
            <img
              src="https://github.com/propellerprod/portfolio/blob/main/image/3%20-%2000000002.jpg?raw=true"
              alt="Камера A — основной материал"
              loading="lazy"
            />
            <figcaption className="mono">
              <b>CAM A</b> / ОСНОВНОЙ МАТЕРИАЛ
            </figcaption>
          </figure>
          <figure>
            <img
              src="https://github.com/propellerprod/portfolio/blob/main/image/Тренировка%20в%20индустриальном%20фитнес-зале.png?raw=true"
              alt="Камера B — детали и backstage"
              loading="lazy"
            />
            <figcaption className="mono">
              <b>CAM B</b> / ДЕТАЛИ / BACKSTAGE
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
