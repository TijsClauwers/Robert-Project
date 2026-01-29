import AdminNav from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteAvailability, upsertAvailability } from './actions';

export const dynamic = 'force-dynamic';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(':').map((x) => Number(x));
  return h * 60 + (m || 0);
}

function fromMin(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default async function AdminAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ staffId?: string }>;
}) {
  const sp = await searchParams;
  const staffId = sp.staffId;

  const staff = await prisma.user.findMany({ where: { active: true }, orderBy: { email: 'asc' } });
  const selected = staffId || staff[0]?.id;

  const rows = selected
    ? await prisma.availability.findMany({ where: { staffId: selected }, orderBy: [{ dayOfWeek: 'asc' }, { startMin: 'asc' }] })
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Availability</h2>
          <p className="text-sm text-muted-foreground">Weekly availability blocks per staff.</p>
        </div>
        <AdminNav current="/admin/availability" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            {!selected ? (
              <p className="text-sm text-muted-foreground">No staff found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{DOW[r.dayOfWeek]}</TableCell>
                      <TableCell>{fromMin(r.startMin)}</TableCell>
                      <TableCell>{fromMin(r.endMin)}</TableCell>
                      <TableCell className="text-right">
                        <form
                          action={async () => {
                            'use server';
                            await deleteAvailability(r.id);
                          }}
                        >
                          <Button size="sm" variant="outline" type="submit">
                            Delete
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Switch staff (GET) */}
              <form action="/admin/availability" method="get" className="grid gap-2">
                <Label>Staff</Label>
                <div className="flex gap-2">
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    name="staffId"
                    defaultValue={selected}
                  >
                    {staff.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name ?? u.email}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="secondary">
                    Switch
                  </Button>
                </div>
              </form>

              {/* Add block (POST server action) */}
              <form action={upsertAvailability} className="grid gap-4">
                <input type="hidden" name="staffId" value={selected} />

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" name="dayOfWeek" defaultValue="1">
                      {DOW.map((label, idx) => (
                        <option key={label} value={idx}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Input name="startTime" type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Input name="endTime" type="time" defaultValue="17:00" />
                    </div>
                  </div>
                </div>

                <Button type="submit">Add block</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
