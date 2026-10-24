import { Project, VideoMeta } from '../types';

export const BACKSTAGE_DEFAULT_IMG = 'https://image.qwenlm.ai/public_source/242ddf5f-4cf2-49d3-86cc-5748520c5b5a/18994c49e-541f-426e-8f0f-254b2eeb5e8e.png';

export function toEmbed(url?: string): string {
  if (!url) return '';
  url = url.trim();

  if (
    /youtube\.com\/embed\//i.test(url) ||
    /video_ext\.php/i.test(url) ||
    /rutube\.ru\/play\/embed\//i.test(url) ||
    /player\.vimeo\.com\/video\//i.test(url)
  ) {
    return url;
  }

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/i);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&controls=1&playsinline=1&enablejsapi=1`;
  }

  // Rutube
  const rtMatch = url.match(/rutube\.ru\/(?:video\/private|video|play\/embed|shorts|pl|videos)\/([a-zA-Z0-9]{16,40})/i);
  if (rtMatch && rtMatch[1]) {
    return `https://rutube.ru/play/embed/${rtMatch[1]}/?autoplay=1&playsinline=1`;
  }

  // Vimeo
  const vimMatch = url.match(/vimeo\.com\/(?:video\/)?(\d{5,12})/i);
  if (vimMatch && vimMatch[1]) {
    return `https://player.vimeo.com/video/${vimMatch[1]}?autoplay=1&playsinline=1`;
  }

  // VK Video & VK Clips
  const vkMatch = url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/(?:video|clip|clips\/clip)\/?(-?\d+)_(\d+)/i) ||
                  url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/video_ext\.php\?(?:.*&)?oid=(-?\d+)(?:.*&)?id=(\d+)/i) ||
                  url.match(/[?&]z=(?:video|clip)(-?\d+)_(\d+)/i);
  if (vkMatch && vkMatch[1] && vkMatch[2]) {
    return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}&autoplay=1&hd=2`;
  }

  return '';
}

export function toMutedLoopEmbed(url?: string): string {
  if (!url) return '';
  url = url.trim();

  // YouTube - instant autoplay, muted loop, playsinline, enablejsapi
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/i);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&disablekb=1&fs=0&enablejsapi=1`;
  }

  // Rutube
  const rtMatch = url.match(/rutube\.ru\/(?:video\/private|video|play\/embed|shorts|pl|videos)\/([a-zA-Z0-9]{16,40})/i);
  if (rtMatch && rtMatch[1]) {
    return `https://rutube.ru/play/embed/${rtMatch[1]}/?autoplay=1&mute=1&controls=0&loop=1&playsinline=1`;
  }

  // Vimeo
  const vimMatch = url.match(/vimeo\.com\/(?:video\/)?(\d{5,12})/i);
  if (vimMatch && vimMatch[1]) {
    return `https://player.vimeo.com/video/${vimMatch[1]}?autoplay=1&muted=1&loop=1&background=1&autopause=0&playsinline=1`;
  }

  // VK Video & VK Clips
  const vkMatch = url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/(?:video|clip|clips\/clip)\/?(-?\d+)_(\d+)/i) ||
                  url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/video_ext\.php\?(?:.*&)?oid=(-?\d+)(?:.*&)?id=(\d+)/i) ||
                  url.match(/[?&]z=(?:video|clip)(-?\d+)_(\d+)/i);
  if (vkMatch && vkMatch[1] && vkMatch[2]) {
    return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}&autoplay=1&mute=1&hd=1`;
  }

  return toEmbed(url);
}

export function isShorts(p?: Project | null): boolean {
  if (!p) return false;
  if (p.category === 'reels') return true;
  const f = (p.format || '').toUpperCase();
  if (
    f.includes('REELS') ||
    f.includes('SHORTS') ||
    f.includes('TIKTOK') ||
    f.includes('ВЕРТИКАЛ') ||
    f.includes('ВК КЛИП') ||
    f.includes('VK КЛИП')
  ) {
    return true;
  }
  const v = (p.video_url || p.video || '').toLowerCase();
  if (
    v.includes('/shorts/') ||
    v.includes('tiktok.com') ||
    v.includes('vk.com/clip-') ||
    v.includes('vk.com/clips/') ||
    v.includes('vkvideo.ru/clip-')
  ) {
    return true;
  }
  const t = (p.title || '').toUpperCase();
  if (t.includes('REELS') || t.includes('SHORTS') || t.includes('TIKTOK')) {
    return true;
  }
  return false;
}

export function getCover(p?: Project | null): string {
  if (!p) return BACKSTAGE_DEFAULT_IMG;
  const c = (p.cover || p.thumbnail_url || '').trim();
  if (c) return c;
  const v = (p.video_url || p.video || '').trim();
  if (v) {
    const yt = v.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/i);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
    const rt = v.match(/rutube\.ru\/(?:video\/private|video|play\/embed|shorts|pl|videos)\/([a-zA-Z0-9]{16,40})/i);
    if (rt) return `https://pic.rutubelist.ru/video/${rt[1]}.jpg`;
  }
  return BACKSTAGE_DEFAULT_IMG;
}

export async function fetchVideoMeta(url: string): Promise<VideoMeta> {
  // Try server endpoint first
  try {
    const res = await fetch('/api/get-video-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) return data;
    }
  } catch {
    // fallback to client-side extraction
  }

  // Client-side fallback
  const clean = url.trim();
  const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      success: true,
      service: 'youtube',
      source: 'youtube',
      video_id: videoId,
      is_shorts: clean.toLowerCase().includes('/shorts/'),
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embed_url: `https://www.youtube.com/embed/${videoId}`
    };
  }

  const rtMatch = clean.match(/rutube\.ru\/(?:video\/private|video|play\/embed|shorts|pl|videos)\/([A-Za-z0-9]+)/i);
  if (rtMatch && rtMatch[1]) {
    const videoId = rtMatch[1];
    return {
      success: true,
      service: 'rutube',
      source: 'rutube',
      video_id: videoId,
      is_shorts: clean.toLowerCase().includes('/shorts/'),
      thumbnail: `https://pic.rutubelist.ru/video/${videoId}.jpg`,
      thumbnail_url: `https://pic.rutubelist.ru/video/${videoId}.jpg`,
      embed_url: `https://rutube.ru/play/embed/${videoId}/`
    };
  }

  const vkMatch = clean.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/(?:clip|clips\/clip)\/?(-?\d+)_(\d+)/i) ||
                  clean.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/(?:video|video_ext\.php\?(?:.*&)?oid=)\/?(-?\d+)[_&](?:id=)?(\d+)/i) ||
                  clean.match(/[?&]z=(?:clip|video)(-?\d+)_(\d+)/i);
  if (vkMatch && vkMatch[1] && vkMatch[2]) {
    const isClip = clean.includes('/clip');
    return {
      success: true,
      service: isClip ? 'vk_clip' : 'vk',
      source: 'vk',
      video_id: `${vkMatch[1]}_${vkMatch[2]}`,
      is_shorts: isClip,
      thumbnail: null,
      thumbnail_url: null,
      embed_url: `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}&hd=2`
    };
  }

  const vimeoMatch = clean.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      success: true,
      service: 'vimeo',
      source: 'vimeo',
      video_id: vimeoMatch[1],
      is_shorts: false,
      thumbnail: null,
      thumbnail_url: null,
      embed_url: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  throw new Error('Не удалось определить сервис видео (поддерживаются YouTube, Rutube, VK, Vimeo)');
}
