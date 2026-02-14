import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BeatClipsAI',
  description: 'Studio (720p + sound)',
  manifest: '/manifest.webmanifest',
};

const navItems = [
  { href: '/', label: 'Generator' },
  { href: '/jobs', label: 'History' },
  { href: '/pricing', label: 'Pricing' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isTest = process.env.PUBLIC_TEST_MODE === 'true';
  const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO_MODE === 'true';
  return (
    <html lang="ru">
      <body className="noise mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-5">
        <header className="section-animate mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">BeatClipsAI</Link>
            <div className="flex items-center gap-2">
              <span className="badge">Studio 720p</span>
              {isTest && <span className="rounded-md bg-amber-400 px-2 py-1 text-[10px] font-bold text-black">TEST</span>}
              {isStaticDemo && <span className="rounded-md bg-cyan-400 px-2 py-1 text-[10px] font-bold text-black">STATIC DEMO</span>}
            </div>
          </div>
          <nav className="grid grid-cols-3 gap-2 text-center text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-white/10 bg-white/5 py-2 text-zinc-200 transition hover:bg-white/10">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}

        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}` }} />
      </body>
    </html>
  );
}
