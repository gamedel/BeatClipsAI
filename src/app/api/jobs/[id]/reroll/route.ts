import { APP_CONFIG } from '@/lib/config';
import { chargeCredits } from '@/lib/credits';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jobsQueue } from '@/lib/queue';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const source = await prisma.job.findFirst({ where: { id: params.id, userId } });
  if (!source) return Response.json({ error: 'Not found' }, { status: 404 });
  const job = await prisma.job.create({
    data: {
      userId,
      prompt: source.prompt,
      seed: source.seed,
      inputImageUrl: source.inputImageUrl,
      inputAudioUrl: source.inputAudioUrl,
      durationSec: 5,
      resolution: '720p',
      costCredits: APP_CONFIG.jobCostCredits,
      status: 'queued',
    },
  });
  await chargeCredits(userId, APP_CONFIG.jobCostCredits, 'reroll', job.id);
  await jobsQueue.add('generate-video', { jobId: job.id });
  return Response.json(job, { status: 201 });
}
