import Link from 'next/link';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-semibold tracking-tight">
            Robert Booking
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/book" className="hover:text-foreground">Book</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted-foreground">
          MVP preview — styling + flows in progress.
        </div>
      </footer>
    </div>
  );
}
