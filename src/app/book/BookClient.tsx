'use client';

import { useEffect, useMemo, useState } from 'react';
import { createBooking } from './actions';

type Service = { id: string; name: string; durationMin: number; priceCents: number; currency: string; depositCents: number | null };
type Staff = { id: string; email: string; name: string | null };

type SlotResp = {
  tz: string;
  date: string;
  slots: Array<{ startISO: string; endISO: string }>;
};

export default function BookClient({ services, staff }: { services: Service[]; staff: Staff[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<SlotResp | null>(null);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setError(null);
      setSlots(null);
      setSlotIndex(null);
      try {
        const res = await fetch(`/api/slots?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load slots');
        if (!cancelled) setSlots(json);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    if (serviceId && staffId && date) load();
    return () => {
      cancelled = true;
    };
  }, [serviceId, staffId, date]);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccessId(null);
    if (slotIndex == null || !slots) {
      setError('Pick a time slot first.');
      return;
    }
    const chosen = slots.slots[slotIndex];
    formData.set('serviceId', serviceId);
    formData.set('staffId', staffId);
    formData.set('startISO', chosen.startISO);
    formData.set('endISO', chosen.endISO);

    const result = await createBooking(formData);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccessId(result.bookingId);
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>
          Service
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.durationMin} min — {(s.priceCents / 100).toFixed(2)} {s.currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          Staff
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }}>
            {staff.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ?? u.email}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
      </div>

      <div>
        <h3>Available slots {slots ? `(timezone: ${slots.tz})` : ''}</h3>
        {loadingSlots && <p>Loading…</p>}
        {!loadingSlots && slots && slots.slots.length === 0 && <p>No slots available for this selection.</p>}
        {!loadingSlots && slots && slots.slots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {slots.slots.map((s, i) => {
              const label = new Date(s.startISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const selected = i === slotIndex;
              return (
                <button
                  key={s.startISO}
                  type="button"
                  onClick={() => setSlotIndex(i)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    background: selected ? '#111' : '#fff',
                    color: selected ? '#fff' : '#111',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <form action={onSubmit} style={{ display: 'grid', gap: 10, border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
        <h3>Customer details</h3>
        <label>
          Name
          <input name="name" placeholder="Your name" style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <label>
          Phone
          <input name="phone" placeholder="+32…" style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <label>
          Notes
          <textarea name="notes" placeholder="Any notes…" style={{ display: 'block', width: '100%', padding: 8, minHeight: 90 }} />
        </label>

        {selectedService?.depositCents ? (
          <p style={{ color: '#444' }}>
            Payment not enabled yet. Intended deposit: {(selectedService.depositCents / 100).toFixed(2)} {selectedService.currency}
          </p>
        ) : null}

        <button type="submit" style={{ padding: 10, borderRadius: 10, border: 0, background: '#0ea5e9', color: '#fff', fontWeight: 600 }}>
          Confirm booking
        </button>

        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
        {successId ? (
          <p style={{ color: 'green' }}>
            Booking confirmed. ID: <code>{successId}</code>
          </p>
        ) : null}
      </form>
    </div>
  );
}
