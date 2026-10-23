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
      label: 'WHATSAPP',
      value: '+7 (910) 204-10-86',
      note: 'ЧАТ И ВИДЕОЗВОНКИ',
      href: CONTACTS.whatsapp,
    },
    {
      label: 'VKONTAKTE',
      value: 'vk.ru/propeller.media',
      note: 'ОФИЦИАЛЬНОЕ СООБЩЕСТВО',
      href: CONTACTS.vk,
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
      note: 'КП И СЦЕНАРИИ',
      href: CONTACTS.email,
    },
    {
      label: 'ТЕЛЕФОН',
      value: '+7 (910) 204-10-86',
      note: 'МОСКВА × ОРЁЛ',
      href: CONTACTS.phone,
    },
  ];

  return (
    <section className="bw-section" id="contact">
      <div className="bw-container">
        <div className="bw-section-header">
          <h2 className="bw-section-title">КОНТАКТЫ</h2>
          <span className="bw-section-subtitle">СВЯЗАТЬСЯ НАПРЯМУЮ С ПРОДАКШНОМ</span>
        </div>

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
