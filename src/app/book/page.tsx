import { prisma } from '@/lib/db';
import Link from 'next/link';
import BookClient from './BookClient';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { durationMin: 'asc' } });
  const staff = await prisma.user.findMany({ where: { active: true }, orderBy: { email: 'asc' } });

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Book an appointment</h1>
      <p>MVP: pick service, staff, date → select slot → confirm booking.</p>

      <BookClient services={services} staff={staff} />

      <p style={{ marginTop: 16 }}>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
