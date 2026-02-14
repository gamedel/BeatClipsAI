export type ProviderInput = {
  image: string;
  prompt: string;
  duration: number;
  resolution: '720p';
  audio_mode: 'auto' | 'user_mp3_url';
  user_mp3_url?: string;
  seed?: number | null;
};

export type ProviderStatus = {
  provider_job_id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  output_video_url?: string;
  error?: string;
};

export interface IVideoProvider {
  createJob(input: ProviderInput): Promise<ProviderStatus>;
  getJobStatus(providerJobId: string): Promise<ProviderStatus>;
}
