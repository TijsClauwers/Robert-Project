import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10">
      {/* Hero */}
      <section className="grid gap-6 rounded-2xl border bg-gradient-to-b from-muted/40 to-background p-8">
        <div className="grid gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">Bookings that don’t feel like admin work.</h1>
          <p className="max-w-2xl text-muted-foreground">
            A clean multi-staff booking experience with a simple admin panel for services, staff, availability and bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/book">Book an appointment</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin">Open admin</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Dev preview: auth is temporarily disabled for admin so you can explore.
        </p>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Booking flow</CardTitle>
            <CardDescription>Service → staff → date → slot → confirm.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/book">Try booking</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Weekly blocks per staff member.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/admin/availability">Manage availability</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>Manage services, staff and bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/admin">Admin dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>Booking SaaS — MVP preview</p>
          <div className="flex gap-4">
            <Link className="underline-offset-4 hover:underline" href="/book">
              Book
            </Link>
            <Link className="underline-offset-4 hover:underline" href="/admin">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
