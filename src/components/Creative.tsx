import React from 'react';

const STEPS = ['ИДЕЯ', 'КОНЦЕПТ', 'СЦЕНАРИЙ', 'СЪЁМКА', 'МОНТАЖ', 'ПУБЛИКАЦИЯ'];

export const Creative: React.FC = () => {
  return (
    <section className="sec" id="creative">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">05 / КРЕАТИВ</span>
          <span className="mono">IDEA DEPT.</span>
        </div>
        <div className="cr-grid">
          <div>
            <h2 className="cr-big">
              НЕ ЗНАЕТЕ,<br />
              ЧТО СНИМАТЬ?<br />
              <span className="acc">ПРИДУМАЕМ.</span>
            </h2>
            <p className="svc-sub" style={{ marginTop: '5vh' }}>
              Можно прийти без готового сценария. Мы поможем придумать концепцию, формат, визуал и механику контента.
            </p>
          </div>
          <ul className="chain">
            {STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
