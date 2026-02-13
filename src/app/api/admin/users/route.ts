import { assertAdminAccess } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key') ?? undefined;
  try {
    assertAdminAccess(key);
  } catch {
    return new Response('Not Found', { status: 404 });
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(users);
}
