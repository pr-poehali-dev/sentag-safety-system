import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface SiteSettings {
  showDocuments: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  faviconUrl: string;
  ogImageUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  showDocuments: true,
  seoTitle: 'Безопасность вашего бассейна под контролем',
  seoDescription: 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.',
  seoKeywords: 'СООУ, система безопасности бассейнов, Sentag AB',
  faviconUrl: 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/favicon/20260207_101407_%D0%9B%D0%BE%D0%B3%D0%BE%20Sentag%20(2).png?v=2',
  ogImageUrl: 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/files/og-image-1770456083663.png',
};

const SETTINGS_URL = 'https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e';
const CACHE_KEY = 'site_settings_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface SiteSettingsContextType {
  settings: SiteSettings;
  reload: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  reload: () => {},
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

function getCached(): SiteSettings | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function setCache(data: SiteSettings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (_e) { /* ignore */ }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => getCached() || DEFAULT_SETTINGS);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch(SETTINGS_URL);
      if (response.ok) {
        const data = await response.json();
        const s = data.settings || {};
        const newSettings: SiteSettings = {
          showDocuments: s.show_documents_section ?? true,
          seoTitle: s.seo_title || DEFAULT_SETTINGS.seoTitle,
          seoDescription: s.seo_description || DEFAULT_SETTINGS.seoDescription,
          seoKeywords: s.seo_keywords || DEFAULT_SETTINGS.seoKeywords,
          faviconUrl: s.favicon_url || DEFAULT_SETTINGS.faviconUrl,
          ogImageUrl: s.og_image_url || DEFAULT_SETTINGS.ogImageUrl,
        };
        setSettings(newSettings);
        setCache(newSettings);
        applySeoMeta(newSettings);
      }
    } catch (_e) {
      const cached = getCached();
      if (cached) setSettings(cached);
    }
  }, []);

  const applySeoMeta = (s: SiteSettings) => {
    document.title = s.seoTitle;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement;
      if (el) el.content = content;
    };

    setMeta('meta[name="description"]', s.seoDescription);
    setMeta('meta[property="og:title"]', s.seoTitle);
    setMeta('meta[property="og:description"]', s.seoDescription);
    setMeta('meta[name="twitter:title"]', s.seoTitle);
    setMeta('meta[name="twitter:description"]', s.seoDescription);
    setMeta('meta[property="og:image"]', s.ogImageUrl);
    setMeta('meta[name="twitter:image"]', s.ogImageUrl);

    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = s.seoKeywords;

    const faviconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    if (faviconLinks.length > 0) {
      faviconLinks.forEach(el => {
        (el as HTMLLinkElement).href = s.faviconUrl;
      });
    } else {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = s.faviconUrl;
      document.head.appendChild(favicon);
    }
  };

  useEffect(() => {
    loadSettings();

    const handleUpdate = () => loadSettings();
    window.addEventListener('faviconUpdate', handleUpdate);
    window.addEventListener('seoUpdate', handleUpdate);
    window.addEventListener('documentsToggle', handleUpdate);

    return () => {
      window.removeEventListener('faviconUpdate', handleUpdate);
      window.removeEventListener('seoUpdate', handleUpdate);
      window.removeEventListener('documentsToggle', handleUpdate);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, reload: loadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export default SiteSettingsProvider;