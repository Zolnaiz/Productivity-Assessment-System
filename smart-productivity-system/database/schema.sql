CREATE DATABASE productivity;

\c productivity;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Employee')),
  department_id INT REFERENCES departments(id)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  assigned_user INT REFERENCES users(id),
  deadline TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed'))
);

CREATE TABLE audits (
  id SERIAL PRIMARY KEY,
  department_id INT NOT NULL REFERENCES departments(id),
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);
