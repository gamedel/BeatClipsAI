/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  images: { unoptimized: true },
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
      }
    : {}),
};

export default nextConfig;
