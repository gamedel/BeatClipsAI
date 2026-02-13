import { assertAdminAccess } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? undefined;
  try {
    assertAdminAccess(key);
  } catch {
    return new Response('Not Found', { status: 404 });
  }
  const status = url.searchParams.get('status') ?? undefined;
  const jobs = await prisma.job.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return Response.json(jobs);
}
