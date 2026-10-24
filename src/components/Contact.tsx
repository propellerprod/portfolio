import React from 'react';
import { CONTACTS } from '../data/constants';

export const Contact: React.FC = () => {
  const contactChannels = [
    {
      label: 'TELEGRAM',
      value: '@propunion',
      note: 'САМЫЙ ОПЕРАТИВНЫЙ ОТВЕТ',
      href: CONTACTS.telegram,
    },
    {
      label: 'INSTAGRAM',
      value: 'НАШИ ПРОФИЛИ',
      note: 'БЭКСТЕЙДЖ И СТОРИС',
      href: CONTACTS.instagram,
    },
    {
      label: 'EMAIL',
      value: 'BTDSTREAM@GMAIL.COM',
      note: 'КП, СЦЕНАРИИ И СОТРУДНИЧЕСТВО',
      href: CONTACTS.email,
    },
  ];

  return (
    <section className="bw-section" id="contact">
      <div className="bw-container">
        <div className="bw-section-header">
          <h2 className="bw-section-title">КОНТАКТЫ</h2>
          <span className="bw-section-subtitle">СВЯЗАТЬСЯ НАПРЯМУЮ С ПРОДАКШНОМ</span>
        </div>

        {/* Большая плашка: НАШ ТЕЛЕГРАММ КАНАЛ */}
        <a
          href={CONTACTS.telegramChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="bw-tg-banner"
          aria-label="Наш телеграмм канал t.me/propellerTG"
        >
          <div className="bw-tg-banner-left">
            <span className="bw-tg-banner-tag">[ ОФИЦИАЛЬНЫЙ ТЕЛЕГРАМ-КАНАЛ ]</span>
            <h3 className="bw-tg-banner-title">НАШ ТЕЛЕГРАМ КАНАЛ</h3>
            <p className="bw-tg-banner-desc">
              Бэкстейджи со съёмок, премьеры, анонсы релизов и закулисье продакшна в реальном времени.
            </p>
          </div>

          <div className="bw-tg-banner-right">
            <span className="bw-tg-banner-handle">t.me/propellerTG</span>
            <span className="bw-tg-banner-btn">
              ПОДПИСАТЬСЯ ↗
            </span>
          </div>
        </a>

        <div className="bw-contact-grid">
          {contactChannels.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bw-contact-card"
            >
              <div className="bw-contact-card-top">
                <span className="bw-contact-label">{item.label}</span>
                <span className="bw-arrow-link" aria-hidden="true">↗</span>
              </div>
              <div className="bw-contact-value">{item.value}</div>
              <div className="bw-contact-note">{item.note}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
