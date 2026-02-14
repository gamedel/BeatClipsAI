import { JobDetailsClient } from '@/components/JobDetailsClient';

export function generateStaticParams() {
  if (process.env.STATIC_EXPORT !== 'true') return [];
  return Array.from({ length: 200 }, (_, i) => ({ id: `job-${i + 1}` }));
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  return <JobDetailsClient id={params.id} />;
}
