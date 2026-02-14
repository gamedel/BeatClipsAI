'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type DemoUser = { id: string; creditsBalance: number; createdAt: string };
type DemoJob = { id: string; status: string; prompt: string; createdAt: string };

const demoUsers: DemoUser[] = [
  { id: 'demo-user', creditsBalance: 999999, createdAt: new Date().toISOString() },
  { id: 'user-test-1', creditsBalance: 250, createdAt: new Date().toISOString() },
];

const demoJobs: DemoJob[] = [
  { id: 'job_demo_001', status: 'done', prompt: 'Cinematic beat drop, neon city', createdAt: new Date().toISOString() },
  { id: 'job_demo_002', status: 'running', prompt: 'Street dance clip, phonk vibe', createdAt: new Date().toISOString() },
];

export default function AdminDemoPage() {
  const params = useSearchParams();
  const isEnabled = process.env.NEXT_PUBLIC_GITHUB_DEMO_ADMIN === 'true';
  const expectedKey = process.env.NEXT_PUBLIC_DEMO_ADMIN_KEY ?? 'demo-admin';
  const provided = params.get('key') ?? '';

  const canOpen = useMemo(() => isEnabled && provided === expectedKey, [isEnabled, provided, expectedKey]);

  if (!isEnabled) return <main className="card">Admin demo disabled. Set NEXT_PUBLIC_GITHUB_DEMO_ADMIN=true.</main>;
  if (!canOpen) return <main className="card">404</main>;

  return (
    <main className="space-y-4 section-animate">
      <section className="card-strong">
        <h1 className="mb-1 text-lg font-bold">Admin Demo (GitHub Pages)</h1>
        <p className="text-xs text-zinc-400">Client-only mock to preview UI from phone/static hosting.</p>
      </section>

      <section className="card">
        <h2 className="mb-2 font-bold">Users</h2>
        {demoUsers.map((u) => <div key={u.id} className="text-sm">{u.id} — {u.creditsBalance} credits</div>)}
      </section>

      <section className="card">
        <h2 className="mb-2 font-bold">Jobs</h2>
        {demoJobs.map((j) => <div key={j.id} className="mb-2 text-sm">{j.status} — {j.id}</div>)}
      </section>
    </main>
  );
}
