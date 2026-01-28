'use client';

import { useEffect, useMemo, useState } from 'react';
import { createBooking } from './actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Service = {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number;
  currency: string;
  depositCents: number | null;
};

type Staff = { id: string; email: string; name: string | null };

type SlotResp = {
  tz: string;
  date: string;
  slots: Array<{ startISO: string; endISO: string }>;
};

export default function BookClient({
  services,
  staff,
}: {
  services: Service[];
  staff: Staff[];
}) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<SlotResp | null>(null);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setError(null);
      setSlots(null);
      setSlotIndex(null);
      try {
        const res = await fetch(
          `/api/slots?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`
        );
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
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>1) Pick service, staff, date</CardTitle>
          <CardDescription>We’ll show available slots based on weekly availability and existing bookings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.durationMin}m
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService ? (
              <p className="text-xs text-muted-foreground">
                {(selectedService.priceCents / 100).toFixed(2)} {selectedService.currency}
                {selectedService.depositCents
                  ? ` (deposit ${(selectedService.depositCents / 100).toFixed(2)} ${selectedService.currency})`
                  : ''}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Staff</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2) Select a time slot</CardTitle>
          <CardDescription>{slots ? `Timezone: ${slots.tz}` : 'Slots load automatically.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSlots && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loadingSlots && slots && slots.slots.length === 0 && (
            <p className="text-sm text-muted-foreground">No slots available for this selection.</p>
          )}
          {!loadingSlots && slots && slots.slots.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {slots.slots.map((s, i) => {
                const label = new Date(s.startISO).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const selected = i === slotIndex;
                return (
                  <Button
                    key={s.startISO}
                    type="button"
                    variant={selected ? 'default' : 'outline'}
                    onClick={() => setSlotIndex(i)}
                    className="justify-center"
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3) Your details</CardTitle>
          <CardDescription>Payments and email confirmation will be added later.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="+32…" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Any notes…" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Confirm booking</Button>
              <span className="text-xs text-muted-foreground">
                (MVP) No auth / no payments yet.
              </span>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {successId ? (
              <p className="text-sm text-emerald-700">
                Booking confirmed. ID: <code className="rounded bg-muted px-2 py-1">{successId}</code>
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
