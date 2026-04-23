const TRACK_URL = 'https://functions.poehali.dev/5fe6dd8e-69e7-4342-9fb3-b760347c0a07?action=track';
const VISITOR_ID_KEY = 'visitor_id';
const VISIT_TRACKED_KEY = 'visit_tracked_today';
const UTM_STORAGE_KEY = 'utm_params';
const BATCH_DELAY = 5000;

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

const isTrackingAllowed = (): boolean => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  if (pathname.startsWith('/admin')) return false;
  return hostname === 'sentag.ru' || hostname === 'www.sentag.ru';
};

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Читаем UTM из текущего URL и сохраняем в sessionStorage
const captureUtm = (): UtmParams => {
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (source || medium || campaign) {
    if (source) utm.utm_source = source;
    if (medium) utm.utm_medium = medium;
    if (campaign) utm.utm_campaign = campaign;
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    return utm;
  }

  // Если в URL нет UTM — берём из sessionStorage (мог перейти на другую страницу)
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_e) { /* ignore */ }

  return {};
};

// Очередь кликов для батчинга
interface ClickItem {
  button_name: string;
  button_location: string;
}

const clickQueue: ClickItem[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flushClicks = () => {
  if (clickQueue.length === 0) return;
  const batch = clickQueue.splice(0);
  flushTimer = null;

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: getVisitorId(),
      domain: window.location.hostname,
      clicks: batch,
    }),
    keepalive: true,
  }).catch(() => {});
};

if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushClicks();
  });
}

export const trackVisit = async () => {
  if (!isTrackingAllowed()) return;

  const today = new Date().toDateString();
  if (localStorage.getItem(VISIT_TRACKED_KEY) === today) return;

  const utm = captureUtm();

  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_id: getVisitorId(),
        domain: window.location.hostname,
        referrer: document.referrer || null,
        ...utm,
      }),
    });
    localStorage.setItem(VISIT_TRACKED_KEY, today);
  } catch (e) {
    console.error('trackVisit:', e);
  }
};

export const trackClick = (buttonName: string, location: string) => {
  if (!isTrackingAllowed()) return;

  clickQueue.push({ button_name: buttonName, button_location: location });

  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushClicks, BATCH_DELAY);
};