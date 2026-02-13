import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const job = await prisma.job.findFirst({ where: { id: params.id, userId } });
  if (!job) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(job);
}
