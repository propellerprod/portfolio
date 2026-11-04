import { ServiceItem, PriceItem, Project, Collab } from '../types';

export const CATEGORIES: Record<string, string> = {
  concerts: 'КОНЦЕРТЫ',
  commercials: 'БЛОГЕРЫ',
  clips: 'КЛИПЫ',
  reels: 'REELS',
  other: 'ДРУГОЕ',
};

export const CONTACTS = {
  telegram: 'https://t.me/propunion',
  telegramChannel: 'https://t.me/propellerTG',
  whatsapp: 'https://wa.me/79102041086',
  vk: 'https://vk.ru/propeller.media',
  instagram: 'https://nethouse.id/propeller-prod',
  phone: 'tel:+79102041086',
  email: 'mailto:btdstream@gmail.com',
};

export const SERVICES: ServiceItem[] = [
  { n: '01', name: 'РЕКЛАМА', tags: 'РОЛИКИ / ПРОМО / ИМИДЖ', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/1ce9569b0-88ba-4849-8d27-aafe6a3b2723.png' },
  { n: '02', name: 'REELS', tags: 'SHORTS / TIKTOK / ВЕРТИКАЛЬ', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/14fe1f442-caaf-41f0-b920-7479cea0f12d.png' },
  { n: '03', name: 'YOUTUBE', tags: 'ИНТЕРВЬЮ / ПОДКАСТЫ / LONG', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/12c296023-039e-4002-9c9c-fdba6b324853.png' },
  { n: '04', name: 'КЛИПЫ', tags: 'МУЗЫКА / PERFOMANCE / VISUAL', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/10b2ec472-fb7d-40b6-8faf-7e8746d1079d.png' },
  { n: '05', name: 'КОНЦЕРТЫ', tags: 'МЕРОПРИЯТИЯ / АФТЕРМУВИ / BACKSTAGE', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/1d6cf2a57-22dc-49d3-934a-ebc1a07c1fce.png' },
  { n: '06', name: 'КОНТЕНТ', tags: 'ДЛЯ БИЗНЕСА / SMM / СЕРИИ', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/1207e6f50-8178-4023-a4da-555b4af7a6c4.png' },
  { n: '07', name: 'МОНТАЖ', tags: 'МОНТАЖ / ЦВЕТ / ЗВУК', img: 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/18994c49e-541f-426e-8f0f-254b2eeb5e8e.png' },
  { n: '08', name: 'ИДЕИ', tags: 'КОНЦЕПТ / СЦЕНАРИЙ / РЕЖИССУРА', img: 'https://github.com/propellerprod/portfolio/blob/main/image/IMG_5566.PNG?raw=true' },
];

export const PRICES: PriceItem[] = [
  {
    name: 'ПОЧАСОВАЯ',
    val: '5 000 ₽/ЧАС',
    forOne: 'почасовая съёмка — платите только за время',
    inc: ['2 оператора', 'набор оборудования', 'выезд на локацию', 'подготовка к съёмке', 'съёмка на локации', 'передача материала через облачное хранилище', 'хранение материала в течение месяца'],
    hot: false
  },
  {
    name: 'СМЕНА',
    val: 'ОТ 20 000 ₽',
    forOne: 'для съёмок на целый день / большого объёма контента',
    inc: ['2 оператора', '1 съёмочный день', 'идеи и сценарии', 'подготовка к съёмке', 'передача материала через облачное хранилище', 'хранение материала в течение месяца'],
    hot: false
  },
  {
    name: 'ПРОДАКШН',
    val: 'ОТ 35 000 ₽',
    forOne: 'полноценный рекламный / коммерческий проект',
    inc: ['концепция и сценарий', 'полный цикл производства', '2 оператора на площадке', 'монтаж, цвет, звук', 'версии под все площадки'],
    hot: true
  },
  {
    name: 'МОНТАЖ',
    val: 'ОТ 1 500 ₽',
    forOne: 'монтаж видео из вашего или нашего материала',
    inc: ['монтаж видео', 'цветокоррекция', 'обработка звука', 'графика', 'ретушь', 'любой формат видео'],
    hot: false
  },
  {
    name: 'CUSTOM',
    val: 'ПО ЗАПРОСУ',
    forOne: 'если проект нестандартный',
    inc: ['клип / мероприятие / YouTube', 'любой формат и хронометраж', 'смета от 24 часов'],
    hot: false
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    "id": "pfla6wenii",
    "title": "Optimum System 2",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/-hKOtQ0JKSQ/hqdefault.jpg",
    "thumbnail_url": "https://img.youtube.com/vi/-hKOtQ0JKSQ/hqdefault.jpg",
    "video_url": "https://youtube.com/shorts/-hKOtQ0JKSQ",
    "video_source": "youtube",
    "client": "Optimum System",
    "images": [],
    "links": [],
    "added": "2026-11-04"
  },
  {
    "id": "ptb1cprhaz",
    "title": "ARUSH CLIP",
    "category": "clips",
    "cover": "https://avatars.yandex.net/get-music-content/16485602/61c42506.a.41514784-1/600x600",
    "thumbnail_url": "https://avatars.yandex.net/get-music-content/16485602/61c42506.a.41514784-1/600x600",
    "video_url": "https://youtu.be/gOd90jXk-ek",
    "client": "ARUSH",
    "images": [],
    "links": [],
    "added": "2026-11-02"
  },
  {
    "id": "ploacikfra",
    "title": "RAREMOD",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/Z-c-FAZVGgg/hqdefault.jpg",
    "thumbnail_url": "https://img.youtube.com/vi/Z-c-FAZVGgg/hqdefault.jpg",
    "video_url": "https://youtube.com/shorts/Z-c-FAZVGgg",
    "video_source": "youtube",
    "client": "RAREMOD",
    "images": [],
    "links": [],
    "added": "2026-11-02"
  },
  {
    "id": "pmuzai7rfu5rc",
    "added": "2026-10-08",
    "title": "TWINS by Benzo Gang x Daily  Slime",
    "category": "concerts",
    "cover": "https://img.youtube.com/vi/OSmWgJstLyY/maxresdefault.jpg",
    "video_url": "https://youtu.be/OSmWgJstLyY",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "Benzo Gang x Daily  Slime",
    "format": "ДИДЖЕЙ СЕТЫ"
  },
  {
    "id": "pmvcf7gb2vz3z",
    "added": "2026-10-17",
    "title": "LILDRUGHILL MIKE",
    "category": "concerts",
    "cover": "https://img.youtube.com/vi/or8HCm6XuR0/maxresdefault.jpg",
    "video_url": "https://youtu.be/or8HCm6XuR0",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "LILDRUGHILL",
    "format": "ЗАКРЫТЫЙ ПОКАЗ АЛЬБОМА"
  },
  {
    "id": "pmtosc69ngr7r",
    "title": "John However",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/C-B7WWWUwFQ/maxresdefault.jpg",
    "video_url": "https://youtube.com/watch?v=C-B7WWWUwFQ",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "John However",
    "format": "рилсы к основному видео",
    "added": "2026-09-05"
  },
  {
    "id": "pmtopgy5ujqdw",
    "title": "RARE MOD 2",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/SY_hxMmUGtE/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/SY_hxMmUGtE",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "RARE MOD",
    "format": "REELS",
    "added": "2026-09-05"
  },
  {
    "id": "pmtopcbaxxd08",
    "title": "RARE MOD",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/-Bn48mJsLE8/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/-Bn48mJsLE8",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "RARE MOD",
    "format": "REELS",
    "added": "2026-09-05"
  },
  {
    "id": "pmtop78vc9i8q",
    "title": "PLAY GROUND",
    "category": "reels",
    "cover": "https://i.ytimg.com/vi/MQxRgPcWb_k/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/MQxRgPcWb_k",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "PLAY GROUND",
    "format": "REELS",
    "added": "2026-09-05"
  },
  {
    "id": "d5",
    "title": "LIL CRYSTALLL",
    "category": "concerts",
    "cover": "https://img.youtube.com/vi/b4kb1mtqbOA/maxresdefault.jpg",
    "video_url": "https://youtu.be/b4kb1mtqbOA",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "RUTEX",
    "format": "КОНЦЕРТ",
    "added": "2024-12-11",
    "task": "Передать энергию события тем, кого там не было.",
    "idea": "Снимать не сцену, а то, что между: руки, дым, свет, крик.",
    "process": "Двое на площадке → основная камера + детали → афтермуви за 72 часа."
  },
  {
    "id": "pmtop1tks5bb4",
    "title": "ROD AWARDS 2025",
    "category": "concerts",
    "cover": "https://img.youtube.com/vi/9PjdYXxxL1E/maxresdefault.jpg",
    "video_url": "https://youtu.be/9PjdYXxxL1E",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "ROD",
    "format": "КОНЦЕРТ/АФТЕРМУВИ",
    "added": "2026-09-05"
  },
  {
    "id": "pmtoonbt096ll",
    "title": "ROD DANCE",
    "category": "concerts",
    "cover": "https://img.youtube.com/vi/PoIZvteCbNs/maxresdefault.jpg",
    "video_url": "https://youtu.be/PoIZvteCbNs",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "ROD",
    "format": "ПРЕМИЯ/АФТЕРМУВИ",
    "added": "2026-09-05"
  },
  {
    "id": "p4ong7yu1t",
    "title": "Back soyuz77",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/YxM_4UciRgw/maxresdefault.jpg",
    "thumbnail_url": "https://img.youtube.com/vi/YxM_4UciRgw/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/YxM_4UciRgw?feature=share",
    "video_source": "youtube",
    "client": "soyuz__77",
    "images": [],
    "links": [],
    "added": "2026-11-02"
  },
  {
    "id": "d4",
    "title": "ШИЛО и Olegha77",
    "category": "commercials",
    "cover": "https://img.youtube.com/vi/La9zX2E-9dk/maxresdefault.jpg",
    "video_url": "https://youtu.be/La9zX2E-9dk?si=WyuvPZ9c3KClgKKw",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "ШИЛО и Olegha77",
    "format": "ПОДКАСТ",
    "added": "2025-08-14",
    "task": "Разговорное видео, которое досматривают.",
    "idea": "Тёмная студия, один источник света, крупные планы и паузы.",
    "process": "Сценарий вопросов → студийный свет → 2 камеры."
  },
  {
    "id": "d1",
    "title": "Neekich",
    "category": "commercials",
    "cover": "https://img.youtube.com/vi/Ue8b1kN8pM8/maxresdefault.jpg",
    "video_url": "https://www.youtube.com/watch?v=Ue8b1kN8pM8",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "Neekich",
    "format": "МОНТАЖ",
    "added": "2026-01-05",
    "task": "Показать продукт за 30–45 секунд так, чтобы зритель не свайпнул.",
    "idea": "Ночной город, мокрый асфальт, световые линии. Продукт — как главный герой фильма.",
    "process": "Концепция → локация → съёмка вдвоём (2 камеры) → монтаж и цвет в плёночном грейде."
  },
  {
    "id": "pmtonscgmp804",
    "title": "МЕЛАНЖ",
    "category": "clips",
    "cover": "https://img.youtube.com/vi/slvzvDgFoHo/maxresdefault.jpg",
    "video_url": "https://youtu.be/slvzvDgFoHo",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "МЕЛАНЖ",
    "format": "ТАНЦЫ",
    "added": "2026-09-05"
  },
  {
    "id": "pmtopjig0vy2c",
    "title": "СК КРЕПОСТЬ",
    "category": "reels",
    "cover": "https://i.ytimg.com/vi/rxxuZWrdUqE/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/rxxuZWrdUqE",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "СК КРЕПОСТЬ",
    "format": "REELS",
    "added": "2026-09-05"
  },
  {
    "id": "d6",
    "title": "MARK KUKLIN",
    "category": "reels",
    "cover": "https://img.youtube.com/vi/enWdHgOwopc/maxresdefault.jpg",
    "video_url": "https://youtube.com/shorts/enWdHgOwopc?feature=share",
    "video_source": "youtube",
    "images": [],
    "links": [],
    "client": "MARK KUKLIN",
    "format": "REELS",
    "added": "2024-09-30",
    "task": "Постоянный контент без выгорания автора.",
    "idea": "Формат-конструктор: рубрики, свет, монтаж.",
    "process": "Упаковка формата → съёмочный день на 8 роликов."
  }
];

export const DEFAULT_COLLABS: Collab[] = [
  {
    "name": "RUTEX MUSIC",
    "img": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/render/image/public/base44-prod/public/6969eec9d51ad9a77d059984/0fa94cc97_.png?width=1200&height=630&resize=contain",
    "links": []
  },
  {
    "name": "LILDRUGHILL",
    "img": "https://avatars.yandex.net/get-music-content/20712233/2ed6f6c3.p.5608970/300x300",
    "links": []
  },
  {
    "name": "RAREMOD",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREp1B8jj4QTylHM7FKBMQyKQVTRwqG2nK_jTiIYFz03w&s=10",
    "links": []
  },
  {
    "name": "Mark Kuklin",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpjuOmni2CAebxpljuTRJSTvcMV0aQhkIC-V5ZI__79DFGcUgxyxm5e0Hk&s=10",
    "links": []
  },
  {
    "name": "Lil Krystalll",
    "img": "https://img.readdork.com/ext/genius/aHR0cHM6Ly9pbWFnZXMuZ2VuaXVzLmNvbS81MDViMWZlM2NkYzJhZTI2ZGNmOGUyYWU2ZGJjYjEyNC4xMDAweDEwMDB4MS5wbmc?width=640",
    "links": []
  },
  {
    "name": "Olegha77",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjFJaulrbSkocUgl21VxObVScrJCaZp8NC3x0yGrlLeJ0jbJjXfLP4VFUA&s=10",
    "links": []
  },
  {
    "name": "ROD DANCE",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYjVs6dd7BDkmi07dn7Do_MYJjJtx_qN6xypQpqSeCHw&s",
    "links": []
  },
  {
    "name": "СК «КРЕПОСТЬ»",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnY_SclJBaZ96LNOrATYwtOoWT9WkCYBEUmgV2fo10DA&s",
    "links": []
  },
  {
    "name": "SLAVA MARLOW",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIPEyrrorcwtlTWJk4jb5HRNEIoxhaNP2QqjaJaKlAEY286999VEFFvxc&s=10",
    "links": []
  },
  {
    "name": "John However",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8OPhjkjPbRRwJpymAyMSQsNhaAp5-qLY1aGFPJB4rPxfjHF-7h2I9q0Q&s=10",
    "links": []
  }
];
