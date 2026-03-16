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

```bash
cd smart-productivity-system/backend
cp .env.example .env
npm install
npm start
```

API base URL: `http://localhost:5000`

## 2) Database setup

Run in PostgreSQL:

```bash
psql -U postgres -f smart-productivity-system/database/schema.sql
psql -U postgres -f smart-productivity-system/database/seed.sql
```

## 3) Mobile app setup

```bash
cd smart-productivity-system/mobile-app
npm install
npm start
```

For Android emulator, `10.0.2.2` is used in `services/api.js` so the app can reach your local backend.
