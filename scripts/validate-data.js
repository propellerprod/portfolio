/**
 * Data Schema and Syntax Validator for propellerprod/portfolio
 * Validates data/projects.json, data/collabs.json, and key assets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_CATEGORIES = new Set(['concerts', 'commercials', 'clips', 'reels', 'other']);

function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  str = str.trim();
  if (!str) return false;
  try {
    const u = new URL(str);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

let errors = [];

// 1. Validate data/projects.json
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');
try {
  const content = fs.readFileSync(projectsPath, 'utf8');
  const json = JSON.parse(content);

  if (!json || typeof json !== 'object') {
    errors.push('data/projects.json: Корневой объект должен быть JSON объектом');
  } else if (!Array.isArray(json.projects)) {
    errors.push('data/projects.json: Свойство "projects" должно быть массивом');
  } else {
    json.projects.forEach((p, idx) => {
      const prefix = `data/projects.json [индекс ${idx}, id: ${p.id || 'отсутствует'}]:`;
      if (!p.id || typeof p.id !== 'string') errors.push(`${prefix} Поле "id" обязательно и должно быть строкой`);
      if (!p.title || typeof p.title !== 'string') errors.push(`${prefix} Поле "title" обязательно и должно быть строкой`);
      if (!p.category || !VALID_CATEGORIES.has(p.category)) {
        errors.push(`${prefix} Неверная категория "${p.category}". Допустимы: ${Array.from(VALID_CATEGORIES).join(', ')}`);
      }
      if (p.cover && !isValidUrl(p.cover)) {
        errors.push(`${prefix} "cover" должен быть корректным HTTP/HTTPS URL, получено: "${p.cover}"`);
      }
      const video = p.video_url || p.video;
      if (video && !isValidUrl(video)) {
        errors.push(`${prefix} "video_url" должен быть корректным HTTP/HTTPS URL, получено: "${video}"`);
      }
      if (p.images) {
        if (!Array.isArray(p.images)) errors.push(`${prefix} "images" должно быть массивом`);
        else p.images.forEach((img, imgIdx) => {
          if (!isValidUrl(img)) errors.push(`${prefix} images[${imgIdx}] некорректный URL: "${img}"`);
        });
      }
      if (p.links) {
        if (!Array.isArray(p.links)) errors.push(`${prefix} "links" должно быть массивом`);
        else p.links.forEach((link, linkIdx) => {
          if (!isValidUrl(link)) errors.push(`${prefix} links[${linkIdx}] некорректный URL: "${link}"`);
        });
      }
    });
  }
} catch (e) {
  errors.push(`data/projects.json: Ошибка чтения или синтаксиса JSON: ${e.message}`);
}

// 2. Validate data/collabs.json
const collabsPath = path.join(__dirname, '..', 'data', 'collabs.json');
try {
  const content = fs.readFileSync(collabsPath, 'utf8');
  const json = JSON.parse(content);

  if (!json || typeof json !== 'object') {
    errors.push('data/collabs.json: Корневой объект должен быть JSON объектом');
  } else if (!Array.isArray(json.collabs)) {
    errors.push('data/collabs.json: Свойство "collabs" должно быть массивом');
  } else {
    json.collabs.forEach((c, idx) => {
      const prefix = `data/collabs.json [индекс ${idx}, имя: ${c.name || 'отсутствует'}]:`;
      if (!c.name || typeof c.name !== 'string') errors.push(`${prefix} Поле "name" обязательно`);
      if (c.img && !isValidUrl(c.img)) {
        errors.push(`${prefix} "img" должен быть корректным HTTP/HTTPS URL: "${c.img}"`);
      }
      if (c.links) {
        if (!Array.isArray(c.links)) errors.push(`${prefix} "links" должно быть массивом`);
        else c.links.forEach((link, linkIdx) => {
          if (!isValidUrl(link)) errors.push(`${prefix} links[${linkIdx}] некорректный URL: "${link}"`);
        });
      }
    });
  }
} catch (e) {
  errors.push(`data/collabs.json: Ошибка чтения или синтаксиса JSON: ${e.message}`);
}

// 3. Report Results
if (errors.length > 0) {
  console.error('❌ Ошибки валидации данных:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('✓ Валидация успешна: data/projects.json и data/collabs.json соответствуют канонической схеме.');
  process.exit(0);
}
