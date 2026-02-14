import { prisma } from './prisma';

export async function chargeCredits(userId: string, amount: number, reason: string, jobId?: string) {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.creditsBalance < amount) throw new Error('Not enough credits');
    await tx.user.update({ where: { id: userId }, data: { creditsBalance: { decrement: amount } } });
    await tx.creditLedger.create({ data: { userId, delta: -amount, reason, jobId } });
  });
}

export async function addCredits(userId: string, amount: number, reason: string) {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { creditsBalance: { increment: amount } } }),
    prisma.creditLedger.create({ data: { userId, delta: amount, reason } }),
  ]);
}
