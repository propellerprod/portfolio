"""
Утилиты для получения метаданных и превью видео (Rutube, VK, YouTube, VK Clips).
"""

import re
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse

import requests


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
}


def _detect_source(url: str) -> Optional[str]:
    low = (url or "").lower()
    if "rutube.ru" in low:
        return "rutube"
    if "youtube.com" in low or "youtu.be" in low:
        return "youtube"
    if "vk.com" in low or "vkvideo.ru" in low:
        if "/clips" in low or "/clip" in low or "z=clip" in low:
            return "vk_clip"
        return "vk"
    return None


def extract_video_id_youtube(url: str) -> Optional[str]:
    patterns = [
        r"(?:youtube\.com/watch\?(?:.*&)?v=|youtu\.be/|youtube\.com/shorts/|youtube\.com/embed/)([A-Za-z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url or "")
        if match:
            return match.group(1)
    parsed = urlparse(url or "")
    vid = parse_qs(parsed.query).get("v", [None])[0]
    if vid and re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
        return vid
    return None


def extract_video_id_rutube(url: str) -> Optional[str]:
    patterns = [
        r"rutube\.ru/video/([a-zA-Z0-9]+)/?",
        r"rutube\.ru/play/embed/([a-zA-Z0-9]+)/?",
        r"rutube\.ru/videos/([a-zA-Z0-9]+)/?",
    ]
    for pattern in patterns:
        match = re.search(pattern, url or "")
        if match:
            return match.group(1)
    return None


def extract_video_id_vk(url: str, is_clip: bool = False) -> Optional[str]:
    text = url or ""
    patterns = [
        r"(?:vk\.com|vkvideo\.ru)/(?:video|clip)(-?\d+)_(\d+)",
        r"(?:vk\.com|vkvideo\.ru)/video_ext\.php\?[^#]*oid=(-?\d+)&id=(\d+)",
        r"[?&]z=(?:video|clip)(-?\d+)_(\d+)",
        r"(?:vk\.com|vkvideo\.ru)/clips?/clip(-?\d+)_(\d+)",
        r"(?:vk\.com|vkvideo\.ru)/clips(-?\d+)_(\d+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.I)
        if match:
            return f"{match.group(1)}_{match.group(2)}"
    return None


def is_youtube_shorts(url: str) -> bool:
    return "/shorts/" in (url or "").lower()


def is_vk_clip(url: str) -> bool:
    low = (url or "").lower()
    return "/clips" in low or "/clip" in low or "z=clip" in low


def _og_image(page_url: str) -> Optional[str]:
    try:
        response = requests.get(page_url, timeout=10, headers=HEADERS)
        if response.status_code != 200:
            return None
        html = response.text
        match = re.search(
            r'<meta[^>]+(?:property|name)=["\']og:image["\'][^>]+content=["\']([^"\']+)',
            html,
            flags=re.I,
        )
        if not match:
            match = re.search(
                r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']og:image["\']',
                html,
                flags=re.I,
            )
        if match:
            thumb = match.group(1)
            if thumb.startswith("//"):
                thumb = "https:" + thumb
            return thumb
    except Exception:
        return None
    return None


def get_rutube_thumbnail(video_url: str) -> Optional[str]:
    video_id = extract_video_id_rutube(video_url)
    if not video_id:
        return None
    fallback = f"https://pic.rutubelist.ru/video/{video_id}.jpg"
    try:
        api_url = f"https://rutube.ru/api/video/{video_id}/"
        response = requests.get(api_url, timeout=10, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            thumbnail_url = data.get("thumbnail_url") or data.get("image")
            if thumbnail_url:
                if thumbnail_url.startswith("//"):
                    thumbnail_url = "https:" + thumbnail_url
                elif thumbnail_url.startswith("/"):
                    thumbnail_url = "https://rutube.ru" + thumbnail_url
                return thumbnail_url
        og = _og_image(video_url)
        return og or fallback
    except Exception:
        return fallback


def get_vk_video_thumbnail(video_url: str) -> Optional[str]:
    try:
        og = _og_image(video_url)
        if og:
            return og
        video_id = extract_video_id_vk(video_url)
        if not video_id or "_" not in video_id:
            return None
        oid, vid = video_id.split("_", 1)
        api_url = "https://api.vk.com/method/video.get"
        params = {"videos": f"{oid}_{vid}", "v": "5.131"}
        response = requests.get(api_url, params=params, timeout=10, headers=HEADERS)
        if response.status_code != 200:
            return None
        data = response.json()
        items = (data.get("response") or {}).get("items") or []
        if not items:
            return None
        video_info = items[0]
        thumbnail_url = (
            video_info.get("image")
            or video_info.get("photo_800")
            or video_info.get("photo_640")
            or video_info.get("photo_320")
        )
        if isinstance(thumbnail_url, list) and thumbnail_url:
            first = thumbnail_url[0]
            thumbnail_url = first.get("url") if isinstance(first, dict) else first
        return thumbnail_url
    except Exception:
        return None


def get_youtube_thumbnail(video_url: str) -> Optional[str]:
    video_id = extract_video_id_youtube(video_url)
    if not video_id:
        return None
    return f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"


def get_vk_clip_thumbnail(video_url: str) -> Optional[str]:
    return get_vk_video_thumbnail(video_url)


def get_video_meta(url: str) -> Optional[Dict[str, Any]]:
    """
    Определяет сервис, извлекает ID и возвращает:
    {"thumbnail": str|None, "is_shorts": bool, "source": str, "video_id": str|None}
    """
    video_url = (url or "").strip()
    if not video_url:
        return None

    try:
        source = _detect_source(video_url)
        if source == "youtube":
            return {
                "thumbnail": get_youtube_thumbnail(video_url),
                "is_shorts": is_youtube_shorts(video_url),
                "source": "youtube",
                "video_id": extract_video_id_youtube(video_url),
            }
        if source == "rutube":
            return {
                "thumbnail": get_rutube_thumbnail(video_url),
                "is_shorts": False,
                "source": "rutube",
                "video_id": extract_video_id_rutube(video_url),
            }
        if source == "vk_clip":
            return {
                "thumbnail": get_vk_clip_thumbnail(video_url),
                "is_shorts": True,
                "source": "vk_clip",
                "video_id": extract_video_id_vk(video_url, is_clip=True),
            }
        if source == "vk":
            return {
                "thumbnail": get_vk_video_thumbnail(video_url),
                "is_shorts": False,
                "source": "vk",
                "video_id": extract_video_id_vk(video_url, is_clip=False),
            }
        return None
    except Exception:
        return None


def get_video_thumbnail(video_url: str) -> Optional[Dict[str, Any]]:
    meta = get_video_meta(video_url)
    if not meta:
        return None
    return {
        "thumbnail_url": meta.get("thumbnail"),
        "service": meta.get("source"),
        "video_id": meta.get("video_id"),
        "is_shorts": meta.get("is_shorts", False),
    }


def get_embed_url_rutube(video_url: str) -> Optional[str]:
    video_id = extract_video_id_rutube(video_url)
    if video_id:
        return f"https://rutube.ru/play/embed/{video_id}"
    return None


def get_embed_url_vk(video_url: str, is_clip: bool = False) -> Optional[str]:
    video_id = extract_video_id_vk(video_url, is_clip=is_clip)
    if video_id and "_" in video_id:
        oid, vid = video_id.split("_", 1)
        return f"https://vk.com/video_ext.php?oid={oid}&id={vid}"
    return None


def get_embed_url_youtube(video_url: str) -> Optional[str]:
    video_id = extract_video_id_youtube(video_url)
    if video_id:
        return f"https://www.youtube.com/embed/{video_id}"
    return None


def get_embed_url(video_url: str) -> Optional[str]:
    if not video_url:
        return None
    source = _detect_source(video_url)
    if source == "rutube":
        return get_embed_url_rutube(video_url)
    if source in ("vk", "vk_clip"):
        return get_embed_url_vk(video_url, is_clip=(source == "vk_clip"))
    if source == "youtube":
        return get_embed_url_youtube(video_url)
    return None
