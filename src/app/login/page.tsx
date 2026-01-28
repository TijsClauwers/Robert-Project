import { signIn } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams?.next || '/admin';

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>We’ll email you a magic link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              'use server';
              const email = String(formData.get('email') || '');
              await signIn('email', { email, redirectTo: next });
            }}
            className="grid gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit">Send login link</Button>
            <p className="text-xs text-muted-foreground">
              Only ADMIN users can access /admin. We’ll set the first admin via DB seed/env next.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
