/**
 * Генерация или получение уникального ID посетителя
 */
export const getVisitorId = (): string => {
  const VISITOR_ID_KEY = 'visitor_id';
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  
  return visitorId;
};

/**
 * Проверка, что трекинг разрешен (только для основного домена sentag.ru)
 */
const isTrackingAllowed = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'sentag.ru' || hostname === 'www.sentag.ru';
};

/**
 * Отслеживание посещения страницы (только для уникальных пользователей)
 */
export const trackVisit = async () => {
  // Трекинг только на основном домене
  if (!isTrackingAllowed()) {
    return;
  }
  
  const VISIT_TRACKED_KEY = 'visit_tracked_today';
  const today = new Date().toDateString();
  const lastTracked = localStorage.getItem(VISIT_TRACKED_KEY);
  
  // Отслеживаем только один раз в день
  if (lastTracked === today) {
    return;
  }
  
  try {
    const visitorId = getVisitorId();
    
    await fetch('https://functions.poehali.dev/fadc8ec7-13d7-4acb-86c2-762630630eef', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitor_id: visitorId,
      }),
    });
    
    localStorage.setItem(VISIT_TRACKED_KEY, today);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};

/**
 * Обновление активности пользователя (для онлайн-статистики)
 * Вызывается каждые 2 минуты пока пользователь на сайте
 */
export const updateActivity = async () => {
  // Трекинг только на основном домене
  if (!isTrackingAllowed()) {
    return;
  }
  
  try {
    const visitorId = getVisitorId();
    
    await fetch('https://functions.poehali.dev/fadc8ec7-13d7-4acb-86c2-762630630eef', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitor_id: visitorId,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error('Error updating activity:', error);
  }
};

/**
 * Отслеживание клика по элементу на сайте
 */
export const trackClick = (buttonName: string, location: string) => {
  // Трекинг только на основном домене
  if (!isTrackingAllowed()) {
    return;
  }
  
  const visitorId = getVisitorId();
  
  fetch('https://functions.poehali.dev/ddc0d90d-3227-4104-ad7f-5a5b8c1374a7', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      visitor_id: visitorId,
      button_name: buttonName,
      button_location: location,
    }),
    keepalive: true,
  }).catch(() => {});
};