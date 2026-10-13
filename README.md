# UrbanDana 🧢

> India's Original Bandana Cap — *Style That Never Stops*

Full-stack e-commerce application for the UrbanDana brand, a handcrafted-in-India bandana cap company founded by Vikram Kumar (Delhi & Dehradun, Uttarakhand).

## 📁 Repository Structure

```
UrbanDana/
├── backend/          # Node.js + Express + Prisma + SQLite API (port 4000)
│   ├── prisma/       # Database schema + migrations
│   ├── src/
│   │   ├── routes/   # /api/products, /api/auth, /api/cart, /api/orders, /api/cms
│   │   ├── lib/      # prisma client, auth (JWT), utils
│   │   ├── seed.js   # Database seed (10 products + admin user)
│   │   └── server.js # Express entry point
│   ├── uploads/      # Product images (served statically)
│   └── .env          # DATABASE_URL, JWT_SECRET, etc.
│
└── frontend/         # Next.js 16 + TypeScript + Tailwind 4 (port 3000)
    └── (scaffolded next)
```

## 🚀 Quick Start (Dev)

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed          # Creates 10 products + admin user
npm run dev           # http://localhost:4000
```

Admin login: **admin@urbandana.in** / **admin123**

### Frontend
```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

## 🛠 Tech Stack

| Layer    | Stack                                                            |
|----------|------------------------------------------------------------------|
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 |
| Backend  | Node.js 24 · Express 4 · Prisma 5 · JWT · bcrypt                 |
| Database | SQLite (dev) — swappable to PostgreSQL via `DATABASE_URL`        |
| Images   | Local file system (`/uploads/products/`)                         |

## ⚠️ Backend Note

The original plan was to use **Medusa.js** as the backend. However, Medusa v2 requires PostgreSQL and the dev environment has neither PostgreSQL nor Docker/sudo access. We pivoted to a **custom Node.js + Express + Prisma backend** — same JS ecosystem, same UX, full control. To swap to PostgreSQL in production, just change `DATABASE_URL` and run `npx prisma migrate deploy`.

## 📦 API Endpoints

| Method | Endpoint                          | Description                       |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/api/products`                   | List products (filter + paginate) |
| GET    | `/api/products/:slug`             | Single product by slug            |
| GET    | `/api/products/meta/categories`   | All distinct categories           |
| POST   | `/api/auth/register`              | Register customer                 |
| POST   | `/api/auth/login`                 | Login (customer or admin)         |
| GET    | `/api/auth/me`                    | Current user (JWT)                |
| GET    | `/api/cart`                       | Get cart (session or user)        |
| POST   | `/api/cart/items`                 | Add item to cart                  |
| PATCH  | `/api/cart/items/:itemId`         | Update quantity                   |
| DELETE | `/api/cart/items/:itemId`         | Remove item                       |
| POST   | `/api/orders`                     | Create order                      |
| GET    | `/api/orders/:orderNumber`        | Track order                       |
| GET    | `/api/cms/founder`                | Founder story                     |
| GET    | `/api/cms/brand`                  | Brand info                        |

## 🧢 Products Seeded

10 Urbandana products inferred from the brand's chat knowledge base:
1. Signature Red Paisley (Bestseller)
2. Café Culture Black (Bestseller)
3. Classic White Paisley (out of stock)
4. Sunset Art Cap (Limited, only 12 left)
5. Skull Edition (Limited)
6. Tiger Print (Limited)
7. Monkey Folk Art (Limited)
8. Visor Classic — Sand
9. Visor Duo Pack (Best Value, save ₹500)
10. Collector's Full Set (save ₹2,000)

100 product photos grouped 10-per-product, served from `/uploads/products/`.

## 👤 Founder

**Vikram Kumar** — Delhi & Dehradun, Uttarakhand, India 🇮🇳

*"What if the bandana and the cap became one?"*

## 📄 License

© 2024–2026 UrbanDana. All rights reserved.
