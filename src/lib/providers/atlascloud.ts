import { IVideoProvider, ProviderInput, ProviderStatus } from './types';

const MODEL = 'alibaba/wan-2.6/image-to-video-flash';

export class AtlasCloudProvider implements IVideoProvider {
  private baseUrl = process.env.ATLASCLOUD_BASE_URL ?? 'https://api.atlascloud.ai/v1';
  private apiKey = process.env.ATLASCLOUD_API_KEY ?? '';

  async createJob(input: ProviderInput): Promise<ProviderStatus> {
    const res = await fetch(`${this.baseUrl}/jobs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        input: {
          image_url: input.image,
          prompt: input.prompt,
          duration_sec: input.duration,
          resolution: '720p',
          audio_mode: input.audio_mode,
          audio_url: input.user_mp3_url,
          seed: input.seed,
        },
      }),
    });
    if (!res.ok) throw new Error(`AtlasCloud createJob failed: ${await res.text()}`);
    const data = await res.json();
    return { provider_job_id: data.id, status: 'queued' };
  }

  async getJobStatus(providerJobId: string): Promise<ProviderStatus> {
    const res = await fetch(`${this.baseUrl}/jobs/${providerJobId}`, {
      headers: { authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`AtlasCloud getJobStatus failed: ${await res.text()}`);
    const data = await res.json();
    const statusMap: Record<string, ProviderStatus['status']> = {
      queued: 'queued',
      running: 'running',
      succeeded: 'succeeded',
      failed: 'failed',
    };
    return {
      provider_job_id: providerJobId,
      status: statusMap[data.status] ?? 'running',
      output_video_url: data.output?.video_url,
      error: data.error,
    };
  }
}
