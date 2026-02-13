import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? '',
    secretAccessKey: process.env.S3_SECRET_KEY ?? '',
  },
  forcePathStyle: true,
});

export async function createUploadUrl(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(client, cmd, { expiresIn: 300 });
  return { uploadUrl: url, publicUrl: `${process.env.S3_PUBLIC_BASE_URL}/${key}` };
}

export async function uploadBuffer(key: string, contentType: string, body: Buffer) {
  const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType, Body: body });
  await client.send(cmd);
  return `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
}
