import { prisma } from '@/lib/prisma';

export default async function PricingPage() {
  const packages = await prisma.creditPackage.findMany({ orderBy: { credits: 'asc' } });
  return (
    <main className="space-y-3">
      {packages.map((p: { id: string; credits: number; description: string; priceRub: number }) => (
        <div className="card" key={p.id}>
          <div className="text-lg font-bold">{p.credits} credits</div>
          <div className="text-sm text-zinc-400">{p.description}</div>
          <div className="mt-1">{p.priceRub} ₽</div>
          <button className="btn mt-3 w-full">Купить (скоро)</button>
        </div>
      ))}
    </main>
  );
}
