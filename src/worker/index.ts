import { Worker } from 'bullmq';
import { connection } from '@/lib/queue';
import { prisma } from '@/lib/prisma';
import { AtlasCloudProvider } from '@/lib/providers/atlascloud';
import { uploadBuffer } from '@/lib/s3';

const provider = new AtlasCloudProvider();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

new Worker(
  'video-jobs',
  async (jobData) => {
    const { jobId } = jobData.data as { jobId: string };
    const dbJob = await prisma.job.findUnique({ where: { id: jobId } });
    if (!dbJob) return;

    try {
      await prisma.job.update({ where: { id: jobId }, data: { status: 'running' } });
      const created = await provider.createJob({
        image: dbJob.inputImageUrl,
        prompt: dbJob.prompt,
        duration: dbJob.durationSec,
        resolution: '720p',
        audio_mode: dbJob.inputAudioUrl ? 'user_mp3_url' : 'auto',
        user_mp3_url: dbJob.inputAudioUrl ?? undefined,
        seed: dbJob.seed,
      });
      await prisma.job.update({ where: { id: jobId }, data: { providerJobId: created.provider_job_id } });

      let status = created;
      for (let i = 0; i < 120; i++) {
        status = await provider.getJobStatus(created.provider_job_id);
        if (status.status === 'succeeded' || status.status === 'failed') break;
        await sleep(5000 + i * 100);
      }

      if (status.status === 'failed' || !status.output_video_url) {
        await prisma.job.update({ where: { id: jobId }, data: { status: 'failed', errorMessage: status.error ?? 'Provider failed' } });
        return;
      }

      await prisma.job.update({ where: { id: jobId }, data: { status: 'uploading' } });
      const fileRes = await fetch(status.output_video_url);
      if (!fileRes.ok) throw new Error('Could not download provider output');
      const buffer = Buffer.from(await fileRes.arrayBuffer());
      const s3Url = await uploadBuffer(`videos/${jobId}.mp4`, 'video/mp4', buffer);

      await prisma.job.update({ where: { id: jobId }, data: { status: 'done', outputVideoUrl: s3Url } });
    } catch (e) {
      await prisma.job.update({ where: { id: jobId }, data: { status: 'failed', errorMessage: (e as Error).message } });
    }
  },
  { connection },
);

console.log('Worker started');
