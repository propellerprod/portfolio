"""
Утилиты для получения превью видео с Rutube и VK Видео через API.
Все превью получаются как ссылки на изображения, без скачивания файлов.
"""

import re
import requests
from typing import Optional, Dict, Any


def extract_video_id_rutube(url: str) -> Optional[str]:
    """
    Извлекает ID видео из URL Rutube.
    
    Примеры URL:
    - https://rutube.ru/video/abc123def456/
    - https://rutube.ru/play/embed/abc123def456/
    """
    patterns = [
        r'rutube\.ru/video/([a-zA-Z0-9]+)/',
        r'rutube\.ru/play/embed/([a-zA-Z0-9]+)/',
        r'rutube\.ru/videos/([a-zA-Z0-9]+)/',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None


def extract_video_id_vk(url: str) -> Optional[str]:
    """
    Извлекает ID видео из URL VK Видео.
    
    Примеры URL:
    - https://vk.com/video-123456_789012345
    - https://vk.com/video_ext.php?oid=-123456&id=789012345
    """
    patterns = [
        r'vk\.com/video(-?\d+)_(\d+)',
        r'vk\.com/video_ext\.php\?oid=(-?\d+)&id=(\d+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            oid = match.group(1)
            video_id = match.group(2)
            return f"{oid}_{video_id}"
    
    return None


def get_rutube_thumbnail(video_url: str) -> Optional[str]:
    """
    Получает ссылку на превью (обложку) видео с Rutube через API.
    Возвращает URL изображения, не скачивая файл.
    
    API Rutube: https://api.rutube.ru/API/swagger/ui/index.html
    """
    video_id = extract_video_id_rutube(video_url)
    if not video_id:
        return None
    
    try:
        # Используем публичное API Rutube
        api_url = f"https://api.rutube.ru/api/video/{video_id}/"
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # Получаем URL превью из ответа API
            thumbnail_url = data.get('thumbnail_url') or data.get('image')
            
            if thumbnail_url:
                # Убеждаемся, что это абсолютный URL
                if thumbnail_url.startswith('//'):
                    thumbnail_url = 'https:' + thumbnail_url
                elif thumbnail_url.startswith('/'):
                    thumbnail_url = 'https://rutube.ru' + thumbnail_url
                
                return thumbnail_url
        
        # Альтернативный способ: используем стандартный формат URL превью
        # Rutube использует формат: https://pic.rutubelist.com/video/{id}/{id}.jpg
        return f"https://pic.rutubelist.com/video/{video_id}/{video_id}.jpg"
    
    except Exception as e:
        print(f"Error getting Rutube thumbnail: {e}")
        return None


def get_vk_video_thumbnail(video_url: str) -> Optional[str]:
    """
    Получает ссылку на превью (обложку) видео с VK Видео через API.
    Возвращает URL изображения, не скачивая файл.
    
    Для работы требуется токен VK API или использование публичных методов.
    """
    video_id = extract_video_id_vk(video_url)
    if not video_id:
        return None
    
    try:
        # Разбираем OID и video_id
        if '_' in video_id:
            oid, vid = video_id.split('_', 1)
        else:
            return None
        
        # Метод 1: Пытаемся получить через VK API (без токена для публичных видео)
        # Примечание: для продакшена рекомендуется использовать официальный VK API с токеном
        api_url = "https://api.vk.com/method/video.get"
        params = {
            'videos': f"{oid}_{vid}",
            'v': '5.131'
        }
        
        response = requests.get(api_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'response' in data and 'items' in data['response']:
                items = data['response']['items']
                if items:
                    video_info = items[0]
                    # Получаем изображение превью (наибольшее доступное)
                    thumbnail_url = (
                        video_info.get('image') or 
                        video_info.get('photo_130') or 
                        video_info.get('photo_320') or 
                        video_info.get('photo_640') or
                        video_info.get('photo_800')
                    )
                    
                    if isinstance(thumbnail_url, list) and thumbnail_url:
                        # Если это массив изображений, берем первое
                        thumbnail_url = thumbnail_url[0].get('url') if isinstance(thumbnail_url[0], dict) else thumbnail_url[0]
                    
                    if thumbnail_url:
                        return thumbnail_url
        
        # Метод 2: Альтернативный способ через oembed (для некоторых видео)
        oembed_url = "https://vk.com/video_ext.php"
        oembed_params = {
            'oid': oid,
            'id': vid,
            'hd': 2
        }
        
        # Пробуем получить превью из embed страницы
        # Это запасной вариант, если API не вернул результат
        return None
    
    except Exception as e:
        print(f"Error getting VK video thumbnail: {e}")
        return None
    
    return None


def get_video_thumbnail(video_url: str) -> Optional[Dict[str, Any]]:
    """
    Универсальная функция для получения превью видео.
    Автоматически определяет сервис и возвращает информацию о превью.
    
    Returns:
        Dict с ключами:
        - 'thumbnail_url': URL изображения превью
        - 'service': название сервиса ('rutube' или 'vk')
        - 'video_id': ID видео в сервисе
        Или None если не удалось получить превью
    """
    if not video_url:
        return None
    
    # Проверяем Rutube
    if 'rutube.ru' in video_url.lower():
        thumbnail_url = get_rutube_thumbnail(video_url)
        video_id = extract_video_id_rutube(video_url)
        
        if thumbnail_url or video_id:
            return {
                'thumbnail_url': thumbnail_url,
                'service': 'rutube',
                'video_id': video_id
            }
    
    # Проверяем VK Видео
    if 'vk.com' in video_url.lower() and '/video' in video_url.lower():
        thumbnail_url = get_vk_video_thumbnail(video_url)
        video_id = extract_video_id_vk(video_url)
        
        if thumbnail_url or video_id:
            return {
                'thumbnail_url': thumbnail_url,
                'service': 'vk',
                'video_id': video_id
            }
    
    return None


def get_embed_url_rutube(video_url: str) -> Optional[str]:
    """
    Получает URL для встраивания (embed) видео Rutube.
    """
    video_id = extract_video_id_rutube(video_url)
    if video_id:
        return f"https://rutube.ru/play/embed/{video_id}/"
    return None


def get_embed_url_vk(video_url: str) -> Optional[str]:
    """
    Получает URL для встраивания (embed) видео VK.
    """
    video_id = extract_video_id_vk(video_url)
    if video_id and '_' in video_id:
        oid, vid = video_id.split('_', 1)
        return f"https://vk.com/video_ext.php?oid={oid}&id={vid}&hd=2"
    return None


def get_embed_url(video_url: str) -> Optional[str]:
    """
    Универсальная функция для получения URL встраивания видео.
    """
    if 'rutube.ru' in video_url.lower():
        return get_embed_url_rutube(video_url)
    
    if 'vk.com' in video_url.lower() and '/video' in video_url.lower():
        return get_embed_url_vk(video_url)
    
    return None
