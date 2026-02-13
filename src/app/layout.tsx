import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BeatClipsAI',
  description: 'Studio (720p + sound)',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isTest = process.env.PUBLIC_TEST_MODE === 'true';
  return (
    <html lang="ru">
      <body className="mx-auto min-h-screen max-w-md px-4 py-5">
        <header className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">BeatClipsAI</Link>
          {isTest && <span className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-black">TEST MODE</span>}
        </header>
        <nav className="mb-6 flex gap-3 text-sm text-zinc-300">
          <Link href="/">Generator</Link>
          <Link href="/jobs">History</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}` }} />
      </body>
    </html>
  );
}
