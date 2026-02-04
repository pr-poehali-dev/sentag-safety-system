-- Переносим существующих посетителей из page_visits в visitors
INSERT INTO t_p28851569_sentag_safety_system.visitors (visitor_id, first_visit, last_activity, user_agent)
SELECT 
    visitor_id,
    MIN(visited_at) as first_visit,
    MAX(visited_at) as last_activity,
    MAX(user_agent) as user_agent
FROM t_p28851569_sentag_safety_system.page_visits
WHERE visitor_id IS NOT NULL
GROUP BY visitor_id
ON CONFLICT (visitor_id) DO NOTHING;