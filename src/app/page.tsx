import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="grid gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Booking SaaS (MVP)</h1>
        <p className="text-muted-foreground">
          Multi-staff bookings + intake + payments (Stripe) — currently focusing on booking flow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer booking</CardTitle>
            <CardDescription>Pick service, staff, date → choose a slot → confirm.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/book">Go to booking</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>CRUD + availability + staff roles (coming next).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/admin">Open admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
        Note: this is a dev preview. Auth + styling polish + Stripe are still in progress.
      </div>
    </div>
  );
}
