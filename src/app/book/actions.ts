'use server';

import { prisma } from '@/lib/db';

export async function createBooking(formData: FormData) {
  const serviceId = String(formData.get('serviceId') || '');
  const staffId = String(formData.get('staffId') || '');
  const startISO = String(formData.get('startISO') || '');
  const endISO = String(formData.get('endISO') || '');

  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const notes = String(formData.get('notes') || '');

  if (!serviceId || !staffId || !startISO || !endISO) {
    return { ok: false as const, error: 'Missing required booking fields' };
  }

  const startAt = new Date(startISO);
  const endAt = new Date(endISO);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return { ok: false as const, error: 'Invalid start/end time' };
  }

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      name: name || null,
      email: email || null,
      phone: phone || null,
    },
  });

  // Ensure slot still free
  const overlap = await prisma.booking.findFirst({
    where: {
      staffId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true },
  });
  if (overlap) {
    return { ok: false as const, error: 'That slot was just taken. Please refresh and pick another time.' };
  }

  const booking = await prisma.booking.create({
    data: {
      serviceId,
      staffId,
      customerId: customer.id,
      startAt,
      endAt,
      status: 'CONFIRMED',
      notes: notes || null,
      intakeJson: {},
    },
    select: { id: true },
  });

  return { ok: true as const, bookingId: booking.id };
}
