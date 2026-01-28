import { prisma } from '@/lib/db';
import BookClient from './BookClient';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { durationMin: 'asc' } });
  const staff = await prisma.user.findMany({ where: { active: true }, orderBy: { email: 'asc' } });

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Book an appointment</h1>
      <p className="text-sm text-muted-foreground">MVP: select service/staff/date, choose a slot, confirm booking.</p>

      <div className="pt-4">
        <BookClient services={services} staff={staff} />
      </div>
    </div>
  );
}
