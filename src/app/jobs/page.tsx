import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';

export default async function JobsPage() {
  const userId = await getCurrentUserId();
  const jobs = await prisma.job.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return (
    <main className="space-y-3">
      {jobs.map((job: { id: string; createdAt: Date; status: string; prompt: string }) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="card block">
          <div className="text-xs text-zinc-400">{new Date(job.createdAt).toLocaleString()}</div>
          <div className="font-semibold">{job.status}</div>
          <div className="truncate text-sm text-zinc-300">{job.prompt}</div>
        </Link>
      ))}
    </main>
  );
}
