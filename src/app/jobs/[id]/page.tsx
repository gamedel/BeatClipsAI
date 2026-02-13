import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function JobDetails({ params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const job = await prisma.job.findFirst({ where: { id: params.id, userId } });
  if (!job) return <main>Not found</main>;

  return (
    <main className="space-y-4">
      <div className="card">
        <div className="text-sm text-zinc-400">Status: {job.status}</div>
        <div className="text-sm">Provider job: {job.providerJobId ?? 'pending'}</div>
        <p className="mt-2 text-sm">{job.prompt}</p>
      </div>
      {job.outputVideoUrl && (
        <div className="card">
          <video src={job.outputVideoUrl} controls className="w-full rounded" />
          <a className="mt-2 inline-block text-sm text-fuchsia-400" href={job.outputVideoUrl} download>Скачать mp4</a>
        </div>
      )}
      <form action={`/api/jobs/${job.id}/reroll`} method="post">
        <button className="btn w-full">Reroll (25 credits)</button>
      </form>
    </main>
  );
}
