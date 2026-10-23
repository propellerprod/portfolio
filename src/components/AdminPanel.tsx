import React, { useState } from 'react';
import { Project, Collab } from '../types';
import { CATEGORIES } from '../data/constants';
import { fetchVideoMeta } from '../utils/video';
import { PropellerIcon } from './PropellerIcon';

interface AdminPanelProps {
  projects: Project[];
  collabs: Collab[];
  onSaveProjects: (newProjects: Project[]) => void;
  onSaveCollabs: (newCollabs: Collab[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  collabs,
  onSaveProjects,
  onSaveCollabs,
  onClose,
}) => {
  const [screen, setScreen] = useState<'dash' | 'list' | 'edit-project' | 'edit-collab'>('dash');
  const [selectedCat, setSelectedCat] = useState<string>('concerts');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCollab, setEditingCollab] = useState<Collab | null>(null);
  const [editingCollabIndex, setEditingCollabIndex] = useState<number | null>(null);

  // Form states for project
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('concerts');
  const [formCover, setFormCover] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formVideoSource, setFormVideoSource] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formFormat, setFormFormat] = useState('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [formLinks, setFormLinks] = useState<string[]>([]);

  // Form states for collab
  const [formCollabName, setFormCollabName] = useState('');
  const [formCollabImg, setFormCollabImg] = useState('');
  const [formCollabLinks, setFormCollabLinks] = useState<string[]>([]);

  // Status & toast
  const [videoFetching, setVideoFetching] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'project' | 'collab'; idOrIdx: any; text: string } | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCategory = (catKey: string) => {
    setSelectedCat(catKey);
    setScreen('list');
  };

  const handleStartAddProject = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormCat(selectedCat || 'concerts');
    setFormCover('');
    setFormVideoUrl('');
    setFormVideoSource('');
    setFormClient('');
    setFormFormat('');
    setFormPhotos([]);
    setFormLinks([]);
    setStatusMsg('');
    setScreen('edit-project');
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProject(p);
    setFormTitle(p.title || '');
    setFormCat(p.category || 'concerts');
    setFormCover(p.cover || p.thumbnail_url || '');
    setFormVideoUrl(p.video_url || p.video || '');
    setFormVideoSource(p.video_source || '');
    setFormClient(p.client || '');
    setFormFormat(p.format || '');
    setFormPhotos(p.images ? [...p.images] : []);
    setFormLinks(p.links ? [...p.links] : []);
    setStatusMsg('');
    setScreen('edit-project');
  };

  const handleStartAddCollab = () => {
    setEditingCollab(null);
    setEditingCollabIndex(null);
    setFormCollabName('');
    setFormCollabImg('');
    setFormCollabLinks([]);
    setScreen('edit-collab');
  };

  const handleStartEditCollab = (c: Collab, idx: number) => {
    setEditingCollab(c);
    setEditingCollabIndex(idx);
    setFormCollabName(c.name || '');
    setFormCollabImg(c.img || '');
    setFormCollabLinks(c.links ? [...c.links] : []);
    setScreen('edit-collab');
  };

  // Video auto-thumbnail extraction
  const handleGetThumb = async () => {
    if (!formVideoUrl.trim()) {
      setStatusMsg('Сначала введите ссылку на видео');
      return;
    }
    setVideoFetching(true);
    setStatusMsg('Получение информации о видео через API...');
    try {
      const meta = await fetchVideoMeta(formVideoUrl.trim());
      if (meta.thumbnail_url || meta.thumbnail) {
        const thumb = meta.thumbnail_url || meta.thumbnail;
        setFormCover(thumb!);
        if (meta.source) setFormVideoSource(meta.source);
        setStatusMsg(`✓ Превью получено (${meta.service})`);
        showToast('Превью успешно получено!');
      } else {
        setStatusMsg('Превью не найдено сервисом');
      }
    } catch (err: any) {
      setStatusMsg('Ошибка получения: ' + (err.message || 'сетевая ошибка'));
    } finally {
      setVideoFetching(false);
    }
  };

  // Save project
  const handleSaveProject = () => {
    if (!formTitle.trim()) {
      setStatusMsg('Название проекта обязательно!');
      return;
    }

    const updatedProjects = [...projects];
    if (editingProject) {
      const idx = updatedProjects.findIndex((p) => p.id === editingProject.id);
      if (idx >= 0) {
        updatedProjects[idx] = {
          ...editingProject,
          title: formTitle.trim(),
          category: formCat,
          cover: formCover.trim(),
          thumbnail_url: formCover.trim(),
          video_url: formVideoUrl.trim(),
          video_source: formVideoSource || undefined,
          client: formClient.trim() || undefined,
          format: formFormat.trim() || undefined,
          images: formPhotos.filter((s) => s.trim().length > 0),
          links: formLinks.filter((s) => s.trim().length > 0),
        };
      }
    } else {
      const newId = 'p' + Math.random().toString(36).substring(2, 11);
      const newProj: Project = {
        id: newId,
        title: formTitle.trim(),
        category: formCat,
        cover: formCover.trim(),
        thumbnail_url: formCover.trim(),
        video_url: formVideoUrl.trim(),
        video_source: formVideoSource || undefined,
        client: formClient.trim() || undefined,
        format: formFormat.trim() || undefined,
        images: formPhotos.filter((s) => s.trim().length > 0),
        links: formLinks.filter((s) => s.trim().length > 0),
        added: new Date().toISOString().slice(0, 10),
      };
      updatedProjects.unshift(newProj);
    }

    onSaveProjects(updatedProjects);
    showToast('Проект сохранён!');
    setScreen('list');
  };

  // Delete project
  const handleDeleteProjectConfirmed = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    onSaveProjects(next);
    showToast('Проект удалён');
    setConfirmDelete(null);
  };

  // Reorder project within category
  const handleMoveProject = (id: string, delta: number) => {
    const catProjects = projects.filter((p) => p.category === selectedCat);
    const catIdx = catProjects.findIndex((p) => p.id === id);
    if (catIdx < 0) return;
    const targetCatIdx = catIdx + delta;
    if (targetCatIdx < 0 || targetCatIdx >= catProjects.length) return;

    const p1 = catProjects[catIdx];
    const p2 = catProjects[targetCatIdx];
    const gIdx1 = projects.findIndex((p) => p.id === p1.id);
    const gIdx2 = projects.findIndex((p) => p.id === p2.id);

    const next = [...projects];
    next[gIdx1] = p2;
    next[gIdx2] = p1;

    onSaveProjects(next);
  };

  // Save collab
  const handleSaveCollab = () => {
    if (!formCollabName.trim()) {
      showToast('Имя коллаборации обязательно', true);
      return;
    }
    const next = [...collabs];
    const cItem: Collab = {
      name: formCollabName.trim(),
      img: formCollabImg.trim() || undefined,
      links: formCollabLinks.filter((s) => s.trim().length > 0),
    };

    if (editingCollabIndex !== null && editingCollabIndex >= 0) {
      next[editingCollabIndex] = cItem;
    } else {
      next.unshift(cItem);
    }

    onSaveCollabs(next);
    showToast('Коллаборация сохранена!');
    setScreen('dash');
  };

  // Delete collab
  const handleDeleteCollabConfirmed = (index: number) => {
    const next = collabs.filter((_, i) => i !== index);
    onSaveCollabs(next);
    showToast('Коллаборация удалена');
    setConfirmDelete(null);
  };

  const catProjects = projects.filter((p) => p.category === selectedCat);

  return (
    <div className="admin-container" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header className="a-head">
        <div className="a-logo">
          <PropellerIcon />
          <span>ПРОПЕЛЛЕР UNION / АДМИН</span>
        </div>
        <div className="a-actions">
          <span className="mono" style={{ color: 'var(--ice)' }}>● РЕЖИМ УПРАВЛЕНИЯ</span>
          <button className="btn" onClick={onClose}>
            ВЕРНУТЬСЯ НА САЙТ ↗
          </button>
        </div>
      </header>

      {/* DASHBOARD */}
      {screen === 'dash' && (
        <section>
          <div className="mono a-crumb">[ АДМИН / КАТЕГОРИИ ]</div>
          <h1 className="a-title">КАТЕГОРИИ</h1>
          <button className="btn btn-acc" onClick={handleStartAddProject}>
            + ДОБАВИТЬ ПРОЕКТ
          </button>

          <div className="cat-grid">
            {Object.entries(CATEGORIES).map(([key, name]) => {
              const count = projects.filter((p) => p.category === key).length;
              return (
                <button
                  key={key}
                  className="cat-card"
                  onClick={() => handleOpenCategory(key)}
                >
                  <div className="mono">[ {key.toUpperCase()} ]</div>
                  <div className="n">{name}</div>
                  <div className="mono" style={{ color: 'var(--ice)' }}>
                    {count} ПРОЕКТОВ →
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
            <h1 className="a-title" style={{ fontSize: 'clamp(20px, 4vw, 32px)' }}>
              КОЛЛАБОРАЦИИ ({collabs.length})
            </h1>
            <button className="btn btn-acc" onClick={handleStartAddCollab}>
              + ДОБАВИТЬ КОЛЛАБОРАЦИЮ
            </button>
            <div className="cat-grid" style={{ marginTop: '14px' }}>
              {collabs.map((c, i) => (
                <div key={i} className="cat-card">
                  <div className="n" style={{ fontSize: '15px' }}>{c.name}</div>
                  <div className="mono">{c.links && c.links.length ? `${c.links.length} ссылок` : 'Без ссылок'}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button className="mini" onClick={() => handleStartEditCollab(c, i)}>
                      РЕДАКТИРОВАТЬ
                    </button>
                    <button
                      className="mini del"
                      onClick={() => setConfirmDelete({ type: 'collab', idOrIdx: i, text: `Удалить "${c.name}"?` })}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECT LIST */}
      {screen === 'list' && (
        <section>
          <div className="mono a-crumb">
            <button
              onClick={() => setScreen('dash')}
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
            >
              [ ← КАТЕГОРИИ ]
            </button>
          </div>
          <h1 className="a-title">
            {CATEGORIES[selectedCat] || selectedCat}
          </h1>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <button className="btn btn-acc" onClick={handleStartAddProject}>
              + ДОБАВИТЬ ПРОЕКТ
            </button>
            <span className="mono" style={{ alignSelf: 'center' }}>
              ПОРЯДОК: СОРТИРОВКА КНОПКАМИ ↑ ↓
            </span>
          </div>

          <div>
            {catProjects.length === 0 ? (
              <div className="mono" style={{ padding: '30px 0', color: 'var(--dim)' }}>
                [ В этой категории нет проектов. Нажмите «+ Добавить проект». ]
              </div>
            ) : (
              catProjects.map((p, idx) => (
                <div key={p.id} className="row">
                  <div className="mono" style={{ textAlign: 'center' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    {p.cover || p.thumbnail_url ? (
                      <img
                        className="thumb"
                        src={p.cover || p.thumbnail_url}
                        alt=""
                      />
                    ) : (
                      <div className="noimg">НЕТ ФОТО</div>
                    )}
                  </div>
                  <div className="bd">
                    <div className="t">{p.title}</div>
                    <div className="m">
                      {p.client || 'ПРОПЕЛЛЕР UNION'} • {p.format || CATEGORIES[p.category]}
                    </div>
                  </div>
                  <div className="ops">
                    <button
                      className="mini"
                      disabled={idx === 0}
                      onClick={() => handleMoveProject(p.id, -1)}
                      title="Выше"
                    >
                      ↑
                    </button>
                    <button
                      className="mini"
                      disabled={idx === catProjects.length - 1}
                      onClick={() => handleMoveProject(p.id, 1)}
                      title="Ниже"
                    >
                      ↓
                    </button>
                    <button
                      className="mini"
                      onClick={() => handleStartEditProject(p)}
                    >
                      РЕД.
                    </button>
                    <button
                      className="mini del"
                      onClick={() => setConfirmDelete({ type: 'project', idOrIdx: p.id, text: `Удалить проект "${p.title}"?` })}
                    >
                      УДАЛИТЬ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* PROJECT EDITOR */}
      {screen === 'edit-project' && (
        <section>
          <div className="mono a-crumb">
            <button
              onClick={() => setScreen('list')}
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
            >
              [ ← НАЗАД К СПИСКУ ]
            </button>
          </div>
          <h1 className="a-title">
            {editingProject ? 'РЕДАКТИРОВАТЬ ПРОЕКТ' : 'НОВЫЙ ПРОЕКТ'}
          </h1>
          <div className="edit-grid">
            <div className="two-col">
              <div className="f">
                <label>НАЗВАНИЕ ПРОЕКТА *</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="BENZO GANG"
                />
              </div>
              <div className="f">
                <label>КАТЕГОРИЯ</label>
                <select
                  value={formCat}
                  onChange={(e) => setFormCat(e.target.value)}
                >
                  {Object.entries(CATEGORIES).map(([k, name]) => (
                    <option key={k} value={k}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="f">
              <label>ОБЛОЖКА — URL ИЗОБРАЖЕНИЯ</label>
              <input
                value={formCover}
                onChange={(e) => setFormCover(e.target.value)}
                placeholder="https://.../cover.jpg"
              />
              {formCover && (
                <div className="cover-prev">
                  <img src={formCover} alt="Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div className="f">
              <label>ВИДЕО — ССЫЛКА И ИСТОЧНИК</label>
              <div className="video-row">
                <input
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="YouTube, Rutube, VK Видео или Vimeo"
                />
                <select
                  className="video-select"
                  value={formVideoSource}
                  onChange={(e) => setFormVideoSource(e.target.value)}
                >
                  <option value="">ВЫБРАТЬ...</option>
                  <option value="youtube">YOUTUBE</option>
                  <option value="rutube">RUTUBE</option>
                  <option value="vk">VK ВИДЕО</option>
                  <option value="vimeo">VIMEO</option>
                </select>
              </div>
              <button
                type="button"
                className="btn"
                style={{ marginTop: '10px' }}
                onClick={handleGetThumb}
                disabled={videoFetching}
              >
                {videoFetching ? '⏳ ПОЛУЧЕНИЕ...' : '📷 ПОЛУЧИТЬ ПРЕВЬЮ ИЗ ВИДЕО'}
              </button>
              {statusMsg && (
                <div className="mono" style={{ marginTop: '8px', color: statusMsg.startsWith('✓') ? 'var(--ice)' : 'var(--dim)' }}>
                  {statusMsg}
                </div>
              )}
            </div>

            <div className="two-col">
              <div className="f">
                <label>КЛИЕНТ / АРТИСТ</label>
                <input
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  placeholder="RUTEX MUSIC"
                />
              </div>
              <div className="f">
                <label>ФОРМАТ</label>
                <input
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value)}
                  placeholder="КОНЦЕРТ · АФТЕРМУВИ"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="f">
              <label>ФОТОГРАФИИ — URL</label>
              {formPhotos.map((photo, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px', gap: '8px', marginBottom: '8px' }}>
                  <input
                    value={photo}
                    onChange={(e) => {
                      const next = [...formPhotos];
                      next[i] = e.target.value;
                      setFormPhotos(next);
                    }}
                    placeholder="https://.../photo.jpg"
                  />
                  <button
                    className="mini del"
                    onClick={() => setFormPhotos(formPhotos.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-dash"
                onClick={() => setFormPhotos([...formPhotos, ''])}
              >
                + ДОБАВИТЬ ФОТОГРАФИЮ
              </button>
            </div>

            {/* Links */}
            <div className="f">
              <label>МАТЕРИАЛЫ / ССЫЛКИ</label>
              {formLinks.map((link, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px', gap: '8px', marginBottom: '8px' }}>
                  <input
                    value={link}
                    onChange={(e) => {
                      const next = [...formLinks];
                      next[i] = e.target.value;
                      setFormLinks(next);
                    }}
                    placeholder="https://..."
                  />
                  <button
                    className="mini del"
                    onClick={() => setFormLinks(formLinks.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-dash"
                onClick={() => setFormLinks([...formLinks, ''])}
              >
                + ДОБАВИТЬ ССЫЛКУ
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="btn btn-acc" onClick={handleSaveProject} style={{ flex: '1 1 auto' }}>
                СОХРАНИТЬ ПРОЕКТ →
              </button>
              <button className="btn" onClick={() => setScreen('list')}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </section>
      )}

      {/* COLLAB EDITOR */}
      {screen === 'edit-collab' && (
        <section>
          <div className="mono a-crumb">
            <button
              onClick={() => setScreen('dash')}
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
            >
              [ ← КАТЕГОРИИ ]
            </button>
          </div>
          <h1 className="a-title">
            {editingCollab ? 'РЕДАКТИРОВАТЬ КОЛЛАБОРАЦИЮ' : 'НОВАЯ КОЛЛАБОРАЦИЯ'}
          </h1>
          <div className="edit-grid">
            <div className="f">
              <label>ИМЯ / НАЗВАНИЕ *</label>
              <input
                value={formCollabName}
                onChange={(e) => setFormCollabName(e.target.value)}
                placeholder="RUTEX MUSIC"
              />
            </div>
            <div className="f">
              <label>ФОТО — URL</label>
              <input
                value={formCollabImg}
                onChange={(e) => setFormCollabImg(e.target.value)}
                placeholder="https://.../artist.jpg"
              />
              {formCollabImg && (
                <div className="cover-prev" style={{ maxWidth: '200px' }}>
                  <img src={formCollabImg} alt="" />
                </div>
              )}
            </div>
            <div className="f">
              <label>ССЫЛКИ</label>
              {formCollabLinks.map((l, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px', gap: '8px', marginBottom: '8px' }}>
                  <input
                    value={l}
                    onChange={(e) => {
                      const next = [...formCollabLinks];
                      next[i] = e.target.value;
                      setFormCollabLinks(next);
                    }}
                    placeholder="https://..."
                  />
                  <button
                    className="mini del"
                    onClick={() => setFormCollabLinks(formCollabLinks.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-dash"
                onClick={() => setFormCollabLinks([...formCollabLinks, ''])}
              >
                + ДОБАВИТЬ ССЫЛКУ
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="btn btn-acc" onClick={handleSaveCollab} style={{ flex: '1 1 auto' }}>
                СОХРАНИТЬ КОЛЛАБОРАЦИЮ →
              </button>
              <button className="btn" onClick={() => setScreen('dash')}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="edit-grid" style={{ maxWidth: '440px', width: '90%' }}>
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '18px', textTransform: 'uppercase' }}>
              Подтверждение удаления
            </h3>
            <p className="mono" style={{ color: 'var(--dim)', margin: '10px 0' }}>{confirmDelete.text}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
              <button
                className="btn btn-danger"
                style={{ flex: '1 1 auto' }}
                onClick={() => {
                  if (confirmDelete.type === 'project') {
                    handleDeleteProjectConfirmed(confirmDelete.idOrIdx);
                  } else {
                    handleDeleteCollabConfirmed(confirmDelete.idOrIdx);
                  }
                }}
              >
                УДАЛИТЬ
              </button>
              <button
                className="btn"
                style={{ flex: '1 1 auto' }}
                onClick={() => setConfirmDelete(null)}
              >
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div id="toast" className={toast.error ? 'e' : ''}>
          {toast.text}
        </div>
      )}
    </div>
  );
};
