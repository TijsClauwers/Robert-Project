'use server';

import { prisma } from '@/lib/db';

export async function upsertAvailability(formData: FormData): Promise<void> {
  const staffId = String(formData.get('staffId') || '');
  const dayOfWeek = Number(formData.get('dayOfWeek') || -1);
  const startMin = Number(formData.get('startMin') || 0);
  const endMin = Number(formData.get('endMin') || 0);

  if (!staffId) throw new Error('Missing staffId');
  if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error('Invalid dayOfWeek');
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
