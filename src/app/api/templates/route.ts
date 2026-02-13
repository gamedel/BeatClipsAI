import { prisma } from '@/lib/prisma';

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: 'asc' } });
  return Response.json(templates);
}
