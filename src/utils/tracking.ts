/**
 * Интеграция с рекламными платформами для таргетинга и ретаргетинга
 */

declare global {
  interface Window {
    ym?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    vkPixel?: any;
  }
}

/**
 * События для отслеживания конверсий
 */
export enum TrackingEvent {
  // Просмотры
  PAGE_VIEW = 'page_view',
  
  // Вовлечение
  VIEW_CONTENT = 'view_content',
  SCROLL_DEPTH_25 = 'scroll_25',
  SCROLL_DEPTH_50 = 'scroll_50',
  SCROLL_DEPTH_75 = 'scroll_75',
  SCROLL_DEPTH_100 = 'scroll_100',
  
  // Взаимодействие с контентом
  CLICK_PHONE = 'click_phone',
  CLICK_EMAIL = 'click_email',
  VIEW_DOCUMENT = 'view_document',
  CLICK_MAP = 'click_map',
  
  // Форма
  START_FORM = 'start_form',
  COMPLETE_STEP_1 = 'complete_step_1',
  COMPLETE_STEP_2 = 'complete_step_2',
  SUBMIT_FORM = 'submit_form',
  
  // Конверсия
  LEAD = 'lead',
  REQUEST_CALL = 'request_call',
}

/**
 * Категории событий для аналитики
 */
export enum EventCategory {
  ENGAGEMENT = 'engagement',
  CONTACT = 'contact',
  FORM = 'form',
  CONVERSION = 'conversion',
}

/**
 * Отправка события в Яндекс.Метрику
 */
const sendToYandexMetrika = (event: string, params?: Record<string, any>) => {
  if (typeof window.ym !== 'undefined') {
    try {
      window.ym(101026698, 'reachGoal', event, params);
    } catch (error) {}
  }
};

/**
 * Отправка события в Google Analytics
 */
const sendToGoogleAnalytics = (event: string, params?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    try {
      window.gtag('event', event, params);
    } catch (error) {}
  }
};

/**
 * Отправка события в Facebook Pixel
 */
const sendToFacebookPixel = (event: string, params?: Record<string, any>) => {
  if (typeof window.fbq !== 'undefined') {
    try {
      // Стандартные события Facebook
      const fbStandardEvents: Record<string, string> = {
        [TrackingEvent.PAGE_VIEW]: 'PageView',
        [TrackingEvent.VIEW_CONTENT]: 'ViewContent',
        [TrackingEvent.START_FORM]: 'InitiateCheckout',
        [TrackingEvent.LEAD]: 'Lead',
        [TrackingEvent.SUBMIT_FORM]: 'CompleteRegistration',
      };
      
      const fbEvent = fbStandardEvents[event] || event;
      window.fbq('track', fbEvent, params);
    } catch (error) {}
    }
  }
};

/**
 * Отправка события в VK Pixel
 */
const sendToVKPixel = (event: string, params?: Record<string, any>) => {
  if (typeof window.vkPixel !== 'undefined') {
    try {
      // Стандартные события VK
      const vkStandardEvents: Record<string, string> = {
        [TrackingEvent.PAGE_VIEW]: 'page_view',
        [TrackingEvent.VIEW_CONTENT]: 'view_content',
        [TrackingEvent.START_FORM]: 'start_trial',
        [TrackingEvent.LEAD]: 'lead',
        [TrackingEvent.SUBMIT_FORM]: 'complete_registration',
      };
      
      const vkEvent = vkStandardEvents[event] || event;
      window.vkPixel(vkEvent, params);
    } catch (error) {}
    }
  }
};

/**
 * Универсальная функция отслеживания событий
 * Отправляет событие во все подключенные системы аналитики
 */
export const trackEvent = (
  event: TrackingEvent,
  category: EventCategory,
  params?: Record<string, any>
) => {
  const eventParams = {
    event_category: category,
    ...params,
  };

  // Отправляем во все платформы
  sendToYandexMetrika(event, eventParams);
  sendToGoogleAnalytics(event, eventParams);
  sendToFacebookPixel(event, eventParams);
  sendToVKPixel(event, eventParams);
};

/**
 * Отслеживание прокрутки страницы
 */
let scrollTracked = {
  25: false,
  50: false,
  75: false,
  100: false,
};

export const initScrollTracking = () => {
  let ticking = false;

  const checkScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollPercent >= 25 && !scrollTracked[25]) {
      scrollTracked[25] = true;
      trackEvent(TrackingEvent.SCROLL_DEPTH_25, EventCategory.ENGAGEMENT, {
        scroll_depth: 25,
      });
    }
    if (scrollPercent >= 50 && !scrollTracked[50]) {
      scrollTracked[50] = true;
      trackEvent(TrackingEvent.SCROLL_DEPTH_50, EventCategory.ENGAGEMENT, {
        scroll_depth: 50,
      });
    }
    if (scrollPercent >= 75 && !scrollTracked[75]) {
      scrollTracked[75] = true;
      trackEvent(TrackingEvent.SCROLL_DEPTH_75, EventCategory.ENGAGEMENT, {
        scroll_depth: 75,
      });
    }
    if (scrollPercent >= 100 && !scrollTracked[100]) {
      scrollTracked[100] = true;
      trackEvent(TrackingEvent.SCROLL_DEPTH_100, EventCategory.ENGAGEMENT, {
        scroll_depth: 100,
      });
    }
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
};

/**
 * Отслеживание времени на сайте
 */
export const initTimeTracking = () => {
  const startTime = Date.now();
  
  // Отправляем событие каждые 30 секунд
  const intervals = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min
  
  intervals.forEach(seconds => {
    setTimeout(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(TrackingEvent.VIEW_CONTENT, EventCategory.ENGAGEMENT, {
        time_on_site: timeSpent,
        engagement_level: seconds >= 300 ? 'high' : seconds >= 60 ? 'medium' : 'low',
      });
    }, seconds * 1000);
  });
};

/**
 * Сброс отслеживания прокрутки (для SPA навигации)
 */
export const resetScrollTracking = () => {
  scrollTracked = {
    25: false,
    50: false,
    75: false,
    100: false,
  };
};