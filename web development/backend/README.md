# GymDB backend

Minimal Express backend for the GymDB dump. Configure a MySQL/Postgres database using `gymDBDump.sql` import, then set environment variables in `.env`.

Setup (MySQL example):

1. Import SQL dump into MySQL:

```bash
mysql -u root -p gymdb < ../gymDBDump.sql
```

2. Install dependencies and run server:

```bash
cd backend
npm install
cp .env.example .env
# GymDB backend

Minimal Express backend for the GymDB dump. Configure a MySQL/Postgres database using `gymDBDump.sql` import, then set environment variables in `.env`.

## Setup (MySQL example)

1. Import SQL dump into MySQL:

```bash
mysql -u root -p gymdb < ../gymDBDump.sql
```

2. Install dependencies and run server:

```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed
npm start
```

## Endpoints
- `GET /api/members` - list members
- `GET /api/trainers` - list trainers
- `GET /api/classes` - list classes
- `GET /api/table/:name` - generic table reader (limited)
- `POST /api/members` - add member (JSON fields)
- `POST /api/register` - register member to class (`member_id`, `class_id`)

## Auth
- `POST /api/auth/register` - create a user with `username` and `password`, returns a JWT
- `POST /api/auth/login` - login with `username` and `password`, returns a JWT

## Protected endpoints
- `POST /api/members` and `POST /api/register` require an Authorization header: `Bearer <token>`

Make sure to set `JWT_SECRET` in `.env`.

## Database connection
- Ensure MySQL is running and you imported `gymDBDump.sql` into a database (default `gymdb`).
- Copy `.env.example` to `.env` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` appropriately.
- On startup the server will test DB connectivity and exit if it cannot connect.

Example `.env` values (local MySQL):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=gymdb
PORT=4000
JWT_SECRET=change_this_secret
```

## Project structure

Organized layout for the GymDB backend.

Top-level files
- `package.json` - dependencies and start scripts
- `.env.example` - environment variables template
- `.gitignore` - gitignore rules
- `server.js` - entry point that starts the server

Source tree (`src/`)
- `src/app.js` - Express app configuration (routes, static serving)
- `src/config/` - configuration helpers (e.g. `database.js`)
- `src/routes/` - Express routers (`api.js`)
- `src/controllers/` - controller functions for routes (placeholder)
- `src/services/` - business logic layer (placeholder)
- `src/models/` - data models (placeholder)
- `src/middleware/` - auth, validation, error handler, logger
- `src/utils/` - response helpers, validators, helpers

Notes
- Existing minimal API implementation has been moved into `src/routes/api.js` and uses `src/config/database.js` and `src/middleware/auth.js`.
- Several placeholder directories were created for `models`, `controllers`, `services` and `utils` so you can add domain-specific code there.
- Start the server from the repository root (backend) via `npm start`.

