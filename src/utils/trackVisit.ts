const TRACK_URL = 'https://functions.poehali.dev/fadc8ec7-13d7-4acb-86c2-762630630eef';
const VISITOR_ID_KEY = 'visitor_id';
const VISIT_TRACKED_KEY = 'visit_tracked_today';
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

// Сбрасываем очередь при уходе со страницы
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushClicks();
  });
}

export const trackVisit = async () => {
  if (!isTrackingAllowed()) return;

  const today = new Date().toDateString();
  if (localStorage.getItem(VISIT_TRACKED_KEY) === today) return;

  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_id: getVisitorId(),
        domain: window.location.hostname,
        referrer: document.referrer || null,
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