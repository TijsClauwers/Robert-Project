import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const counts = await prisma.$transaction([
    prisma.user.count(),
    prisma.service.count(),
    prisma.booking.count(),
    prisma.customer.count(),
  ]);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Admin (MVP)</h1>
      <p>This is a placeholder admin overview (auth will be added next).</p>

      <ul>
        <li>Staff/users: {counts[0]}</li>
        <li>Services: {counts[1]}</li>
        <li>Bookings: {counts[2]}</li>
        <li>Customers: {counts[3]}</li>
      </ul>

      <p style={{ marginTop: 16 }}>
        Next: CRUD screens + role-based access + Stripe config.
      </p>

      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
