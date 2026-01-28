import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Booking SaaS (MVP)</h1>
      <p>
        Multi-staff bookings + intake + payments (Stripe) — scaffold.
      </p>

      <ul>
        <li>
          <Link href="/book">Book an appointment</Link>
        </li>
        <li>
          <Link href="/admin">Admin (MVP)</Link>
        </li>
      </ul>

      <p style={{ marginTop: 24, color: '#555' }}>
        Dev note: this MVP uses SQLite locally. Next step: Auth + real availability
        UI + Stripe checkout.
      </p>
    </main>
  );
}
