/**
 * Отслеживание клика по кнопке
 * @param buttonName - название кнопки
 * @param buttonLocation - расположение кнопки на сайте
 */
export const trackClick = async (buttonName: string, buttonLocation: string) => {
  try {
    // Получаем visitor_id из localStorage
    const visitorId = localStorage.getItem('visitor_id');
    
    await fetch('https://functions.poehali.dev/ddc0d90d-3227-4104-ad7f-5a5b8c1374a7', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        button_name: buttonName,
        button_location: buttonLocation,
        visitor_id: visitorId,
      }),
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};