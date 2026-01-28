import AdminNav from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createStaff, setUserRole, toggleUserActive } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const users = await prisma.user.findMany({ orderBy: [{ active: 'desc' }, { role: 'asc' }, { email: 'asc' }] });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Staff</h2>
          <p className="text-sm text-muted-foreground">Manage staff users (auth comes next).</p>
        </div>
        <AdminNav current="/admin/staff" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name ?? '—'}</TableCell>
                    <TableCell>
                      <form
                        action={async (formData: FormData) => {
                          'use server';
                          const role = String(formData.get('role') || 'STAFF') as 'ADMIN' | 'STAFF';
                          await setUserRole(u.id, role);
                        }}
                      >
                        <input type="hidden" name="role" value={u.role === 'ADMIN' ? 'STAFF' : 'ADMIN'} />
                        <Button variant="outline" size="sm" type="submit">
                          {u.role}
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell>
                      {u.active ? <Badge>Active</Badge> : <Badge variant="secondary">Disabled</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <form
                        action={async () => {
                          'use server';
                          await toggleUserActive(u.id, !u.active);
                        }}
                      >
                        <Button size="sm" variant={u.active ? 'outline' : 'default'} type="submit">
                          {u.active ? 'Disable' : 'Enable'}
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
            <CardTitle>Add staff</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createStaff} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select name="role" defaultValue="STAFF">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">STAFF</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create user</Button>
              <p className="text-xs text-muted-foreground">
                In #4 we’ll add real login + permissions; this is just DB management.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
