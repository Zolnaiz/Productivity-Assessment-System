# Smart Productivity Management System

Энэ repository нь бүтэн stack хэрэгжилттэй productivity management system юм.

- **Mobile App**: React Native (Expo)
- **Web Admin**: React + Vite
- **Backend API**: Node.js + Express
- **Database**: PostgreSQL

## Project structure

- `smart-productivity-system/backend` — REST API (`/auth`, `/users`, `/tasks`, `/audits`, `/ideas`, `/reports`)
- `smart-productivity-system/database` — `schema.sql`, `seed.sql`
- `smart-productivity-system/mobile-app` — Expo mobile app
- `smart-productivity-system/web-admin` — Vite admin dashboard

## Features

### Authentication & roles
- JWT login/logout
- Role-based access: `Admin`, `Manager`, `Employee`

### Mobile app
- Login
- Dashboard (task summary + audit score)
- Task list + task detail/update
- 5S audit form
- Improvement ideas (create + vote)

### Web admin
- Login
- Dashboard + charts
- User management (CRUD)
- Task management (CRUD)
- Audit results
- Report export (CSV/PDF)

## Setup guide

### 1) Database setup

#### Option A: Docker Compose
```bash
cd smart-productivity-system
docker compose up -d
```

#### Option B: Run SQL manually
```bash
psql -U postgres -f smart-productivity-system/database/schema.sql
psql -U postgres -f smart-productivity-system/database/seed.sql
```

### 2) Backend setup
```bash
cd smart-productivity-system/backend
cp .env.example .env
npm install
npm start
```

Backend runs at: `http://localhost:5000`

### 3) Mobile app setup
```bash
cd smart-productivity-system/mobile-app
npm install
npm start
```

> Android emulator uses `10.0.2.2` in `mobile-app/services/api.js` to reach your local backend.

### 4) Web admin setup
```bash
cd smart-productivity-system/web-admin
npm install
npm run dev
```

## Demo accounts

- `admin@smart.com` / `123456`
- `manager@smart.com` / `123456`
- `employee@smart.com` / `123456`

## Role rules

- **Employee**: өөрийн task харах/шинэчлэх, audit/idea оруулах
- **Manager**: task/audit хянах, тайлан харах
- **Admin**: бүрэн эрх, хэрэглэгчийн удирдлага
