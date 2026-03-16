<<<<<<< HEAD
# Smart Productivity Management System

Энэ нь бүтэн stack хэрэгжилттэй систем:
- Mobile App: React Native (Expo)
- Web Admin: React + Vite
- Backend API: Node.js + Express
- Database: PostgreSQL

## ✅ Хийгдсэн боломжууд

### Нэвтрэлт ба эрх
- `POST /auth/login` (JWT)
- `POST /auth/logout`
- Эрхийн түвшин: `Admin`, `Manager`, `Employee`

### Mobile App
- Нэвтрэх дэлгэц
- Хянах самбар (task summary + audit score)
- Даалгаврын жагсаалт
- Даалгаврын дэлгэрэнгүй (төлөв шинэчлэх)
- 5S аудитын форм (оноо + зураг)
- Сайжруулалтын санал (санал оруулах + vote)

### Web Admin
- Нэвтрэх хуудас
- Dashboard (статистик + Chart.js)
- Хэрэглэгчийн удирдлага (CRUD)
- Даалгаврын удирдлага (CRUD)
- Аудитын үр дүн
- Тайлан татах (CSV + PDF)

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

## Database хүснэгтүүд
- `users`
- `departments`
- `tasks`
- `audits`
- `improvement_ideas`

## Асаах заавар

### 1) Database
```bash
cd smart-productivity-system
docker compose up -d
```

### 2) Backend
=======
# Smart Productivity Management System (MVP Start)

This repository now contains the first implementation phase:

1. Backend API (`Node.js + Express`)
2. Database scripts (`PostgreSQL`)
3. Mobile Login screen (`React Native + Expo`)

## Project structure

- `smart-productivity-system/backend` — Express API with `/auth/login`
- `smart-productivity-system/database` — `schema.sql` and `seed.sql`
- `smart-productivity-system/mobile-app` — Expo mobile app with login screen

## 1) Backend setup

>>>>>>> origin/main
```bash
cd smart-productivity-system/backend
cp .env.example .env
npm install
npm start
```

<<<<<<< HEAD
### 3) Mobile
=======
API base URL: `http://localhost:5000`

## 2) Database setup

Run in PostgreSQL:

```bash
psql -U postgres -f smart-productivity-system/database/schema.sql
psql -U postgres -f smart-productivity-system/database/seed.sql
```

## 3) Mobile app setup

>>>>>>> origin/main
```bash
cd smart-productivity-system/mobile-app
npm install
npm start
```

<<<<<<< HEAD
### 4) Web Admin
```bash
cd smart-productivity-system/web-admin
npm install
npm run dev
```

## Demo хаягууд
- `admin@smart.com` / `123456`
- `manager@smart.com` / `123456`
- `employee@smart.com` / `123456`

## Эрхийн дүрэм
- Employee: өөрийн task-г харах/шинэчлэх, audit/idea оруулах
- Manager: task/audit хянах + тайлан
- Admin: бүрэн эрх + хэрэглэгчийн удирдлага
=======
For Android emulator, `10.0.2.2` is used in `services/api.js` so the app can reach your local backend.
>>>>>>> origin/main
