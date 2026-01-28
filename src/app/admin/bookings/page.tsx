import AdminNav from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cancelBooking } from './actions';

export const dynamic = 'force-dynamic';

function fmt(dt: Date) {
  return dt.toISOString().replace('T', ' ').slice(0, 16);
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      service: true,
      staff: true,
      customer: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Bookings</h2>
          <p className="text-sm text-muted-foreground">Latest 50 bookings.</p>
        </div>
        <AdminNav current="/admin/bookings" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium">{fmt(b.startAt)}</div>
                    <div className="text-xs text-muted-foreground">→ {fmt(b.endAt)}</div>
                  </TableCell>
                  <TableCell>{b.service.name}</TableCell>
                  <TableCell>{b.staff.name ?? b.staff.email}</TableCell>
                  <TableCell>
                    <div className="font-medium">{b.customer.name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{b.customer.email ?? ''}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.status === 'CANCELLED' ? 'secondary' : b.status === 'CONFIRMED' ? 'default' : 'outline'}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status !== 'CANCELLED' ? (
                      <form
                        action={async () => {
                          'use server';
                          await cancelBooking(b.id);
                        }}
                      >
                        <Button size="sm" variant="outline" type="submit">
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
