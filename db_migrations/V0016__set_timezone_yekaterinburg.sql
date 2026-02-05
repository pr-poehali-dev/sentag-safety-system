-- Установка часового пояса Екатеринбурга (UTC+5) для timestamp колонок

-- button_clicks: clicked_at уже timestamp without time zone, меняем на with time zone
ALTER TABLE t_p28851569_sentag_safety_system.button_clicks 
ALTER COLUMN clicked_at TYPE timestamp with time zone 
USING clicked_at AT TIME ZONE 'Asia/Yekaterinburg';

ALTER TABLE t_p28851569_sentag_safety_system.button_clicks 
ALTER COLUMN clicked_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Yekaterinburg');

-- request_forms: меняем step2_completed_at, updated_at, step2_started_at
ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN step2_completed_at TYPE timestamp with time zone
USING step2_completed_at AT TIME ZONE 'Asia/Yekaterinburg';

ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN updated_at TYPE timestamp with time zone
USING updated_at AT TIME ZONE 'Asia/Yekaterinburg';

ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Yekaterinburg');

ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN step2_started_at TYPE timestamp with time zone
USING step2_started_at AT TIME ZONE 'Asia/Yekaterinburg';