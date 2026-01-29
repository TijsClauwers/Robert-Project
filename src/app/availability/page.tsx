import { redirect } from 'next/navigation';

export default function AvailabilityRedirectPage() {
  // People will naturally try /availability — for now, admin owns availability management.
  redirect('/admin/availability');
}
