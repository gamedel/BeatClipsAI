'use client';

import { useEffect, useMemo, useState } from 'react';
import { TemplateCarousel } from '@/components/TemplateCarousel';
import { createDemoJob, getCredits, getTemplates, isStaticDemoMode, setCredits } from '@/lib/static-demo';

type Template = {
  id: string;
  name: string;
  genre: string;
  previewImageUrl: string;
  description: string;
  defaultSeed: number;
};

const fallbackTemplates: Template[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `fallback-${i + 1}`,
  name: `Template ${i + 1}`,
  genre: ['phonk', 'house', 'trap', 'ambient', 'drill'][i],
  previewImageUrl: `https://placehold.co/320x180?text=Template+${i + 1}`,
  description: `Cinematic rhythm preset ${i + 1}`,
  defaultSeed: 1000 + i,
}));

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState<string>();
  const [prompt, setPrompt] = useState('Neon city, dynamic camera, beat-synced motion');
  const [seed, setSeed] = useState('');
  const [musicMode, setMusicMode] = useState<'template' | 'custom'>('template');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/720x1280?text=Upload+Image');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCreditsState] = useState(0);

  useEffect(() => {
    if (isStaticDemoMode()) {
      const localTemplates = getTemplates();
      setTemplates(localTemplates);
      setTemplateId(localTemplates[0]?.id);
      setSeed(String(localTemplates[0]?.defaultSeed ?? 1000));
      setCreditsState(getCredits());
      return;
    }

    fetch('/api/templates')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('templates fail'))))
      .then((data) => {
        const source = data?.length ? data : fallbackTemplates;
        setTemplates(source);
        if (source[0]) {
          setTemplateId(source[0].id);
          setSeed(String(source[0].defaultSeed));
        }
      })
      .catch(() => {
        setTemplates(fallbackTemplates);
        setTemplateId(fallbackTemplates[0].id);
        setSeed(String(fallbackTemplates[0].defaultSeed));
      });
  }, []);

  const selectedTemplate = useMemo(() => templates.find((t) => t.id === templateId), [templates, templateId]);

  async function generate() {
    try {
      setLoading(true);
      if (isStaticDemoMode()) {
        const job = createDemoJob({
          prompt,
          inputImageUrl: imageUrl,
          inputAudioUrl: musicMode === 'custom' ? audioUrl : null,
          templateId,
          seed: seed ? Number(seed) : null,
        });
        setCreditsState(getCredits());
        window.location.href = `/jobs/${job.id}`;
        return;
      }

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          inputImageUrl: imageUrl,
          inputAudioUrl: musicMode === 'custom' ? audioUrl : null,
          templateId,
          seed: seed ? Number(seed) : null,
        }),
      });
      if (res.ok) {
        const job = await res.json();
        window.location.href = `/jobs/${job.id}`;
      } else {
        alert(await res.text());
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-4">
      <section className="card-strong section-animate space-y-3">
        <p className="badge">AI Clip Studio</p>
        <h1 className="text-2xl font-black leading-tight">Create viral beat clips in seconds</h1>
        <p className="text-sm text-zinc-300">Image + text → cinematic 5s video with sound, rendered in Studio (720p + sound).</p>
        <div className="flex flex-wrap gap-2">
          <span className="badge">720p</span><span className="badge">Sound on</span><span className="badge">5 sec</span><span className="badge">25 credits</span>
          {isStaticDemoMode() && <span className="badge">Credits: {credits}</span>}
        </div>
        <div className="flex gap-2">
          <a href="#generator" className="btn">Generate now</a>
          <a href="#templates" className="btn-secondary">See templates</a>
          {isStaticDemoMode() && <button type="button" onClick={() => { setCredits(500); setCreditsState(500); }} className="btn-secondary">Reset demo</button>}
        </div>
      </section>

      <section id="generator" className="card section-animate space-y-4">
        <div>
          <h2 className="text-lg font-bold">Studio (720p + sound)</h2>
          <p className="text-xs text-zinc-400">Follow 5 quick steps and launch generation.</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step 1 — Image</p>
          <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://...jpg" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step 2 — Prompt</p>
          <textarea className="input min-h-24" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>

        <div id="templates" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step 3 — Template</p>
          <TemplateCarousel templates={templates} selected={templateId} onSelect={setTemplateId} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step 4 — Music</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`btn-secondary ${musicMode === 'template' ? '!border-fuchsia-400 !bg-fuchsia-500/10' : ''}`} onClick={() => setMusicMode('template')}>Template music</button>
            <button type="button" className={`btn-secondary ${musicMode === 'custom' ? '!border-fuchsia-400 !bg-fuchsia-500/10' : ''}`} onClick={() => setMusicMode('custom')}>Custom mp3 URL</button>
          </div>
          {musicMode === 'custom' && <input className="input" placeholder="https://...mp3" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />}
        </div>

        <details className="rounded-xl border border-white/10 bg-white/5 p-3">
          <summary className="cursor-pointer text-sm font-semibold">Advanced (seed)</summary>
          <input className="input mt-3" value={seed} onChange={(e) => setSeed(e.target.value)} />
        </details>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-300">
          <div>Template: <b>{selectedTemplate?.name ?? '—'}</b></div>
          <div>Music: <b>{musicMode === 'template' ? 'Template track' : 'Custom mp3'}</b></div>
          <div>Cost: <b>25 credits</b></div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
        <button className="btn w-full" onClick={generate} disabled={loading}>
          {loading ? 'Creating job…' : 'Step 5 — Generate (25 credits)'}
        </button>
      </div>
    </main>
  );
}
