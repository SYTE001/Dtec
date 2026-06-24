# WANG LIN — Fullstack Personal Portfolio

Production-ready personal portfolio with:
- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Node.js + Express API
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Roles:** Visitor + Admin

## 1) Folder Structure

```bash
Dtec/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validators.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── content.js
│   │   ├── uploads/
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── about/page.js
│   │   ├── admin/
│   │   │   ├── dashboard/page.js
│   │   │   └── login/page.js
│   │   ├── contact/page.js
│   │   ├── portfolio/
│   │   │   ├── [id]/page.js
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── Navbar.js
│   │   └── theme-provider.js
│   ├── lib/api.js
│   ├── .env.example
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## 2) Full Source Code
All source code is included in this repository under `frontend/` and `backend/`.

## 3) Database Schema

Tables:
- `users` (admin only)
- `projects`
- `skills`
- `about`
- `contacts`
- `contact_info`

Schema and creation logic are in:
- `backend/db/schema.sql` (canonical SQL schema)
- `backend/src/migrate.js` (runtime migration script)

## 4) Step-by-Step Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### A. Setup PostgreSQL quickly with Docker
```bash
docker compose up -d postgres
```

### B. Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

### C. Frontend setup
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## 5) How to Run Locally
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/health`

## 6) How to Deploy

### Option A — Vercel (Frontend) + VPS/Render/Railway (Backend)
1. Deploy `frontend/` to Vercel.
2. Set Vercel env:
   - `NEXT_PUBLIC_API_URL=https://<backend-domain>/api`
   - `NEXT_PUBLIC_ASSET_URL=https://<backend-domain>`
3. Deploy `backend/` to Node host.
4. Set backend env:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL=https://<vercel-domain>`
5. Run migrations + seed in backend host.

### Option B — Docker Compose
```bash
docker compose up --build -d
```

## 7) Default Admin Login Info
- Email: `wanglin@gmail.com`
- Password: `121212`

> Change password and JWT secret in production.

## Main Features Covered
- Public pages: landing, about, portfolio list + detail, contact form
- Admin: login/logout, dashboard, CRUD projects & skills, edit about + contact info
- Upload image for projects (`multer`)
- Validation/sanitization (`zod`, `sanitize-html`)
- Security: JWT auth, bcrypt hash, protected routes, login rate limit, helmet
- Performance: static rendering + revalidation, optimized Next.js images, lazy image behavior
- SEO basics: metadata in app layout
