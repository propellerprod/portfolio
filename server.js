import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path helpers
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const COLLABS_FILE = path.join(DATA_DIR, 'collabs.json');

/**
 * Extract metadata for video URLs: YouTube, Rutube, VK Video, VK Clips, Vimeo
 */
async function extractVideoMeta(rawUrl) {
  const url = (rawUrl || '').trim();
  if (!url) {
    throw new Error('URL видео не указан');
  }

  // 1. YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const isShorts = url.toLowerCase().includes('/shorts/');
    return {
      success: true,
      service: 'youtube',
      source: 'youtube',
      video_id: videoId,
      is_shorts: isShorts,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embed_url: `https://www.youtube.com/embed/${videoId}`
    };
  }

  // 2. Rutube
  const rutubeMatch = url.match(/rutube\.ru\/(?:video|play\/embed)\/([A-Za-z0-9]+)/i);
  if (rutubeMatch && rutubeMatch[1]) {
    const videoId = rutubeMatch[1];
    let thumb = `https://pic.rutubelist.ru/video/${videoId}.jpg`;
    try {
      const resp = await fetch(`https://rutube.ru/api/video/${videoId}/`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(4000)
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.thumbnail_url || data.cover_url) {
          thumb = data.thumbnail_url || data.cover_url;
        }
      }
    } catch {
      // Use fallback thumbnail
    }

    return {
      success: true,
      service: 'rutube',
      source: 'rutube',
      video_id: videoId,
      is_shorts: false,
      thumbnail: thumb,
      thumbnail_url: thumb,
      embed_url: `https://rutube.ru/play/embed/${videoId}/`
    };
  }

  // 3. VK Video and Clips
  const vkClipMatch = url.match(/(?:vk\.com|vkvideo\.ru)\/(?:clip|clips\/clip)(-?\d+)_(\d+)/i);
  const vkVideoMatch = url.match(/(?:vk\.com|vkvideo\.ru)\/(?:video|video_ext\.php\?(?:.*&)?oid=)(-?\d+)[_&](?:id=)?(\d+)/i);
  
  if (vkClipMatch || vkVideoMatch) {
    const match = vkClipMatch || vkVideoMatch;
    const isClip = Boolean(vkClipMatch) || url.toLowerCase().includes('/clip');
    const oid = match[1];
    const id = match[2];
    const videoId = `${oid}_${id}`;
    let thumb = '';

    // Try fetching page HTML for og:image
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
        signal: AbortSignal.timeout(4000)
      });
      if (resp.ok) {
        const html = await resp.text();
        const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                        html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
        if (ogMatch && ogMatch[1]) {
          thumb = ogMatch[1].replace(/&amp;/g, '&');
        }
      }
    } catch {
      // Ignored
    }

    return {
      success: true,
      service: isClip ? 'vk_clip' : 'vk',
      source: isClip ? 'vk_clip' : 'vk',
      video_id: videoId,
      is_shorts: isClip,
      thumbnail: thumb || null,
      thumbnail_url: thumb || null,
      embed_url: `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`
    };
  }

  // 4. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    let thumb = '';
    try {
      const resp = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`, {
        signal: AbortSignal.timeout(4000)
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data[0]?.thumbnail_large) {
          thumb = data[0].thumbnail_large;
        }
      }
    } catch {
      // Ignored
    }

    return {
      success: true,
      service: 'vimeo',
      source: 'vimeo',
      video_id: videoId,
      is_shorts: false,
      thumbnail: thumb || null,
      thumbnail_url: thumb || null,
      embed_url: `https://player.vimeo.com/video/${videoId}`
    };
  }

  throw new Error('Неподдерживаемый сервис видео (поддерживаются YouTube, Rutube, VK, Vimeo)');
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Get video metadata
const handleVideoMeta = async (req, res) => {
  const url = req.body?.url || req.body?.video_url || req.query?.url || req.query?.video_url;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Параметр url обязателен' });
  }

  try {
    const meta = await extractVideoMeta(url);
    res.json(meta);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Ошибка обработки видео' });
  }
};

app.post('/api/get-video-meta/', handleVideoMeta);
app.get('/api/get-video-meta/', handleVideoMeta);
app.post('/api/get-video-meta', handleVideoMeta);
app.get('/api/get-video-meta', handleVideoMeta);

// API: Get/Update projects
app.get('/api/projects', async (req, res) => {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(raw);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось прочитать projects.json', details: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const data = req.body;
    if (!data || !Array.isArray(data.projects)) {
      return res.status(400).json({ error: 'Некорректная структура: ожидается объект с полем projects' });
    }
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, count: data.projects.length });
  } catch (err) {
    res.status(500).json({ error: 'Не удалось сохранить projects.json', details: err.message });
  }
});

// API: Get/Update collabs
app.get('/api/collabs', async (req, res) => {
  try {
    const raw = await fs.readFile(COLLABS_FILE, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(raw);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось прочитать collabs.json', details: err.message });
  }
});

app.post('/api/collabs', async (req, res) => {
  try {
    const data = req.body;
    if (!data || !Array.isArray(data.collabs)) {
      return res.status(400).json({ error: 'Некорректная структура: ожидается объект с полем collabs' });
    }
    await fs.writeFile(COLLABS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, count: data.collabs.length });
  } catch (err) {
    res.status(500).json({ error: 'Не удалось сохранить collabs.json', details: err.message });
  }
});

// Explicit Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
app.get('/admin/test-auth.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'test-auth.html'));
});

// Static assets
app.use(express.static(__dirname, {
  index: 'index.html',
  maxAge: 0
}));

// Fallback for SPA navigation
app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PROPELLER] Сервер успешно запущен на порту ${PORT}`);
});
