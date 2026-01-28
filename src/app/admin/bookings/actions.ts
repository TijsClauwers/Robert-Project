'use server';

import { prisma } from '@/lib/db';

export async function cancelBooking(bookingId: string) {
  await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
  return { ok: true as const };
}
