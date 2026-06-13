# Snip — URL Shortener with Analytics

A full-stack URL shortener with authentication, personal dashboards, and simple click analytics.

## Overview

Snip lets users sign up, log in, and shorten long URLs into compact links. Each user has a private dashboard listing all of their links, with click counts and basic visit analytics (total clicks, last visited time, and the 10 most recent visit timestamps).

---

## Features

- **Authentication**: Signup and login with hashed passwords (bcrypt) and JWT-based sessions.
- **URL Shortening**: Authenticated users can generate unique short codes for any valid URL.
- **Redirects**: Visiting a short link redirects to the original URL, increments the click count, and logs a visit.
- **Dashboard**: View all of your links with original URL, short URL, creation date, and total clicks. Copy, view analytics, or delete any link.
- **Analytics**: Per-link summary (total clicks, created date, last visited) plus the 10 most recent visit timestamps.
- **Modern UI**: Responsive SaaS-style interface built with React, Tailwind CSS, and toast notifications.

---

## Architecture Diagram

```
┌──────────────────┐        HTTPS/JSON         ┌──────────────────────┐
│   React Frontend  │  ───────────────────────▶ │   Express Backend     │
│  (Vite + Tailwind)│ ◀─────────────────────────│  (Node.js + JWT)       │
└──────────────────┘                            └──────────┬────────────┘
                                                             │
                                                     Prisma ORM (queries)
                                                             │
                                                             ▼
                                                  ┌──────────────────────┐
                                                  │     PostgreSQL        │
                                                  │  users / urls / visits│
                                                  └──────────────────────┘
```

Request flow for a redirect:

```
Browser ──GET /:shortCode──▶ Express ──find Url──▶ Postgres
                                  │
                                  ├─ increment click_count
                                  ├─ insert into visits
                                  └─ 302 redirect to original_url
```

---

## Database Schema

### users
| Column        | Type      | Notes                |
|---------------|-----------|----------------------|
| id            | UUID (PK) | default uuid         |
| name          | VARCHAR   |                       |
| email         | VARCHAR   | unique, indexed       |
| password_hash | TEXT      | bcrypt hash          |
| created_at    | TIMESTAMP | default now          |

### urls
| Column       | Type      | Notes                          |
|--------------|-----------|--------------------------------|
| id           | UUID (PK) | default uuid                   |
| user_id      | UUID (FK) | references users(id), cascade  |
| original_url | TEXT      |                                 |
| short_code   | VARCHAR   | unique, indexed                |
| click_count  | INTEGER   | default 0                      |
| created_at   | TIMESTAMP | default now                    |

### visits
| Column     | Type      | Notes                         |
|------------|-----------|-------------------------------|
| id         | UUID (PK) | default uuid                  |
| url_id     | UUID (FK) | references urls(id), cascade  |
| visited_at | TIMESTAMP | default now                   |

**Relationships**: `User (1) → (Many) Url` and `Url (1) → (Many) Visit`, both with cascading deletes.

---

## API Documentation

### Authentication

| Method | Endpoint             | Description                          | Auth |
|--------|----------------------|---------------------------------------|------|
| POST   | `/api/auth/register` | Create a new account                   | No   |
| POST   | `/api/auth/login`    | Log in and receive a JWT token         | No   |

**Register** — body:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Login** — body:
```json
{ "email": "jane@example.com", "password": "secret123" }
```

Both return:
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "...", "email": "...", "createdAt": "..." } }
```

### URLs (require `Authorization: Bearer <token>`)

| Method | Endpoint                  | Description                           |
|--------|---------------------------|----------------------------------------|
| POST   | `/api/urls`                | Create a short URL from `originalUrl` |
| GET    | `/api/urls`                | List the logged-in user's URLs        |
| DELETE | `/api/urls/:id`            | Delete a URL (must be owner)          |
| GET    | `/api/urls/:id/analytics`  | Get summary + recent visits           |

### Redirect (public)

| Method | Endpoint        | Description                                                  |
|--------|------------------|---------------------------------------------------------------|
| GET    | `/:shortCode`    | Redirects to the original URL, logs a visit, increments clicks |

---

## Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── urlController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── urlRoutes.js
│   ├── utils/
│   │   └── generateShortCode.js
│   ├── config/
│   │   └── prisma.js
│   └── server.js
├── .env.example
└── package.json

frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── Analytics.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── UrlForm.jsx
│   │   └── UrlTable.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.example
└── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or remotely

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL connection string and a strong JWT_SECRET

npm install
npx prisma migrate dev --name init
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
# Edit .env if your backend runs on a different URL

npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable        | Description                                  |
|------------------|-----------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string                   |
| `JWT_SECRET`     | Secret key used to sign JWT tokens             |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`)                       |
| `PORT`           | Port the API listens on (default `5000`)       |
| `BASE_URL`       | Base URL used to build short links             |
| `FRONTEND_URL`   | Frontend origin, used for CORS                 |

### Frontend (`frontend/.env`)
| Variable              | Description                  |
|------------------------|-------------------------------|
| `VITE_API_BASE_URL`    | Base URL of the backend API   |

---

## Assumptions Made

- A short code is a 7-character alphanumeric string generated with `nanoid`, checked for uniqueness against the database before saving.
- Only `http://` and `https://` URLs are accepted as valid "original URLs".
- The redirect route (`GET /:shortCode`) is public and does not require authentication, since short links are meant to be shared.
- Analytics are intentionally simple per the spec: total click count, last visited timestamp, and the 10 most recent visit timestamps only — no charts, geolocation, or device/browser tracking.
- Users can only view, manage, and see analytics for URLs they created; ownership is enforced via the JWT-authenticated `user_id`.
- Deleting a URL cascades to delete its associated visit records.
- Password minimum length is 6 characters, and emails are stored in lowercase to enforce case-insensitive uniqueness.

---

This project is a part of a hackathon run by https://katomaran.com
