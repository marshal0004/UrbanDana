# UrbanDana — Local Setup Guide (Arch Linux)

> Complete step-by-step instructions to run UrbanDana on an Arch Linux laptop.
> Tested on Arch Linux with kernel 6.x. Should also work on Manjaro / EndeavourOS.

---

## 1. Install System Prerequisites

### Update system and install base packages

```bash
sudo pacman -Syu
sudo pacman -S --needed git nodejs npm curl python unzip base-devel
```

### Verify versions

```bash
node --version    # must be >= 18 (Node 20+ recommended)
npm --version
git --version
python --version  # Python 3.x
```

If `node` is missing or outdated, install the latest:

```bash
sudo pacman -S nodejs npm
```

### (Optional) Use `nvm` to manage multiple Node versions

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc   # or ~/.zshrc
nvm install --lts
nvm use --lts
```

---

## 2. Clone the Repository

```bash
cd ~/Projects    # or wherever you keep code
git clone https://github.com/marshal0004/UrbanDana.git
cd UrbanDana
```

Expected top-level structure:

```
UrbanDana/
├── backend/
├── frontend/
├── scripts/
└── README.md
```

---

## 3. Backend Setup

### 3.1 Install dependencies

```bash
cd backend
npm install
```

### 3.2 Configure environment

Create `.env` in `backend/`:

```bash
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_SECRET="urbandana-dev-secret-change-in-production"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Razorpay — leave empty to run in COD-only mode
# Get test keys from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
EOF
```

### 3.3 Initialize the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates `backend/prisma/dev.db` (SQLite file).

### 3.4 Seed the database

```bash
npm run seed
```

Expected output:

```
Image pools: caps=298, tshirts=18, models=18, combos=3
Seeding UrbanDana v4 (real tshirt images + model shots)...
   Cleared existing data
   Admin: admin@urbandana.in / admin123
   [CAP] Signature Red Paisley  (30 images)
   ... (18 products total)
Seed v4 complete!
```

### 3.5 Start the backend

```bash
npm run dev
```

Backend runs at **http://localhost:4000**.

Verify in another terminal:

```bash
curl http://localhost:4000/
# {"name":"UrbanDana API","version":"1.0.0","docs":"/api","health":"ok"}

curl http://localhost:4000/api/products?limit=3
# Returns 3 products with images
```

### 3.6 (Optional) Prisma Studio — GUI to view/edit data

```bash
npm run studio
```

Opens at **http://localhost:5555** — browse products, users, orders visually.

---

## 4. Frontend Setup

### 4.1 Install dependencies

```bash
cd ../frontend
npm install
```

### 4.2 Configure environment

Create `.env.local` in `frontend/`:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BRAND_NAME=URBANDANA
NEXT_PUBLIC_BRAND_TAGLINE=Style That Never Stops
EOF
```

### 4.3 Start the frontend

```bash
npm run dev
```

Frontend runs at **http://localhost:3000**.

Open in your browser — you should see the Urbandana homepage with:
- Hero carousel with "STYLE THAT NEVER STOPS" headline
- Snitch-style mega-menu navbar
- Category grid, trending products with chip filters
- Footer with newsletter signup

---

## 5. Run the Test Suites

### 5.1 Jest unit tests (backend)

```bash
cd backend
npm test
```

Expected: **46/46 tests pass** across 6 suites (products, auth, cart, orders, payments, cms).

### 5.2 Playwright E2E tests (frontend)

First-time only — install the Playwright browser:

```bash
cd frontend
npx playwright install chromium
```

Then run:

```bash
npx playwright test
```

Expected: **14/14 tests pass** covering homepage, mega menu, shop, product detail, cart, login, signup, admin login, about, 404, mobile viewport, all nav links.

