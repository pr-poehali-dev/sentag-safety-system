-- Исправление: возвращаем колонки к UTC (timestamp with time zone в UTC)
-- Проблема: V0016 неправильно интерпретировала UTC timestamps как локальные

-- Возвращаем clicked_at обратно к UTC
ALTER TABLE t_p28851569_sentag_safety_system.button_clicks 
ALTER COLUMN clicked_at TYPE timestamp with time zone 
USING (clicked_at AT TIME ZONE 'Asia/Yekaterinburg') AT TIME ZONE 'UTC';

ALTER TABLE t_p28851569_sentag_safety_system.button_clicks 
ALTER COLUMN clicked_at SET DEFAULT NOW();

-- Возвращаем step2_completed_at к UTC
ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN step2_completed_at TYPE timestamp with time zone
USING CASE 
    WHEN step2_completed_at IS NOT NULL 
    THEN (step2_completed_at AT TIME ZONE 'Asia/Yekaterinburg') AT TIME ZONE 'UTC'
    ELSE NULL 
END;

-- Возвращаем updated_at к UTC
ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN updated_at TYPE timestamp with time zone
USING (updated_at AT TIME ZONE 'Asia/Yekaterinburg') AT TIME ZONE 'UTC';

ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Возвращаем step2_started_at к UTC
ALTER TABLE t_p28851569_sentag_safety_system.request_forms
ALTER COLUMN step2_started_at TYPE timestamp with time zone
USING CASE 
    WHEN step2_started_at IS NOT NULL 
    THEN (step2_started_at AT TIME ZONE 'Asia/Yekaterinburg') AT TIME ZONE 'UTC'
    ELSE NULL 
END;