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

## Environment Configuration

### `.env.example` бүтэц
`smart-productivity-system/backend/.env.example` файл нь backend-ийн minimum required хувьсагчдыг агуулна:
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

`.env` үүсгэхдээ:
```bash
cd smart-productivity-system/backend
cp .env.example .env
```

> Backend нь дээрх DB хувьсагчид (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) байхгүй бол startup дээр explicit error throw хийж зогсоно.

### Docker Compose-д шаардлагатай `.env`
`smart-productivity-system/docker-compose.yml` нь Postgres нууц үгийг plaintext биш, root `.env` файлаас уншина:
- `POSTGRES_PASSWORD`

Root `.env` жишээ:
```env
POSTGRES_PASSWORD=change_me
```

## Setup

### 1) Database
**Location:** `smart-productivity-system/database`  

- `schema.sql` = **canonical schema (single source of truth)**. Бүх table definition, constraint-ууд зөвхөн энд засагдана.
- `init.sql` = **docker-entrypoint bootstrap script**. Энэ нь schema-г `\i /docker-entrypoint-initdb.d/02-schema.sql` гэж reference хийж дуудаж ажиллуулна (өөрөө schema-г давтаж агуулахгүй).
- `seed.sql` = **sample/demo өгөгдөл** (optional).

Docker (first init only):

```bash
cd smart-productivity-system
docker compose up -d
```

> `init.sql` автоматаар зөвхөн schema үүсгэнэ. Seed автоматаар ачаалахгүй.
> `docker compose up` ажиллуулахын өмнө `smart-productivity-system/.env` дотор `POSTGRES_PASSWORD`-аа заавал тохируулна.

Local PostgreSQL дээр шууд ажиллуулах:

```bash
psql -U postgres -d productivity -f smart-productivity-system/database/schema.sql
psql -U postgres -d productivity -f smart-productivity-system/database/seed.sql   # optional
```

CI орчинд зөвлөмж:

```bash
psql -U postgres -d productivity -f smart-productivity-system/database/schema.sql
# seed.sql-ийг зөвхөн integration/demo test хэрэгтэй үед ажиллуул
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

## Demo Accounts (Development Only)

⚠️ Эдгээр demo credential-ууд нь **зөвхөн development/demo орчинд** ашиглах зориулалттай. Production орчинд ашиглахыг хориглоно.

- **Admin:** `admin@smart.com` / `123456`
- **Manager:** `manager@smart.com` / `123456`
- **Employee:** `employee@smart.com` / `123456`

## Access Rules
- **Employee:** өөрийн task харах/шинэчлэх, audit ба idea оруулах
- **Manager:** task/audit хянах, тайлан үзэх
- **Admin:** бүрэн эрх + хэрэглэгчийн удирдлага

## Troubleshooting Login Errors

If web login shows **"Server error"**:

1. Verify backend health:
   ```bash
   curl http://localhost:5000/health
   ```
2. Ensure schema and seed are loaded:
   ```bash
   psql -U postgres -d productivity -f smart-productivity-system/database/schema.sql
   psql -U postgres -d productivity -f smart-productivity-system/database/seed.sql
   ```
3. Test login API directly:
   ```bash
   curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@smart.com","password":"123456"}'
   ```

For PowerShell use `Invoke-RestMethod` instead of `curl` alias when posting JSON.
