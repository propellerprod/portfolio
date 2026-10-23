import React, { useState, useEffect } from 'react';
import { Project, Collab } from '../types';
import { CATEGORIES } from '../data/constants';
import { fetchVideoMeta } from '../utils/video';
import { PropellerIcon } from './PropellerIcon';

const GITHUB_REPO = 'propellerprod/portfolio';
const TOKEN_STORAGE_KEY = 'propeller_admin_gh_token';

interface AdminPanelProps {
  projects: Project[];
  collabs: Collab[];
  onSaveProjects: (newProjects: Project[]) => void;
  onSaveCollabs: (newCollabs: Collab[]) => void;
  onClose: () => void;
}

interface GitHubUserInfo {
  login: string;
  avatar_url: string;
  name: string;
  canPush: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  collabs,
  onSaveProjects,
  onSaveCollabs,
  onClose,
}) => {
  // Authentication states
  const [token, setToken] = useState<string>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [inputToken, setInputToken] = useState<string>('');
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [ghUser, setGhUser] = useState<GitHubUserInfo | null>(null);

  // Syncing with GitHub state
  const [syncingGitHub, setSyncingGitHub] = useState<boolean>(false);
  const [autoSyncOnSave, setAutoSyncOnSave] = useState<boolean>(true);

  // Screen states
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
    setTimeout(() => setToast(null), 4000);
  };

  /**
   * Verify token against GitHub API and check permissions on propellerprod/portfolio
   */
  const verifyGitHubToken = async (
    tokenToTest: string
  ): Promise<{ valid: boolean; user?: GitHubUserInfo; error?: string }> => {
    const cleanToken = tokenToTest.trim();
    if (!cleanToken) {
      return { valid: false, error: 'Введите GitHub Personal Access Token' };
    }

    try {
      // 1. Check user info
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userRes.ok) {
        if (userRes.status === 401) {
          return { valid: false, error: 'Неверный токен GitHub или срок его действия истёк (401 Unauthorized).' };
        }
        return { valid: false, error: `Ошибка проверки токена на GitHub (HTTP ${userRes.status})` };
      }

      const userData = await userRes.json();

      // 2. Check repo access and push permissions on propellerprod/portfolio
      const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!repoRes.ok) {
        if (repoRes.status === 404) {
          return {
            valid: false,
            error: `Токен валиден (@${userData.login}), но репозиторий ${GITHUB_REPO} недоступен или токен не имеет области прав (scopes) repo.`,
          };
        }
        return { valid: false, error: `Ошибка доступа к репозиторию (HTTP ${repoRes.status})` };
      }

      const repoData = await repoRes.json();
      const canPush = Boolean(repoData.permissions?.push || repoData.permissions?.admin);

      if (!canPush) {
        return {
          valid: false,
          error: `У пользователя @${userData.login} нет прав на запись (push) в репозиторий ${GITHUB_REPO}. Зайдите под аккаунтом владельца или коллаборатора с правом записи.`,
        };
      }

      return {
        valid: true,
        user: {
          login: userData.login,
          avatar_url: userData.avatar_url,
          name: userData.name || userData.login,
          canPush: true,
        },
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Сетевая ошибка при проверке токена GitHub.' };
    }
  };

  // Verify stored token on initial load
  useEffect(() => {
    let isMounted = true;

    const checkStoredAuth = async () => {
      setAuthChecking(true);
      const saved = localStorage.getItem(TOKEN_STORAGE_KEY) || token;
      if (!saved) {
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthChecking(false);
        }
        return;
      }

      const result = await verifyGitHubToken(saved);
      if (isMounted) {
        if (result.valid && result.user) {
          setIsAuthenticated(true);
          setGhUser(result.user);
          setToken(saved);
          setAuthError(null);
        } else {
          setIsAuthenticated(false);
          setAuthError(result.error || null);
          try {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          } catch {
            // Ignored
          }
        }
        setAuthChecking(false);
      }
    };

    checkStoredAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginWithToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthChecking(true);

    const result = await verifyGitHubToken(inputToken);
    if (result.valid && result.user) {
      setIsAuthenticated(true);
      setGhUser(result.user);
      const clean = inputToken.trim();
      setToken(clean);
      if (rememberToken) {
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, clean);
        } catch {
          // Ignored
        }
      }
      showToast(`Успешный вход: @${result.user.login}`);
    } else {
      setAuthError(result.error || 'Ошибка авторизации');
    }
    setAuthChecking(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignored
    }
    setToken('');
    setInputToken('');
    setIsAuthenticated(false);
    setGhUser(null);
    setAuthError(null);
    showToast('Вы вышли из админ-панели');
  };

  /**
   * Commit updated projects.json or collabs.json straight to GitHub main branch
   */
  const pushFileToGitHub = async (
    filename: 'projects.json' | 'collabs.json',
    payloadObject: any
  ) => {
    if (!token) throw new Error('Отсутствует GitHub токен');

    // 1. Fetch current file SHA
    const path = `data/${filename}`;
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let sha: string | undefined = undefined;
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. Prepare JSON content
    const jsonStr = JSON.stringify(payloadObject, null, 2) + '\n';
    const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

    // 3. Commit to main
    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `admin: update ${path}`,
        content: base64Content,
        sha,
        branch: 'main',
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      throw new Error(err.message || `Ошибка сохранения ${path} (HTTP ${putRes.status})`);
    }

    return true;
  };

  /**
   * Manual full sync of both data files to GitHub
   */
  const handleFullSyncToGitHub = async (
    customProjects?: Project[],
    customCollabs?: Collab[]
  ) => {
    const projToSave = customProjects || projects;
    const collToSave = customCollabs || collabs;

    setSyncingGitHub(true);
    showToast('Отправка изменений в репозиторий GitHub...');

    try {
      // 1. Projects
      await pushFileToGitHub('projects.json', {
        updated: new Date().toISOString(),
        projects: projToSave,
      });

      // 2. Collabs
      await pushFileToGitHub('collabs.json', {
        updated: new Date().toISOString(),
        collabs: collToSave,
      });

      showToast('✓ Успешно отправлено в GitHub! Запущен автодеплой.');
    } catch (err: any) {
      showToast(`Ошибка GitHub: ${err.message || 'Не удалось отправить'}`, true);
    } finally {
      setSyncingGitHub(false);
    }
  };

  const handleDownloadBackup = () => {
    const data = {
      updated: new Date().toISOString(),
      projects,
      collabs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propeller-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Бэкап скачан');
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
        if (meta.service && !formVideoSource) {
          setFormVideoSource(meta.service);
        }
        setStatusMsg('✓ Обложка успешно получена!');
      } else {
        setStatusMsg('Не удалось получить обложку автоматически');
      }
    } catch (e: any) {
      setStatusMsg(`Ошибка: ${e.message}`);
    } finally {
      setVideoFetching(false);
    }
  };

  // Save project
  const handleSaveProject = async () => {
    if (!formTitle.trim()) {
      showToast('Название проекта обязательно', true);
      return;
    }

    const updatedProjects = [...projects];

    if (editingProject) {
      const idx = updatedProjects.findIndex((p) => p.id === editingProject.id);
      if (idx !== -1) {
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
    showToast('Проект сохранён локально');
    setScreen('list');

    if (autoSyncOnSave && token) {
      handleFullSyncToGitHub(updatedProjects);
    }
  };

  // Delete project
  const handleDeleteProjectConfirmed = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    onSaveProjects(next);
    showToast('Проект удалён');
    setConfirmDelete(null);
    if (autoSyncOnSave && token) {
      handleFullSyncToGitHub(next);
    }
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
    if (autoSyncOnSave && token) {
      handleFullSyncToGitHub(next);
    }
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
    showToast('Коллаборация сохранена');
    setScreen('dash');

    if (autoSyncOnSave && token) {
      handleFullSyncToGitHub(undefined, next);
    }
  };

  // Delete collab
  const handleDeleteCollabConfirmed = (index: number) => {
    const next = collabs.filter((_, i) => i !== index);
    onSaveCollabs(next);
    showToast('Коллаборация удалена');
    setConfirmDelete(null);
    if (autoSyncOnSave && token) {
      handleFullSyncToGitHub(undefined, next);
    }
  };

  // =========================================================================
  // AUTHENTICATION GATE SCREEN
  // =========================================================================
  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <PropellerIcon />
          <div className="mono" style={{ marginTop: '16px', letterSpacing: '0.1em', fontSize: '13px', color: '#888888' }}>
            ПРОВЕРКА АВТОРИЗАЦИИ GITHUB...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
          background: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '8px',
          padding: '32px 28px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)'
        }}>
          {/* Logo & Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <PropellerIcon />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                ПРОПЕЛЛЕР UNION
              </div>
              <div className="mono" style={{ fontSize: '11px', color: '#888888', letterSpacing: '0.08em' }}>
                ПАНЕЛЬ АДМИНИСТРИРОВАНИЯ
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#b0b0b0',
            marginBottom: '20px',
            borderLeft: '2px solid #ffffff',
            paddingLeft: '12px'
          }}>
            Для защиты портфолио вход ограничен. Требуется GitHub Personal Access Token с правами на запись в репозиторий <strong>{GITHUB_REPO}</strong>.
          </div>

          {authError && (
            <div style={{
              background: 'rgba(255, 59, 48, 0.12)',
              border: '1px solid rgba(255, 59, 48, 0.35)',
              color: '#ff6b6b',
              padding: '12px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: 1.5,
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)'
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginWithToken}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '8px' }}>
                GitHub Personal Access Token (PAT)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showTokenInput ? 'text' : 'password'}
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="ghp_... или github_pat_..."
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    background: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#888888',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px'
                  }}
                  title={showTokenInput ? 'Скрыть' : 'Показать'}
                >
                  {showTokenInput ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberToken}
                onChange={(e) => setRememberToken(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#ffffff' }}
              />
              <label htmlFor="remember" style={{ fontSize: '12px', color: '#888888', cursor: 'pointer', userSelect: 'none' }}>
                Сохранить токен в этом браузере
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="submit"
                disabled={authChecking || !inputToken.trim()}
                className="btn btn-acc"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: authChecking || !inputToken.trim() ? 'not-allowed' : 'pointer',
                  opacity: authChecking || !inputToken.trim() ? 0.6 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              >
                {authChecking ? 'ПРОВЕРКА ТОКЕНА В GITHUB API...' : 'ВОЙТИ В АДМИН-ПАНЕЛЬ →'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: '#888888',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ← ВЕРНУТЬСЯ НА САЙТ
              </button>
            </div>
          </form>

          {/* Instructions Box */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            color: '#777777',
            lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, color: '#aaaaaa', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Как получить токен:
            </div>
            1. Откройте GitHub → <strong>Settings</strong> → <strong>Developer settings</strong> → <strong>Personal access tokens</strong> (classic).<br />
            2. Выберите галочку <strong>repo</strong> (полный доступ к репозиториям).<br />
            3. Скопируйте созданный ключ <code>ghp_...</code> и вставьте выше.<br />
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Propeller+Admin+Panel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '8px', color: '#ffffff', textDecoration: 'underline' }}
            >
              Создать токен на GitHub в один клик ↗
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  const catProjects = projects.filter((p) => p.category === selectedCat);

  return (
    <div className="admin-container" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header className="a-head">
        <div className="a-logo">
          <PropellerIcon />
          <span>ПРОПЕЛЛЕР UNION / АДМИН</span>
        </div>

        <div className="a-actions" style={{ flexWrap: 'wrap', gap: '12px' }}>
          {/* User Badge */}
          {ghUser && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: '#151515',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)'
            }}>
              {ghUser.avatar_url && (
                <img
                  src={ghUser.avatar_url}
                  alt=""
                  style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                />
              )}
              <span>@{ghUser.login}</span>
              <span style={{ color: '#4ade80' }}>● Доступ подтверждён</span>
            </div>
          )}

          {/* Sync Button */}
          <button
            className="btn"
            onClick={() => handleFullSyncToGitHub()}
            disabled={syncingGitHub}
            style={{
              background: '#1a1a1a',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Отправить изменения projects.json и collabs.json в ветку main"
          >
            <span>{syncingGitHub ? '⏳ ОТПРАВКА В GITHUB...' : '🚀 ОПУБЛИКОВАТЬ В GITHUB'}</span>
          </button>

          {/* Backup Button */}
          <button
            className="btn"
            onClick={handleDownloadBackup}
            style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            title="Скачать JSON резервную копию"
          >
            💾 БЭКАП
          </button>

          {/* Logout Button */}
          <button
            className="btn"
            onClick={handleLogout}
            style={{ color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}
          >
            ВЫЙТИ
          </button>

          {/* Return to Site Button */}
          <button className="btn btn-acc" onClick={onClose}>
            НА САЙТ ↗
          </button>
        </div>
      </header>

      {/* DASHBOARD */}
      {screen === 'dash' && (
        <section>
          <div className="mono a-crumb">[ АДМИН / КАТЕГОРИИ ]</div>
          <h1 className="a-title">КАТЕГОРИИ</h1>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button className="btn btn-acc" onClick={handleStartAddProject}>
              + ДОБАВИТЬ ПРОЕКТ
            </button>
            <button className="btn" onClick={handleStartAddCollab}>
              + ДОБАВИТЬ КОЛЛАБОРАЦИЮ
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#888', marginLeft: 'auto' }}>
              <input
                type="checkbox"
                checked={autoSyncOnSave}
                onChange={(e) => setAutoSyncOnSave(e.target.checked)}
                style={{ accentColor: '#ffffff' }}
              />
              Авто-коммит в GitHub при сохранении
            </label>
          </div>

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
                      <div className="thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="mono">NO IMG</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{p.title}</div>
                    <div className="mono" style={{ color: 'var(--dim)', fontSize: '11px', marginTop: '2px' }}>
                      {p.client ? `${p.client} · ` : ''}{p.format || 'Видео'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
                    <button className="mini" onClick={() => handleStartEditProject(p)}>
                      ИЗМЕНИТЬ
                    </button>
                    <button
                      className="mini del"
                      onClick={() => setConfirmDelete({ type: 'project', idOrIdx: p.id, text: `Удалить проект "${p.title}"?` })}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* EDIT / CREATE PROJECT */}
      {screen === 'edit-project' && (
        <section>
          <div className="mono a-crumb">
            <button
              onClick={() => setScreen('list')}
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
            >
              [ ← К СПИСКУ {CATEGORIES[selectedCat]?.toUpperCase() || ''} ]
            </button>
          </div>
          <h1 className="a-title">
            {editingProject ? 'РЕДАКТИРОВАНИЕ ПРОЕКТА' : 'НОВЫЙ ПРОЕКТ'}
          </h1>

          <div className="edit-grid">
            <div>
              <label>НАЗВАНИЕ ПРОЕКТА *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Например: TWINS by Benzo Gang"
              />
            </div>

            <div>
              <label>КАТЕГОРИЯ</label>
              <select value={formCat} onChange={(e) => setFormCat(e.target.value)}>
                {Object.entries(CATEGORIES).map(([k, name]) => (
                  <option key={k} value={k}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>ССЫЛКА НА ВИДЕО (YOUTUBE / RUTUBE / VK / VIMEO)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/..."
                  style={{ flex: 1 }}
                />
                <button
                  className="btn"
                  type="button"
                  onClick={handleGetThumb}
                  disabled={videoFetching}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {videoFetching ? 'ПОЛУЧЕНИЕ...' : 'АВТО-ОБЛОЖКА'}
                </button>
              </div>
              {statusMsg && <div className="mono status-line" style={{ marginTop: '6px' }}>{statusMsg}</div>}
            </div>

            <div>
              <label>URL ОБЛОЖКИ (ПРЕВЬЮ)</label>
              <input
                type="text"
                value={formCover}
                onChange={(e) => setFormCover(e.target.value)}
                placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
              />
              {formCover && (
                <div style={{ marginTop: '8px', width: '160px', height: '90px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                  <img src={formCover} alt="Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>КЛИЕНТ / АРТИСТ</label>
                <input
                  type="text"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  placeholder="Например: Benzo Gang"
                />
              </div>
              <div>
                <label>ФОРМАТ / ОПИСАНИЕ</label>
                <input
                  type="text"
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value)}
                  placeholder="Например: ДИДЖЕЙ СЕТЫ"
                />
              </div>
            </div>

            {/* Additional Photos */}
            <div>
              <label>ФОТОГРАФИИ ДЛЯ КЕЙСА (URL)</label>
              {formPhotos.map((photo, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => {
                      const next = [...formPhotos];
                      next[i] = e.target.value;
                      setFormPhotos(next);
                    }}
                    placeholder="https://..."
                    style={{ flex: 1 }}
                  />
                  <button
                    className="mini del"
                    type="button"
                    onClick={() => {
                      setFormPhotos(formPhotos.filter((_, idx) => idx !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="mini"
                type="button"
                onClick={() => setFormPhotos([...formPhotos, ''])}
              >
                + ДОБАВИТЬ ФОТО
              </button>
            </div>

            {/* Additional Links */}
            <div>
              <label>ССЫЛКИ / СОЦСЕТИ К ПРОЕКТУ</label>
              {formLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      const next = [...formLinks];
                      next[i] = e.target.value;
                      setFormLinks(next);
                    }}
                    placeholder="https://..."
                    style={{ flex: 1 }}
                  />
                  <button
                    className="mini del"
                    type="button"
                    onClick={() => {
                      setFormLinks(formLinks.filter((_, idx) => idx !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="mini"
                type="button"
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

      {/* EDIT / CREATE COLLAB */}
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
            {editingCollab ? 'РЕДАКТИРОВАНИЕ КОЛЛАБОРАЦИИ' : 'НОВАЯ КОЛЛАБОРАЦИЯ'}
          </h1>

          <div className="edit-grid">
            <div>
              <label>ИМЯ / НАЗВАНИЕ *</label>
              <input
                type="text"
                value={formCollabName}
                onChange={(e) => setFormCollabName(e.target.value)}
                placeholder="Например: ПРЕМЬЕР БОУЛИНГ"
              />
            </div>

            <div>
              <label>URL ЛОГОТИПА ИЛИ АВАТАРКИ</label>
              <input
                type="text"
                value={formCollabImg}
                onChange={(e) => setFormCollabImg(e.target.value)}
                placeholder="https://..."
              />
              {formCollabImg && (
                <div style={{ marginTop: '8px', width: '80px', height: '80px', overflow: 'hidden', borderRadius: '50%', border: '1px solid var(--line)' }}>
                  <img src={formCollabImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Collab Links */}
            <div>
              <label>ССЫЛКИ (VK, ТЕЛЕГРАМ И Т.Д.)</label>
              {formCollabLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      const next = [...formCollabLinks];
                      next[i] = e.target.value;
                      setFormCollabLinks(next);
                    }}
                    placeholder="https://..."
                    style={{ flex: 1 }}
                  />
                  <button
                    className="mini del"
                    type="button"
                    onClick={() => {
                      setFormCollabLinks(formCollabLinks.filter((_, idx) => idx !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="mini"
                type="button"
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