> ⚠️ The Playwright tests require **both backend and frontend to be running** in separate terminals. Start them first:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd frontend && npx playwright test
```

### 5.3 Curl integration tests (full system)

```bash
cd ..    # back to project root
bash scripts/test_all.sh
```

Expected: **85/85 tests pass** — covers every API endpoint, every flow, edge cases, and a full E2E customer journey (register → login → add to cart → checkout → verify order).

---

## 6. Default Accounts

| Role     | Email                    | Password    | Notes                                  |
|----------|--------------------------|-------------|----------------------------------------|
| Admin    | `admin@urbandana.in`     | `admin123`  | Full admin access, can view all orders |
| Customer | (register your own)      | (your pw)   | Visit http://localhost:3000/signup     |

---

## 7. Enable Razorpay Payments (Optional)

By default the site runs in **COD-only mode**. To enable online payments:

1. Create a free Razorpay account: https://razorpay.com
2. Go to **Dashboard → Settings → API Keys → Generate Test Keys**
3. Edit `backend/.env`:

```bash
RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXX"
RAZORPAY_KEY_SECRET="YYYYYYYYYYYYYYYYYYYY"
```

4. Restart backend: `Ctrl+C` then `npm run dev` again
5. Verify:

```bash
curl http://localhost:4000/api/payments/health
# {"razorpay":true,"mode":"LIVE","keyId":"rzp_test_XXXX"}
```

6. Checkout page will now show the "Online Payment" option as enabled.

---

## 8. Project Structure

```
UrbanDana/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # 10 models (Product, User, Order, Cart, etc.)
│   │   └── migrations/          # Auto-generated SQL migrations
│   ├── src/
│   │   ├── app.js               # Express app factory (for testing)
│   │   ├── server.js            # Server entry point
│   │   ├── seed.js              # Database seed (18 products + admin)
│   │   ├── routes/
│   │   │   ├── products.js      # GET /api/products, /api/products/:slug
│   │   │   ├── auth.js          # POST /api/auth/register, login, GET /me
│   │   │   ├── cart.js          # GET/POST/PATCH/DELETE /api/cart
│   │   │   ├── orders.js        # POST /api/orders, GET /api/orders/:orderNumber
│   │   │   ├── payments.js      # POST /api/payments/create-order, verify
│   │   │   └── cms.js           # GET /api/cms/founder, /api/cms/brand
│   │   └── lib/
│   │       ├── prisma.js        # Prisma client singleton
│   │       ├── auth.js          # JWT sign/verify, authMiddleware
│   │       └── utils.js         # rupee(), slugify(), generateOrderNumber()
│   ├── tests/                   # Jest unit tests (6 suites, 46 tests)
│   ├── uploads/products/        # Product images (committed to repo)
│   │   ├── caps/                # 298 bandana cap images
│   │   ├── tshirts/             # 18 tshirt product shots
│   │   ├── models/              # 18 model-wearing-tee shots
│   │   └── combos/              # 3 tshirt+cap combo shots
│   └── .env                     # Environment variables (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Home (hero, categories, trending, etc.)
│   │   │   ├── shop/page.tsx    # Product listing with filters
│   │   │   ├── product/[slug]/  # Product detail page
│   │   │   ├── cart/            # Cart page
│   │   │   ├── checkout/        # Checkout with Razorpay/COD
│   │   │   ├── login/           # Login page
│   │   │   ├── signup/          # Signup page
│   │   │   ├── account/         # Protected — shows user's orders
│   │   │   ├── wishlist/        # localStorage-backed wishlist
│   │   │   └── about/           # Brand story
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.tsx       # Mega-menu nav (Snitch-style)
│   │   │   ├── Footer.tsx       # 4-column footer (Bewakoof-style)
│   │   │   ├── CartDrawer.tsx   # Slide-out cart
│   │   │   ├── ProductCard.tsx  # Hover-swap card with wishlist + quick-add
│   │   │   └── sections/        # Homepage sections (Hero, Stats, etc.)
│   │   ├── context/
│   │   │   ├── ShopContext.tsx  # Cart state (session-based)
│   │   │   └── AuthContext.tsx  # JWT auth state
│   │   ├── lib/
│   │   │   ├── api.ts           # Typed API client
│   │   │   └── utils.ts         # cn(), rupee(), discountPct()
│   │   └── hooks/
│   │       └── useInView.ts     # IntersectionObserver hook
│   ├── tests/e2e.spec.ts        # Playwright E2E (14 tests)
│   ├── playwright.config.ts
│   ├── next.config.js           # API proxy to backend
│   └── .env.local               # Frontend env vars (gitignored)
│
└── scripts/
    ├── test_all.sh              # 85-test curl integration suite
    └── classify_tshirts.py      # Image classification utility
