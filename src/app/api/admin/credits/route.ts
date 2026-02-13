import { assertAdminAccess } from '@/lib/admin';
import { addCredits } from '@/lib/credits';
import { z } from 'zod';

const schema = z.object({ userId: z.string(), delta: z.number().int(), reason: z.string().min(1) });

export async function POST(req: Request) {
  const key = new URL(req.url).searchParams.get('key') ?? undefined;
  try {
    assertAdminAccess(key);
  } catch {
    return new Response('Not Found', { status: 404 });
  }
  const { userId, delta, reason } = schema.parse(await req.json());
  if (delta < 0) return Response.json({ error: 'Use positive top-up only in MVP' }, { status: 400 });
  await addCredits(userId, delta, `admin:${reason}`);
  return Response.json({ ok: true });
}
