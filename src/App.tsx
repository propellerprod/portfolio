import React, { useState, useEffect } from 'react';
import { Project, Collab } from './types';
import { DEFAULT_PROJECTS, DEFAULT_COLLABS } from './data/constants';
import { Header } from './components/Header';
import { Works } from './components/Works';
import { Collabs } from './components/Collabs';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CaseModal } from './components/CaseModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { AdminPanel } from './components/AdminPanel';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [collabs, setCollabs] = useState<Collab[]>(DEFAULT_COLLABS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  
  // Default main screen category is 'concerts' as requested!
  const [activeCategory, setActiveCategory] = useState<string>('concerts');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [pageTransitionHidden, setPageTransitionHidden] = useState<boolean>(false);

  // Blackout page boot transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageTransitionHidden(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  // Check URL pathname or hash for direct admin access ONLY (/admin or #admin)
  useEffect(() => {
    const checkAdmin = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdminPath = path.startsWith('/admin') || path.endsWith('/admin') || path.endsWith('/admin/');
      if (isAdminPath || hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    checkAdmin();
    window.addEventListener('popstate', checkAdmin);
    window.addEventListener('hashchange', checkAdmin);
    return () => {
      window.removeEventListener('popstate', checkAdmin);
      window.removeEventListener('hashchange', checkAdmin);
    };
  }, []);

  // Fetch projects and collabs from server or static data files
  useEffect(() => {
    const fetchData = async () => {
      const base = import.meta.env.BASE_URL || '/';

      // 1. Projects
      try {
        let res = await fetch('/api/projects').catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`${base}data/projects.json`).catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.projects) && data.projects.length) {
            setProjects(data.projects);
          }
        }
      } catch {
        // Fallback to default
      }

      // 2. Collabs
      try {
        let res = await fetch('/api/collabs').catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`${base}data/collabs.json`).catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.collabs) && data.collabs.length) {
            setCollabs(data.collabs);
          }
        }
      } catch {
        // Fallback to default
      }
    };

    fetchData();
  }, []);

  // Handle URL hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname;
      const isAdminPath = path.startsWith('/admin') || path.endsWith('/admin') || path.endsWith('/admin/');

      if (hash === '#admin' || isAdminPath) {
        setIsAdminView(true);
        return;
      }

      if (hash.startsWith('#project-')) {
        const targetId = decodeURIComponent(hash.slice(9));
        const found = projects.find((p) => p.id === targetId);
        if (found) {
          setSelectedProject(found);
        }
      } else if (['#concerts', '#clips', '#commercials', '#reels', '#all'].includes(hash)) {
        const cat = hash.slice(1);
        setActiveCategory(cat);
      } else if (!hash.startsWith('#project-') && selectedProject) {
        setSelectedProject(null);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [projects, selectedProject]);

  const handleSelectCategory = (catKey: string) => {
    setActiveCategory(catKey);
    try {
      window.history.replaceState(null, '', `#${catKey}`);
    } catch {
      // Ignored
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseCase = () => {
    if (window.location.hash.startsWith('#project-')) {
      try {
        window.history.replaceState(null, '', `#${activeCategory}`);
      } catch {
        // Ignored
      }
    }
    setSelectedProject(null);
  };

  return (
    <>
      {/* Clean Page Transition */}
      <div
        className={`page-transition ${pageTransitionHidden ? 'hide' : ''}`}
        id="pageTransition"
        aria-hidden="true"
      />

      {isAdminView ? (
        <AdminPanel
          projects={projects}
          collabs={collabs}
          onSaveProjects={(next) => setProjects(next)}
          onSaveCollabs={(next) => setCollabs(next)}
          onClose={() => {
            setIsAdminView(false);
            try {
              const base = import.meta.env.BASE_URL || '/';
              if (window.location.pathname.includes('/admin')) {
                window.history.replaceState(null, '', base);
              } else if (window.location.hash === '#admin') {
                window.history.replaceState(null, '', '#concerts');
              }
            } catch {
              // Ignored
            }
          }}
        />
      ) : (
        <>
          {/* Header with requested category tab order */}
          <Header
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            onContactClick={() => scrollTo('contact')}
            onCollabsClick={() => scrollTo('collabs')}
          />

          <main id="top">
            {/* Direct Muted Video Autoplay Grid with Soft Feathered Edges */}
            <Works
              projects={projects}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              onSelectProject={(p) => setSelectedProject(p)}
            />

            {/* Collaborations Section */}
            <Collabs collabs={collabs} />

            {/* Direct Contacts Section */}
            <Contact />
          </main>

          {/* Minimalist Monochrome Footer */}
          <Footer
            onSelectCategory={handleSelectCategory}
            onCollabsClick={() => scrollTo('collabs')}
            onContactClick={() => scrollTo('contact')}
          />
        </>
      )}

      {/* Video Popup Modal */}
      {selectedProject && (
        <CaseModal
          project={selectedProject}
          projectsList={
            activeCategory === 'all'
              ? projects
              : projects.filter((p) => p.category === activeCategory)
          }
          onClose={handleCloseCase}
          onSelectProject={(p) => setSelectedProject(p)}
          onOpenPhoto={(url) => setLightboxImg(url)}
          onContactClick={() => {
            handleCloseCase();
            scrollTo('contact');
          }}
        />
      )}

      {/* Photo Lightbox */}
      {lightboxImg && (
        <PhotoLightbox
          imgUrl={lightboxImg}
          onClose={() => setLightboxImg(null)}
        />
      )}
    </>
  );
};
