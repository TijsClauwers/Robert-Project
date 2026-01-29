'use server';

import { prisma } from '@/lib/db';

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

export async function upsertAvailability(formData: FormData): Promise<void> {
  const staffId = String(formData.get('staffId') || '');
  const dayOfWeek = Number(formData.get('dayOfWeek') || -1);

  // Prefer time inputs (HH:MM). Fall back to numeric minutes if sent.
  const startTime = String(formData.get('startTime') || '');
  const endTime = String(formData.get('endTime') || '');
  const startMinRaw = formData.get('startMin');
  const endMinRaw = formData.get('endMin');

  const startMin = startTime ? toMin(startTime) : Number(startMinRaw || NaN);
  const endMin = endTime ? toMin(endTime) : Number(endMinRaw || NaN);

  if (!staffId) throw new Error('Missing staffId');
  if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error('Invalid dayOfWeek');
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) throw new Error('Invalid time values');
  if (startMin < 0 || endMin > 24 * 60 || endMin <= startMin) {
    throw new Error('Invalid time range');
  }

  await prisma.availability.create({
    data: { staffId, dayOfWeek, startMin, endMin },
  });
}

export async function deleteAvailability(id: string): Promise<void> {
  await prisma.availability.delete({ where: { id } });
}
