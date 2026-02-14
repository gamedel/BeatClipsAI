'use client';

import { useEffect, useState } from 'react';
import { isStaticDemoMode } from '@/lib/static-demo';

type CreditPackage = { id: string; credits: number; description: string; priceRub: number };

const staticPackages: CreditPackage[] = [
  { id: 'p1', credits: 125, priceRub: 149, description: '5 videos' },
  { id: 'p2', credits: 250, priceRub: 249, description: '10 videos' },
  { id: 'p3', credits: 500, priceRub: 449, description: '20 videos' },
  { id: 'p4', credits: 1250, priceRub: 999, description: '50 videos' },
  { id: 'p5', credits: 2500, priceRub: 1890, description: '100 videos' },
];

export default function PricingPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);

  useEffect(() => {
    if (isStaticDemoMode()) {
      setPackages(staticPackages);
      return;
    }
    fetch('/api/pricing')
      .then((r) => (r.ok ? r.json() : staticPackages))
      .then((data) => setPackages(data?.length ? data : staticPackages))
      .catch(() => setPackages(staticPackages));
  }, []);

  if (!packages.length) {
    return <main className="card">No packages configured yet.</main>;
  }

  return (
    <main className="space-y-3 section-animate">
      {packages.map((p) => (
        <div className="card relative overflow-hidden" key={p.id}>
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="text-lg font-bold">{p.credits} credits</div>
          <div className="text-sm text-zinc-400">{p.description}</div>
          <div className="mt-2 text-2xl font-black">{p.priceRub} ₽</div>
          <button className="btn mt-3 w-full">Buy soon</button>
        </div>
      ))}
    </main>
  );
}
