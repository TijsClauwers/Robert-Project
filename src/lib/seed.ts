import { prisma } from './db';

export async function seed() {
  const adminEmail = 'admin@example.com';

  // Users
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', name: 'Admin' },
    create: { email: adminEmail, role: 'ADMIN', name: 'Admin' },
  });

  const staffEmails = ['alice@example.com', 'bob@example.com'];
  for (const email of staffEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { role: 'STAFF' },
      create: { email, role: 'STAFF', name: email.split('@')[0] },
    });
  }

  // Services
  const services = [
    { name: 'Consultation', durationMin: 30, priceCents: 5000, currency: 'EUR', depositCents: 2000 },
    { name: 'Extended session', durationMin: 60, priceCents: 9000, currency: 'EUR', depositCents: 3000 },
    { name: 'Workshop', durationMin: 120, priceCents: 18000, currency: 'EUR', depositCents: 5000 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.name },
      // hack: keep id stable via name only for seed simplicity
      update: { durationMin: s.durationMin, priceCents: s.priceCents, currency: s.currency, depositCents: s.depositCents },
      create: { id: s.name, ...s },
    });
  }

  // Availability: Mon-Fri 09:00-17:00 for all staff
  const staff = await prisma.user.findMany({ where: { role: 'STAFF' } });
  for (const u of staff) {
    for (const day of [1, 2, 3, 4, 5]) {
      await prisma.availability.upsert({
        where: { id: `${u.id}-${day}-9-17` },
        update: {},
        create: {
          id: `${u.id}-${day}-9-17`,
          staffId: u.id,
          dayOfWeek: day,
          startMin: 9 * 60,
          endMin: 17 * 60,
        },
      });
    }
  }

  return { adminId: admin.id };
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('seeded');
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
