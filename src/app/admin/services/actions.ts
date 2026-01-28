'use server';

import { prisma } from '@/lib/db';

export async function createService(formData: FormData): Promise<void> {
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const durationMin = Number(formData.get('durationMin') || 0);
  const priceCents = Math.round(Number(formData.get('price') || 0) * 100);
  const depositCentsVal = formData.get('deposit');
  const depositCents = depositCentsVal ? Math.round(Number(depositCentsVal) * 100) : null;
  const currency = String(formData.get('currency') || 'EUR').trim().toUpperCase();

  if (!name || !durationMin || !Number.isFinite(durationMin)) {
    throw new Error('Name and duration are required.');
  }

  await prisma.service.create({
    data: {
      name,
      description: description || null,
      durationMin,
      priceCents: Number.isFinite(priceCents) ? priceCents : 0,
      depositCents: depositCents && Number.isFinite(depositCents) ? depositCents : null,
      currency: currency || 'EUR',
      active: true,
    },
  });
}

export async function toggleServiceActive(serviceId: string, active: boolean): Promise<void> {
  await prisma.service.update({ where: { id: serviceId }, data: { active } });
}

export async function updateService(serviceId: string, formData: FormData): Promise<void> {
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const durationMin = Number(formData.get('durationMin') || 0);
  const priceCents = Math.round(Number(formData.get('price') || 0) * 100);
  const depositCentsVal = formData.get('deposit');
  const depositCents = depositCentsVal ? Math.round(Number(depositCentsVal) * 100) : null;
  const currency = String(formData.get('currency') || 'EUR').trim().toUpperCase();

  if (!name || !durationMin || !Number.isFinite(durationMin)) {
    throw new Error('Name and duration are required.');
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      name,
      description: description || null,
      durationMin,
      priceCents: Number.isFinite(priceCents) ? priceCents : 0,
      depositCents: depositCents && Number.isFinite(depositCents) ? depositCents : null,
      currency: currency || 'EUR',
    },
  });
}
