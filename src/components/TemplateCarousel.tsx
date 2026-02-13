'use client';

type Template = {
  id: string;
  name: string;
  genre: string;
  previewImageUrl: string;
  description: string;
};

export function TemplateCarousel({ templates, selected, onSelect }: { templates: Template[]; selected?: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {templates.map((t) => (
        <button key={t.id} type="button" onClick={() => onSelect(t.id)} className={`min-w-52 rounded-lg border p-2 text-left ${selected === t.id ? 'border-fuchsia-500' : 'border-zinc-700'}`}>
          <img src={t.previewImageUrl} alt={t.name} className="mb-2 h-24 w-full rounded object-cover" />
          <div className="text-sm font-semibold">{t.name}</div>
          <div className="text-xs text-zinc-400">{t.genre}</div>
        </button>
      ))}
    </div>
  );
}
