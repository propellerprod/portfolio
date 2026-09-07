# Портфолио с видео из Rutube и VK Видео

Django-приложение для портфолио с поддержкой видео из **Rutube** и **VK Видео**.

## ✨ Возможности

- ✅ Добавление видео по ссылке (без скачивания файлов)
- ✅ Автоматическое получение превью (обложки) через API
- ✅ Кнопка в админке для извлечения обложки из видео
- ✅ Встраивание видео через iframe (16:9)
- ✅ Превью хранятся как URL, а не файлы
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Авто-определение источника видео (Rutube/VK)

## 🚀 Быстрый старт

```bash
# Миграции
python manage.py makemigrations portfolio
python manage.py migrate

# Запуск сервера
python manage.py runserver
```

Перейдите на:
- Сайт: http://localhost:8000/
- Админка: http://localhost:8000/admin/

## 📖 Полная инструкция

См. файл [INSTRUCTION.md](INSTRUCTION.md)

## 📁 Структура проекта

```
/workspace/
├── portfolio/              # Приложение портфолио
│   ├── models.py           # Модель PortfolioItem
│   ├── admin.py            # Админка с кнопкой превью
│   ├── views.py            # Views для списка и деталей
│   ├── urls.py             # URL маршруты
│   └── templates/
│       ├── admin/          # Шаблон админки с JS-кнопкой
│       └── portfolio/      # Шаблоны сайта
├── video_utils/            # Утилиты для работы с видео
│   └── api.py              # API Rutube и VK для превью
├── config/                 # Настройки Django
└── INSTRUCTION.md          # Подробная документация
```

## 🔑 Ключевые файлы

### `portfolio/models.py`
Модель `PortfolioItem` с полями:
- `video_url` - ссылка на видео
- `video_source` - источник (rutube/vk/other)
- `thumbnail_url` - URL обложки (не файл!)
- `use_auto_thumbnail` - авто-получение превью

### `portfolio/admin.py`
- Кнопка "📷 Получить превью из видео"
- AJAX-запрос к API для получения обложки
- Предпросмотр превью в админке

### `video_utils/api.py`
- `get_video_thumbnail()` - универсальная функция
- `get_rutube_thumbnail()` - превью Rutube
- `get_vk_video_thumbnail()` - превью VK
- `get_embed_url()` - URL для iframe

## 🎯 Как использовать в админке

1. Создайте новый элемент портфолио
2. Вставьте ссылку на видео (Rutube или VK)
3. Нажмите кнопку **"📷 Получить превью из видео"**
4. Сохраните изменения

## 🌐 Поддерживаемые форматы ссылок

**Rutube:**
- `https://rutube.ru/video/{id}/`
- `https://rutube.ru/play/embed/{id}/`

**VK Видео:**
- `https://vk.com/video-{owner_id}_{video_id}`
- `https://vk.com/video_ext.php?oid={owner_id}&id={video_id}`

## ⚙️ Требования

- Python 3.8+
- Django 4.2+
- requests (для API запросов)

## 📝 Лицензия

MIT
