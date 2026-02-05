-- Исправление данных: вычитаем 10 часов (т.к. дважды добавили по 5)
-- V0016 добавила +5 часов, V0017 добавила ещё +5 часов
-- Нужно вернуться к исходному UTC времени

UPDATE t_p28851569_sentag_safety_system.button_clicks
SET clicked_at = clicked_at - INTERVAL '10 hours'
WHERE clicked_at > '2026-02-05T10:00:00+00:00';

UPDATE t_p28851569_sentag_safety_system.request_forms
SET step2_completed_at = step2_completed_at - INTERVAL '10 hours'
WHERE step2_completed_at IS NOT NULL 
  AND step2_completed_at > '2026-02-05T10:00:00+00:00';

UPDATE t_p28851569_sentag_safety_system.request_forms
SET updated_at = updated_at - INTERVAL '10 hours'
WHERE updated_at > '2026-02-05T10:00:00+00:00';

UPDATE t_p28851569_sentag_safety_system.request_forms
SET step2_started_at = step2_started_at - INTERVAL '10 hours'
WHERE step2_started_at IS NOT NULL 
  AND step2_started_at > '2026-02-05T10:00:00+00:00';