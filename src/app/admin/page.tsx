import Link from 'next/link';
import { notFound } from 'next/navigation';
import { assertAdminAccess } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export default async function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  if (process.env.NEXT_PUBLIC_STATIC_DEMO_MODE === 'true') {
    return (
      <main className="card space-y-2">
        <h1 className="text-lg font-bold">Admin is disabled in static demo mode</h1>
        <p className="text-sm text-zinc-300">Use the demo admin page instead:</p>
        <Link className="btn btn-secondary inline-flex w-fit" href="/admin-demo?key=demo-admin">Open /admin-demo</Link>
      </main>
    );
  }

  try {
    assertAdminAccess(searchParams.key);
  } catch {
    notFound();
  }

  const [users, jobs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.job.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
  ]);

  return (
    <main className="space-y-4">
      <section className="card">
        <h2 className="mb-2 font-bold">Users</h2>
        {users.map((u: { id: string; creditsBalance: number }) => <div key={u.id} className="text-sm">{u.id} — {u.creditsBalance} credits</div>)}
      </section>
      <section className="card">
        <h2 className="mb-2 font-bold">Top up credits</h2>
        <p className="text-xs text-zinc-400">POST /api/admin/credits?key=ADMIN_KEY with {'{ userId, delta, reason }'}</p>
      </section>
      <section className="card">
        <h2 className="mb-2 font-bold">Jobs</h2>
        {jobs.map((j: { id: string; status: string }) => <div key={j.id} className="mb-2 text-sm">{j.status} — {j.id}</div>)}
      </section>
    </main>
  );
}
