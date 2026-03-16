\c productivity;

INSERT INTO departments (name)
VALUES ('Production'), ('Quality'), ('Warehouse');

-- Password for all sample users: 123456
INSERT INTO users (name, email, password, role, department_id)
VALUES
  ('Admin User', 'admin@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Admin', 1),
  ('Manager User', 'manager@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Manager', 2),
  ('Employee User', 'employee@smart.com', '$2b$10$Vl5sFjzN2nqS6ToM6A5Qx.7ZK3fFGgKfQyUjAap8hULwdlY7E7wIe', 'Employee', 3);

INSERT INTO tasks (title, description, assigned_user, deadline, status)
VALUES
  ('Prepare daily report', 'Finish and submit daily KPI report', 3, NOW() + INTERVAL '1 day', 'Pending'),
  ('Review task backlog', 'Manager reviews all pending tasks', 2, NOW() + INTERVAL '2 days', 'In Progress'),
  ('System setup', 'Initial setup of productivity system', 1, NOW() + INTERVAL '3 days', 'Completed');

INSERT INTO audits (department_id, score, date)
VALUES
  (1, 92.50, CURRENT_DATE),
  (2, 87.20, CURRENT_DATE - INTERVAL '1 day'),
  (3, 90.00, CURRENT_DATE - INTERVAL '2 days');
