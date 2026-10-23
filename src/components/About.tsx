import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono">01 / КТО МЫ</span>
          <span className="mono">МОСКВА — ОРЁЛ</span>
        </div>
        <h2 className="h-mega h-sec">МЫ — ПРОПЕЛЛЕРА.</h2>
        <div className="about-grid">
          <div className="about-lines">
            ДВА ЧЕЛОВЕКА.<br />
            <span className="outl">ДВЕ КАМЕРЫ.</span><br />
            ОДНА КОМАНДА.
          </div>
          <div className="about-text">
            <p>
              Мы закрываем производство видео <b>от идеи до готового ролика</b>. Не ждём готового ТЗ — сами придумываем концепцию, сценарий и визуальный стиль. Потом снимаем. Потом доводим до результата.
            </p>
          </div>
        </div>
        <div className="eq">
          <div className="eq-num h-mega">
            2 <span className="eq-sign">=</span> 1
          </div>
          <p className="eq-cap mono">
            ДВА УНИВЕРСАЛЬНЫХ СПЕЦИАЛИСТА НА ПЛОЩАДКЕ — <b>ПО ЦЕНЕ ОДНОГО ОПЕРАТОРА</b>.
          </p>
        </div>
      </div>
    </section>
  );
};
