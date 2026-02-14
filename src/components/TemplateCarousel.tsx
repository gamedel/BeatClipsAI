'use client';

type Template = {
  id: string;
  name: string;
  genre: string;
  previewImageUrl: string;
  description: string;
};

export function TemplateCarousel({
  templates,
  selected,
  onSelect,
}: {
  templates: Template[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  if (!templates.length) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="min-w-56 animate-pulse snap-start rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 h-24 rounded-xl bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
      {templates.map((t) => {
        const active = selected === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`relative min-w-56 snap-start overflow-hidden rounded-2xl border p-2 text-left transition-all duration-200 ${
              active ? 'border-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_0_2px_rgba(217,70,239,0.3)]' : 'border-white/10 bg-white/5 hover:border-white/25 hover:scale-[1.02]'
            }`}
          >
            <div className="relative mb-2 h-28 overflow-hidden rounded-xl">
              <img src={t.previewImageUrl} alt={t.name} className="h-full w-full object-cover" />
              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-100">{t.genre}</div>
              {active && <div className="absolute right-2 top-2 rounded-full bg-fuchsia-500 px-2 py-0.5 text-[10px] font-bold">Selected</div>}
            </div>
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="line-clamp-2 text-xs text-zinc-400">{t.description}</div>
          </button>
        );
      })}
    </div>
  );
}
