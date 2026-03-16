# Smart Productivity Management System

Full-stack MVP+ implementation:
- Mobile App: React Native (Expo)
- Web Admin: React + Vite
- Backend API: Node.js + Express
- Database: PostgreSQL

## ✅ Implemented Functional Requirements

### Authentication
- `POST /auth/login` (JWT)
- `POST /auth/logout`
- Roles: `Admin`, `Manager`, `Employee`

### Mobile App (Employee/Manager/Admin)
- Login Screen
- Dashboard Screen (Task summary, Completed/Pending, 5S score)
- Task List Screen
- Task Detail Screen (status update)
- 5S Audit Form Screen (score + image URL)
- Improvement Ideas Screen (submit + vote)

### Web Admin (Admin/Manager)
- Login Page
- Dashboard Page (summary + chart)
- User Management Page (CRUD)
- Task Management Page (CRUD)
- Audit Results Page
- Reports Page (CSV export)

### Backend REST API
- `POST /auth/login`
- `POST /auth/logout`
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `GET /audits`
- `POST /audits`
- `GET /ideas`
- `POST /ideas`
- `POST /ideas/vote/:idea_id`
- `GET /reports/tasks.csv`

## Database Tables
- `users`
- `departments`
- `tasks`
- `audits`
- `improvement_ideas`

## Project Structure

```text
smart-productivity-system/
  backend/
    middleware/
    routes/
    database/
    server.js
  database/
    schema.sql
    init.sql
    seed.sql
  mobile-app/
    screens/
    services/
    App.js
  web-admin/
    src/pages/
    src/services/
```

## Quick Start

### 1) Database
```bash
cd smart-productivity-system
docker compose up -d
```

### 2) Backend
```bash
cd smart-productivity-system/backend
cp .env.example .env
npm install
npm start
```

### 3) Mobile
```bash
cd smart-productivity-system/mobile-app
npm install
npm start
```

### 4) Web Admin
```bash
cd smart-productivity-system/web-admin
npm install
npm run dev
```

## Demo Accounts
- `admin@smart.com` / `123456`
- `manager@smart.com` / `123456`
- `employee@smart.com` / `123456`

## Role Rules
- Employee: own tasks, update own progress, submit audits/ideas
- Manager: team/task/audit management + reports
- Admin: full access + user management

## Non-Functional Notes
- Security: bcrypt hash + JWT + RBAC
- Maintainability: module-based routes
- Extensibility: separate route files for each domain module
