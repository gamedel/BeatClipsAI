'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getJobById, isStaticDemoMode, rerollDemoJob, type DemoJob } from '@/lib/static-demo';

const steps = ['queued', 'running', 'uploading', 'done'];

type Job = {
  id: string;
  status: string;
  prompt: string;
  providerJobId?: string | null;
  outputVideoUrl?: string | null;
  errorMessage?: string | null;
};

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    if (isStaticDemoMode()) {
      const sync = () => setJob((getJobById(params.id) as unknown as Job) ?? null);
      sync();
      const t = setInterval(sync, 1000);
      return () => clearInterval(t);
    }

    fetch(`/api/jobs/${params.id}`).then((r) => (r.ok ? r.json() : null)).then(setJob).catch(() => setJob(null));
  }, [params?.id]);

  const currentIndex = useMemo(() => Math.max(steps.indexOf(job?.status ?? ''), 0), [job?.status]);

  async function reroll() {
    if (!job) return;
    if (isStaticDemoMode()) {
      const next = rerollDemoJob(job.id);
      router.push(`/jobs/${next.id}`);
      return;
    }

    const res = await fetch(`/api/jobs/${job.id}/reroll`, { method: 'POST' });
    if (res.ok) {
      const next = await res.json();
      router.push(`/jobs/${next.id}`);
    }
  }

  if (!job) return <main className="card">Not found</main>;

  return (
    <main className="space-y-4 section-animate">
      <div className="card">
        <div className="mb-3 text-sm text-zinc-300">Status timeline</div>
        <div className="flex gap-2 text-xs">
          {steps.map((s, i) => (
            <div key={s} className={`rounded-full px-2 py-1 ${i <= currentIndex ? 'bg-fuchsia-500/30 text-fuchsia-100' : 'bg-white/5 text-zinc-400'}`}>{s}</div>
          ))}
          {job.status === 'failed' && <div className="rounded-full bg-rose-500/30 px-2 py-1 text-rose-100">failed</div>}
        </div>
        <p className="mt-3 text-sm text-zinc-300">{job.prompt}</p>
        <div className="mt-2 text-xs text-zinc-400">Provider job: {job.providerJobId ?? 'demo-mode'}</div>
      </div>

      {job.errorMessage && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{job.errorMessage}</div>}

      {job.outputVideoUrl ? (
        <div className="card">
          <video src={job.outputVideoUrl} controls className="w-full rounded-xl" />
          <a className="btn-secondary mt-3 inline-flex" href={job.outputVideoUrl} download>Download mp4</a>
        </div>
      ) : (
        <div className="card text-sm text-zinc-400">Result video is not ready yet.</div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button className="btn w-full" onClick={reroll}>Reroll (25)</button>
        <Link href="/jobs" className="btn-secondary text-center">Back</Link>
      </div>
    </main>
  );
}
