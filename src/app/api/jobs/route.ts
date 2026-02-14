import { APP_CONFIG } from '@/lib/config';
import { chargeCredits } from '@/lib/credits';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jobsQueue } from '@/lib/queue';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const createSchema = z.object({
  prompt: z.string().min(1),
  inputImageUrl: z.string().url(),
  inputAudioUrl: z.string().url().nullable().optional(),
  templateId: z.string().optional(),
  seed: z.number().int().nullable().optional(),
});

export async function GET() {
  const userId = await getCurrentUserId();
  const jobs = await prisma.job.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
  return Response.json(jobs);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  await enforceRateLimit(userId, 'create_job');
  const body = createSchema.parse(await req.json());
  const template = body.templateId ? await prisma.template.findUnique({ where: { id: body.templateId } }) : null;
  const prompt = `${template?.promptPrefix ?? ''} ${body.prompt}`.trim();

  const job = await prisma.job.create({
    data: {
      userId,
      prompt,
      seed: body.seed ?? template?.defaultSeed,
      inputImageUrl: body.inputImageUrl,
      inputAudioUrl: body.inputAudioUrl ?? template?.audioUrl,
      durationSec: 5,
      resolution: '720p',
      costCredits: APP_CONFIG.jobCostCredits,
      status: 'queued',
    },
  });

  await chargeCredits(userId, APP_CONFIG.jobCostCredits, 'job_create', job.id);
  await jobsQueue.add('generate-video', { jobId: job.id });
  return Response.json(job, { status: 201 });
}
