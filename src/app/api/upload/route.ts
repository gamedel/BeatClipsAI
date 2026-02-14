import { getCurrentUserId } from '@/lib/auth';
import { createUploadUrl } from '@/lib/s3';
import { z } from 'zod';

const schema = z.object({ fileName: z.string(), contentType: z.string() });
const allowed = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg'];

export async function POST(req: Request) {
  await getCurrentUserId();
  const data = schema.parse(await req.json());
  if (!allowed.includes(data.contentType)) return Response.json({ error: 'Unsupported type' }, { status: 400 });
  const key = `uploads/${Date.now()}-${data.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const result = await createUploadUrl(key, data.contentType);
  return Response.json(result);
}
