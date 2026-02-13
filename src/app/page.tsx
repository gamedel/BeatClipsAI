'use client';

import { useEffect, useState } from 'react';
import { TemplateCarousel } from '@/components/TemplateCarousel';

type Template = { id: string; name: string; genre: string; previewImageUrl: string; description: string; defaultSeed: number };

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState<string>();
  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState('');
  const [musicMode, setMusicMode] = useState<'template' | 'custom'>('template');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/720x1280?text=Upload+Image');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    fetch('/api/templates').then((r) => r.json()).then((data) => {
      setTemplates(data);
      if (data[0]) {
        setTemplateId(data[0].id);
        setSeed(String(data[0].defaultSeed));
      }
    });
  }, []);

  async function generate() {
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
  }

  return (
    <main className="space-y-4">
      <div className="card">
        <h1 className="mb-2 text-xl font-bold">Studio (720p + sound)</h1>
        <p className="text-sm text-zinc-400">Image + text → 5s video with sound. Стоимость: 25 credits.</p>
      </div>
      <div className="card space-y-2">
        <label className="text-sm">Image URL (MVP)</label>
        <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <label className="text-sm">Prompt</label>
        <textarea className="input min-h-28" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <label className="text-sm">Templates</label>
        <TemplateCarousel templates={templates} selected={templateId} onSelect={setTemplateId} />
        <label className="text-sm">Seed (advanced)</label>
        <input className="input" value={seed} onChange={(e) => setSeed(e.target.value)} />
        <div className="flex gap-2">
          <button type="button" className={`rounded border px-2 py-1 text-sm ${musicMode === 'template' ? 'border-fuchsia-500' : 'border-zinc-600'}`} onClick={() => setMusicMode('template')}>Музыка шаблона</button>
          <button type="button" className={`rounded border px-2 py-1 text-sm ${musicMode === 'custom' ? 'border-fuchsia-500' : 'border-zinc-600'}`} onClick={() => setMusicMode('custom')}>Свой mp3 URL</button>
        </div>
        {musicMode === 'custom' && <input className="input" placeholder="https://...mp3" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />}
        <button className="btn w-full" onClick={generate}>Generate (25 credits)</button>
      </div>
    </main>
  );
}
