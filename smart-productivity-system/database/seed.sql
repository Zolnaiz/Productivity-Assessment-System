\c productivity;

INSERT INTO departments (name)
VALUES ('Production'), ('Quality'), ('Warehouse')
ON CONFLICT (name) DO NOTHING;

-- Password: 123456
INSERT INTO users (name, email, password, role, department_id)
VALUES
  ('Admin User', 'admin@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Admin', 1),
  ('Manager User', 'manager@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Manager', 2),
  ('Employee User', 'employee@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Employee', 3)
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (title, description, assigned_user, status, deadline)
VALUES
  ('Prepare daily report', 'Finish and submit daily KPI report', 3, 'Pending', CURRENT_DATE + INTERVAL '1 day'),
  ('Review task backlog', 'Manager reviews all pending tasks', 2, 'In Progress', CURRENT_DATE + INTERVAL '2 day'),
  ('System setup', 'Initial setup of productivity system', 1, 'Completed', CURRENT_DATE + INTERVAL '3 day')
ON CONFLICT DO NOTHING;

INSERT INTO audits (department_id, score, date, images)
VALUES
  (1, 93, CURRENT_DATE, ARRAY['https://example.com/audit1.jpg']),
  (2, 87, CURRENT_DATE - INTERVAL '1 day', ARRAY['https://example.com/audit2.jpg'])
ON CONFLICT DO NOTHING;

INSERT INTO improvement_ideas (title, description, votes, user_id)
VALUES
  ('Kanban board', 'Use kanban board for visual task tracking', 5, 2),
  ('5S reminder', 'Daily reminder for 5S checklist completion', 3, 3)
ON CONFLICT DO NOTHING;
