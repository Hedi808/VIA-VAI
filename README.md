# VIA VAI — Full-Stack JavaScript Starter

A simple frontend and backend project that does **not** use Python, Flask, or FastAPI.

## Stack

- **Frontend:** HTML, CSS, and browser JavaScript
- **Backend:** Node.js using the built-in `node:http` module
- **Dependencies:** None

## Features

- Responsive, designed **VIA VAI** wordmark
- Animated visual background
- Frontend-to-backend API request
- Static frontend files served by the Node.js backend
- Small JSON API with `/api/status` and `/api/greeting`

## Run locally

1. Install Node.js 22 or newer.
2. Open a terminal inside the project folder.
3. Start the app:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

For automatic server restarts during development:

```bash
npm run dev
```

## API routes

### GET `/api/status`

Returns the backend status and current timestamp.

### GET `/api/greeting?name=Ayham`

Returns a personalized greeting.

## Project structure

```text
via-vai-fullstack/
├── backend/
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
└── README.md
```
