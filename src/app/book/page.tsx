import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { durationMin: 'asc' } });
  const staff = await prisma.user.findMany({ where: { active: true }, orderBy: { email: 'asc' } });

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Book</h1>
      <p>Select a service + staff (MVP). Slot picking will come next.</p>

      <h2>Services</h2>
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> — {s.durationMin} min — {(s.priceCents / 100).toFixed(2)} {s.currency}
            {s.depositCents ? ` (deposit ${(s.depositCents / 100).toFixed(2)} ${s.currency})` : ''}
          </li>
        ))}
      </ul>

      <h2>Staff</h2>
      <ul>
        {staff.map((u) => (
          <li key={u.id}>{u.name ?? u.email} ({u.email})</li>
        ))}
      </ul>

      <p style={{ marginTop: 16 }}>
        Next: calendar UI + availability-based slot generation + checkout.
      </p>

      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
