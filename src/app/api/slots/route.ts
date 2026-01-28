import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import { prisma } from '@/lib/db';
import { businessTz, parseIsoDateInTz } from '@/lib/time';

export const dynamic = 'force-dynamic';

function dayOfWeek0Sun(dt: DateTime) {
  // Luxon: 1=Mon..7=Sun
  return dt.weekday % 7;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('serviceId') || '';
  const staffId = searchParams.get('staffId') || '';
  const date = searchParams.get('date') || '';

  if (!serviceId || !staffId || !date) {
    return NextResponse.json({ error: 'Missing serviceId, staffId, or date' }, { status: 400 });
  }

  const tz = businessTz();
  const day = parseIsoDateInTz(date, tz);
  const dow = dayOfWeek0Sun(day);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  const avails = await prisma.availability.findMany({
    where: { staffId, dayOfWeek: dow },
    orderBy: { startMin: 'asc' },
  });

  const startOfDay = day.toUTC();
  const endOfDay = day.plus({ days: 1 }).toUTC();

  const bookings = await prisma.booking.findMany({
    where: {
      staffId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      startAt: { gte: startOfDay.toJSDate(), lt: endOfDay.toJSDate() },
    },
    select: { startAt: true, endAt: true },
  });

  const busy = bookings.map((b) => ({
    start: DateTime.fromJSDate(b.startAt, { zone: 'utc' }),
    end: DateTime.fromJSDate(b.endAt, { zone: 'utc' }),
  }));

  const durationMin = service.durationMin;
  const stepMin = 15;

  const slots: Array<{ startISO: string; endISO: string }> = [];

  for (const a of avails) {
    let cursor = day.plus({ minutes: a.startMin });
    const end = day.plus({ minutes: a.endMin });

    while (cursor.plus({ minutes: durationMin }) <= end) {
      const slotStartUtc = cursor.toUTC();
      const slotEndUtc = cursor.plus({ minutes: durationMin }).toUTC();

      const overlaps = busy.some((b) => slotStartUtc < b.end && slotEndUtc > b.start);
      if (!overlaps) {
        slots.push({ startISO: cursor.toISO()!, endISO: cursor.plus({ minutes: durationMin }).toISO()! });
      }
      cursor = cursor.plus({ minutes: stepMin });
    }
  }

  return NextResponse.json({
    tz,
    date,
    service: { id: service.id, name: service.name, durationMin: service.durationMin },
    staffId,
    slots,
  });
}
