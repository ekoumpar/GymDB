# GymDB Frontend

Minimal React frontend scaffold for the GymDB project.

Quickstart:

# GymDB frontend

Minimal React frontend for the GymDB project (Create React App).

## Quickstart

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start development server:

```bash
npm start
```

The development server uses a proxy (see `package.json`) to forward `/api` requests to the backend (default `http://localhost:4000`). Restart the dev server after changing `proxy`.

## Scripts

- `npm start` — start CRA dev server
- `npm run build` — produce production build in `build/`

## Mock-mode and testing

The backend can run in MOCK mode when the database is unavailable. While the backend is in MOCK mode you can use the following mock credentials to test auth/profile flows:

- username: `maria`
- password: `password123`

You can also test endpoints directly with curl or PowerShell's `Invoke-RestMethod`.

## API endpoints used by the frontend

- `POST /api/auth/login` — login, returns `{ ok: true, token, user }`
- `POST /api/auth/register` — register (returns token)
- `GET /api/classes` — list classes
- `POST /api/register` — register user to a class (protected)
- `GET /api/bookings` — list current user's bookings (protected)
- `DELETE /api/bookings/:id` — cancel a booking (protected)

## Environment / Notes

- The frontend expects the backend API under `/api` during development (CRA proxy). In production the backend serves the static frontend build and handles API routes on the same origin.
- If PowerShell blocks `npm` scripts, run the commands in CMD or Git Bash, or temporarily allow scripts for the session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm start
```

## Project structure

- `public/` — static assets and HTML entry
- `src/` — React source files
  - `src/pages/` — page components (`Home`, `Classes`, `Profile`, etc.)
  - `src/components/` — shared UI components (`Navbar`, etc.)
  - `src/api/api.js` — small wrapper around axios used by the app
  - `src/styles/` — app styles


