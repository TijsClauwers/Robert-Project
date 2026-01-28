import Link from 'next/link';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/staff', label: 'Staff' },
  { href: '/admin/availability', label: 'Availability' },
  { href: '/admin/bookings', label: 'Bookings' },
];

export default function AdminNav({ current }: { current: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground',
            current === it.href && 'bg-muted text-foreground'
          )}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
