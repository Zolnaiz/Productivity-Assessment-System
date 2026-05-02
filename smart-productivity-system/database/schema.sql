CREATE DATABASE productivity;
\c productivity;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  manager_id INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Employee')),
  department_id INT REFERENCES departments(id),
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE departments ADD CONSTRAINT fk_department_manager FOREIGN KEY (manager_id) REFERENCES users(id);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  assigned_user INT REFERENCES users(id),
  deadline TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_comments (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audits (
  id SERIAL PRIMARY KEY,
  department_id INT NOT NULL REFERENCES departments(id),
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  images TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(120) NOT NULL,
  entity VARCHAR(120),
  entity_id VARCHAR(120),
  details JSONB,
  ip VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_settings (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL DEFAULT 'My Company',
  logo TEXT,
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  theme VARCHAR(20) NOT NULL DEFAULT 'light' CHECK (theme IN ('light','dark')),
  email_from VARCHAR(150),
  allow_registration BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE improvement_ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
