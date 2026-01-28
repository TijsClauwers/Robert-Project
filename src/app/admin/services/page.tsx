import { prisma } from '@/lib/db';
import AdminNav from '@/components/AdminNav';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createService, toggleServiceActive } from './actions';

export const dynamic = 'force-dynamic';

function money(cents: number, currency: string) {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ active: 'desc' }, { name: 'asc' }] });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Services</h2>
            <p className="text-sm text-muted-foreground">Create and manage bookable services.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/book">Preview booking</Link>
          </Button>
        </div>
        <AdminNav current="/admin/services" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.durationMin} min</TableCell>
                    <TableCell>{money(s.priceCents, s.currency)}</TableCell>
                    <TableCell>{s.depositCents ? money(s.depositCents, s.currency) : '—'}</TableCell>
                    <TableCell>
                      {s.active ? <Badge>Active</Badge> : <Badge variant="secondary">Disabled</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <form
                        action={async () => {
                          'use server';
                          await toggleServiceActive(s.id, !s.active);
                        }}
                      >
                        <Button size="sm" variant={s.active ? 'outline' : 'default'} type="submit">
                          {s.active ? 'Disable' : 'Enable'}
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createService} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Consultation" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Optional…" />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="durationMin">Duration (min)</Label>
                  <Input id="durationMin" name="durationMin" type="number" min={5} step={5} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" defaultValue="EUR" />
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" min={0} step={0.01} placeholder="50.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit</Label>
                  <Input id="deposit" name="deposit" type="number" min={0} step={0.01} placeholder="20.00" />
                </div>
              </div>
              <Button type="submit">Create service</Button>
              <p className="text-xs text-muted-foreground">Editing UI will come next; for now you can enable/disable.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