```

---

## 9. Common Issues & Fixes

### Issue: `prisma migrate dev` fails with "database does not exist"

**Fix**: Delete the existing dev.db and retry:

```bash
cd backend
rm -f prisma/dev.db
npx prisma migrate dev --name init
npm run seed
```

### Issue: `EADDRINUSE: address already in use :::4000`

**Fix**: Kill the process holding port 4000:

```bash
lsof -i :4000
kill -9 <PID>
# or
fuser -k 4000/tcp
```

### Issue: Frontend shows "Failed to fetch products"

**Cause**: Backend not running, or wrong `NEXT_PUBLIC_API_URL`.

**Fix**:
1. Verify backend is running: `curl http://localhost:4000/`
2. Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000`
3. Restart frontend: `Ctrl+C` then `npm run dev`

### Issue: Jest tests fail with "secretOrPrivateKey must have a value"

**Cause**: `.env` file missing or `JWT_SECRET` not set.

**Fix**:

```bash
cd backend
# Recreate .env (see section 3.2)
npm test
```

### Issue: Playwright tests fail with "browser not found"

**Fix**:

```bash
cd frontend
npx playwright install chromium
# If that fails, install system deps:
sudo pacman -S nss atk at-spi2-atk cups libxkbcommon xdg-utils libdrm mesa
npx playwright install-deps chromium
```

### Issue: `npm install` fails with peer dependency errors

**Fix**:

```bash
npm install --legacy-peer-deps
```

### Issue: Images not loading on frontend

**Cause**: Backend not serving `/uploads/` correctly.

**Fix**:
1. Verify: `curl -I http://localhost:4000/uploads/products/caps/caps-001.jpg` should return `200 OK`
2. If 404: ensure you're running `npm run dev` from the `backend/` directory (not project root)

### Issue: Arch Linux — `npm` global packages not found

**Fix**: Add npm global bin to PATH:

```bash
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Issue: Arch Linux — Playwright chromium won't launch

Arch Linux sometimes needs additional libraries. Install them:

```bash
sudo pacman -S libxcb libxcomposite libxdamage libxrandr libxss libxtst
npx playwright install --with-deps chromium
```

---

## 10. Development Workflow

### Make code changes

- Backend: edit files in `backend/src/`, nodemon auto-restarts on save
- Frontend: edit files in `frontend/src/`, Next.js hot-reloads on save

### Reset the database

```bash
cd backend
rm -f prisma/dev.db
npx prisma migrate dev --name init
npm run seed
```

### Run all tests before committing

```bash
# Terminal 1: backend running
cd backend && npm run dev &

# Terminal 2: frontend running
cd frontend && npm run dev &

# Wait 10s for servers to start
sleep 10

# Run all test suites
cd backend && npm test                    # 46 Jest tests
cd ../frontend && npx playwright test     # 14 E2E tests
cd .. && bash scripts/test_all.sh         # 85 curl tests
```

Expected: **145/145 tests pass**.

---

## 11. Production Deployment (Optional)

### Backend → Railway / Render

1. Push repo to GitHub
2. Create new project on Railway.app
3. Connect GitHub repo
4. Set root directory: `backend`
5. Build command: `npm install && npx prisma generate`
6. Start command: `npm run start`
7. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
8. Railway gives you a URL like `https://urbandana-api.up.railway.app`

### Frontend → Vercel

1. Push repo to GitHub
2. Import project on Vercel.com
3. Set root directory: `frontend`
4. Framework preset: Next.js
5. Add env var: `NEXT_PUBLIC_API_URL=https://urbandana-api.up.railway.app`
6. Deploy → get URL like `https://urbandana.vercel.app`

### Update frontend to use production API

Edit `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://urbandana-api.up.railway.app
```

Or set the env var in Vercel dashboard.

---

## 12. Quick Reference — All Commands

```bash
# Setup (one-time)
git clone https://github.com/marshal0004/UrbanDana.git
cd UrbanDana/backend && npm install && npx prisma generate && npx prisma migrate dev --name init && npm run seed
cd ../frontend && npm install && npx playwright install chromium

# Run (daily)
cd backend && npm run dev        # http://localhost:4000
cd frontend && npm run dev       # http://localhost:3000

# Test
cd backend && npm test                       # 46 Jest tests
cd frontend && npx playwright test            # 14 E2E tests
bash scripts/test_all.sh                      # 85 curl tests

# Database
cd backend && npx prisma studio               # GUI at :5555
cd backend && npm run seed                    # Re-seed
cd backend && rm -f prisma/dev.db && npx prisma migrate dev --name init && npm run seed  # Reset

# Build for production
cd frontend && npm run build                  # Outputs to .next/
```

---

## 13. Need Help?

- **Repo**: https://github.com/marshal0004/UrbanDana
- **Issues**: Open an issue on GitHub
- **Admin login**: `admin@urbandana.in` / `admin123`
- **Default ports**: Backend 4000, Frontend 3000, Prisma Studio 5555

---

*Last updated: 2026-10-14. Tested on Arch Linux 6.x with Node 20+.*
