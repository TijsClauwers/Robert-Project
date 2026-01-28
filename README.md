# Booking SaaS (MVP scaffold)

Multi-staff booking + intake + payments (Stripe) — first scaffold.

## Local dev

```bash
npm install
cp .env.example .env # optional; or edit .env directly

# Create DB + apply migrations
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Run
npm run dev
```

Open:
- http://localhost:3000/ (home)
- http://localhost:3000/book (lists seed services + staff)
- http://localhost:3000/admin (counts)

## What’s next

- Auth (admin/staff roles)
- Real availability UI + slot generation
- Stripe checkout + webhooks (confirm booking on payment)
- Emails + .ics calendar invite
- Vercel deploy + Postgres
