# Freight Marketplace Backend (NestJS + Prisma + PostgreSQL)

Features:
- JWT Auth (register/login)
- Orders (create/list/detail/award)
- Bids (drivers submit price; customers view all; drivers see own)
- Conversations & Messages (1:1 chat per order-driver pair; multiple at once)

## Quick Start

1. Clone & install
```bash
npm install
```

2. Configure env
```
cp .env.example .env
# edit DATABASE_URL and JWT_SECRET
```

3. Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run
```bash
npm run start:dev
```

API runs on `http://localhost:${process.env.PORT || 3001}`

## Key Endpoints

- `POST /auth/register` { email, password, name, role: "customer" | "driver" }
- `POST /auth/login` { email, password }
- `GET /auth/me`

Orders:
- `POST /orders` (customer) { from, to, cargoType, weight?, volume? }
- `GET /orders?status=open` (driver sees open)
- `GET /orders?mine=true` (customer sees own)
- `GET /orders/:id`
- `POST /orders/:id/award` { driverId }

Bids:
- `POST /orders/:id/bids` { price, note? } (driver)
- `GET /orders/:id/my-bid` (driver)
- `GET /orders/:id/bids` (customer owner)

Conversations:
- `POST /conversations/start` { orderId, customerId, driverId } (idempotent)
- `GET /conversations/mine`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages` { text }

## Deploy on Railway

- Add a PostgreSQL service → copy `DATABASE_URL`
- Add a Web Service from GitHub repo
- Set env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT=3001`
- In Deploy tab, run: `npx prisma migrate deploy`
- Open the service URL
