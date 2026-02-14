'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJobs, isStaticDemoMode, type DemoJob } from '@/lib/static-demo';

type JobItem = { id: string; createdAt: string | Date; status: string; prompt: string };

const statusClasses: Record<string, string> = {
  queued: 'bg-zinc-500/20 text-zinc-200',
  running: 'bg-blue-500/20 text-blue-200',
  uploading: 'bg-violet-500/20 text-violet-200',
  done: 'bg-emerald-500/20 text-emerald-200',
  failed: 'bg-rose-500/20 text-rose-200',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    if (isStaticDemoMode()) {
      const sync = () => setJobs(getJobs());
      sync();
      const t = setInterval(sync, 1000);
      return () => clearInterval(t);
    }

    fetch('/api/jobs').then((r) => r.json()).then((data) => setJobs(data)).catch(() => setJobs([]));
  }, []);

  if (!jobs.length) {
    return (
      <main className="card section-animate text-center">
        <p className="text-xl">🎬</p>
        <h1 className="mt-2 font-bold">No jobs yet</h1>
        <p className="mt-1 text-sm text-zinc-400">Create your first beat clip and it will appear here.</p>
        <Link href="/" className="btn mt-4">Go to Generator</Link>
      </main>
    );
  }

  return (
    <main className="space-y-3 section-animate">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="card block transition hover:bg-white/10">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-400">{new Date(job.createdAt).toLocaleString()}</div>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[job.status] ?? 'bg-zinc-500/20 text-zinc-100'}`}>{job.status}</span>
          </div>
          <div className="truncate text-sm text-zinc-200">{job.prompt}</div>
        </Link>
      ))}
    </main>
  );
}
