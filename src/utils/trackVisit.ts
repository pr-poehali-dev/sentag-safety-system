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
 * Отслеживание посещения страницы (только для уникальных пользователей)
 */
export const trackVisit = async () => {
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
 * Отслеживание клика по элементу на сайте
 */
export const trackClick = async (buttonName: string, location: string) => {
  try {
    const visitorId = getVisitorId();
    
    await fetch('https://functions.poehali.dev/4de53ae4-cfe6-4e91-8b18-ee01f7dc2bee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitor_id: visitorId,
        button_name: buttonName,
        button_location: location,
      }),
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};