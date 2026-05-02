# Smart Productivity Management System

Энэ төсөл нь бүтэн stack бүтэцтэй productivity management system:
- **Database**: PostgreSQL
- **Backend API**: Node.js + Express
- **Mobile App**: React Native (Expo)
- **Web Admin**: React + Vite

## Project Structure

- `smart-productivity-system/database` — database schema болон seed өгөгдөл
- `smart-productivity-system/backend` — REST API болон authentication
- `smart-productivity-system/mobile-app` — ажилтны mobile хэрэглүүр
- `smart-productivity-system/web-admin` — удирдлагын web admin самбар

## Core Features

### Authentication & Roles
- `POST /auth/login` (JWT)
- `POST /auth/logout`
- Role-based access: `Admin`, `Manager`, `Employee`

### Mobile App
- Нэвтрэх дэлгэц
- Dashboard (task summary + audit score)
- Даалгаврын жагсаалт ба дэлгэрэнгүй
- 5S аудитын форм (оноо + зураг)
- Сайжруулалтын санал (submit + vote)

### Web Admin
- Нэвтрэх хуудас
- Dashboard (статистик + chart)
- Хэрэглэгчийн удирдлага (CRUD)
- Даалгаврын удирдлага (CRUD)
- Аудитын үр дүн ба тайлан (CSV/PDF)

### Backend API (high-level)
- Users: `GET/POST/PUT/DELETE /users`
- Tasks: `GET/POST/PUT/DELETE /tasks`
- Audits: `GET/POST /audits`
- Ideas: `GET/POST /ideas`, `POST /ideas/vote/:idea_id`
- Reports: `GET /reports/tasks.csv`, `GET /reports/tasks.pdf`

## Required Environment Variables

Backend `.env` дотор дараах хувьсагчид заавал байна:
- `JWT_SECRET`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `CORS_ORIGINS`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLIENT_URL`

## Setup

### 1) Database
**Location:** `smart-productivity-system/database`  
**Purpose:** PostgreSQL schema болон seed өгөгдөл үүсгэх

```bash
cd smart-productivity-system
docker compose up -d
```

Эсвэл PostgreSQL дээр шууд ажиллуулах бол:

```bash
psql -U postgres -f smart-productivity-system/database/schema.sql
psql -U postgres -f smart-productivity-system/database/seed.sql
```

### 2) Backend
**Location:** `smart-productivity-system/backend`  
**Purpose:** REST API + authentication server

```bash
cd smart-productivity-system/backend
cp .env.example .env
npm install
npm start
```

Default API URL: `http://localhost:5000`

### 3) Mobile
**Location:** `smart-productivity-system/mobile-app`  
**Purpose:** Employee mobile application

```bash
cd smart-productivity-system/mobile-app
npm install
npm start
```

Android emulator ашиглаж байвал `services/api.js` дотор `10.0.2.2` ашиглан local backend рүү холбогдоно.

### 4) Web Admin
**Location:** `smart-productivity-system/web-admin`  
**Purpose:** Admin/Manager веб удирдлагын самбар

```bash
cd smart-productivity-system/web-admin
npm install
npm run dev
```

## Demo Accounts

- **Admin:** `admin@smart.com` / `123456`
- **Manager:** `manager@smart.com` / `123456`
- **Employee:** `employee@smart.com` / `123456`

## Access Rules
- **Employee:** өөрийн task харах/шинэчлэх, audit ба idea оруулах
- **Manager:** task/audit хянах, тайлан үзэх
- **Admin:** бүрэн эрх + хэрэглэгчийн удирдлага
