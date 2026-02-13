import { subHours } from './utils';
import { prisma } from './prisma';
import { APP_CONFIG } from './config';

export async function enforceRateLimit(userId: string, action: string) {
  const since = subHours(new Date(), 1);
  const count = await prisma.rateLimitEvent.count({ where: { userId, action, createdAt: { gte: since } } });
  if (count >= APP_CONFIG.rateLimitPerHour) throw new Error('Rate limit exceeded (10/hour)');
  await prisma.rateLimitEvent.create({ data: { userId, action } });
}
