# Smart Productivity Management System

Full-stack implementation:
- Mobile App: React Native (Expo)
- Web Admin: React + Vite
- Backend API: Node.js + Express
- Database: PostgreSQL

## ✅ Implemented Functional Requirements

### Authentication
- `POST /auth/login` (JWT)
- `POST /auth/logout`
- Roles: `Admin`, `Manager`, `Employee`

### Mobile App
- Login Screen
- Dashboard Screen (task summary + audit score)
- Task List Screen
- Task Detail Screen (status update)
- 5S Audit Form Screen (score + image list)
- Improvement Ideas Screen (submit + vote)

### Web Admin
- Login Page
- Dashboard Page (stats + Chart.js)
- User Management (CRUD)
- Task Management (CRUD)
- Audit Results
- Reports Export (CSV + PDF)

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
- `POST /vote/:idea_id` (compatibility alias)
- `GET /reports/tasks.csv`
- `GET /reports/tasks.pdf`

## Database Tables
- `users`
- `departments`
- `tasks`
- `audits`
- `improvement_ideas`

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
- Manager: task/audit oversight + reports
- Admin: full access + user management
