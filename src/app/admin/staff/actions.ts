'use server';

import { prisma } from '@/lib/db';

export async function toggleUserActive(userId: string, active: boolean): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { active } });
}

export async function setUserRole(userId: string, role: 'ADMIN' | 'STAFF'): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function createStaff(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const name = String(formData.get('name') || '').trim();
  const role = String(formData.get('role') || 'STAFF') as 'ADMIN' | 'STAFF';

  if (!email.includes('@')) throw new Error('Valid email required.');

  await prisma.user.create({
    data: { email, name: name || null, role, active: true },
  });
}
