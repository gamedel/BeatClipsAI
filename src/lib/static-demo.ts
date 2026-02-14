export type DemoJobStatus = 'queued' | 'running' | 'uploading' | 'done' | 'failed';

export type DemoTemplate = {
  id: string;
  name: string;
  genre: string;
  previewImageUrl: string;
  description: string;
  defaultSeed: number;
  promptPrefix: string;
  audioUrl: string;
};

export type DemoJob = {
  id: string;
  status: DemoJobStatus;
  prompt: string;
  seed?: number | null;
  inputImageUrl: string;
  inputAudioUrl?: string | null;
  outputVideoUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  costCredits: number;
};

const K = {
  templates: 'bc_demo_templates_v1',
  jobs: 'bc_demo_jobs_v1',
  credits: 'bc_demo_credits_v1',
};

const FALLBACK_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const defaultTemplates: DemoTemplate[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `tmpl-${i + 1}`,
  name: `Template ${i + 1}`,
  genre: ['phonk', 'house', 'trap', 'ambient', 'drill'][i % 5],
  previewImageUrl: `https://placehold.co/320x180?text=Template+${i + 1}`,
  description: `High-energy social clip preset #${i + 1}`,
  defaultSeed: 1000 + i,
  promptPrefix: `Cinematic rhythmic montage ${i + 1}:`,
  audioUrl: `https://example.com/audio/template-${i + 1}.mp3`,
}));

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function isGithubPagesHost() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('github.io');
}

export function isStaticDemoMode() {
  return process.env.NEXT_PUBLIC_STATIC_DEMO_MODE === 'true' || isGithubPagesHost();
}

export function getTemplates(): DemoTemplate[] {
  const templates = read<DemoTemplate[]>(K.templates, []);
  if (!templates.length) {
    write(K.templates, defaultTemplates);
    return defaultTemplates;
  }
  return templates;
}

export function getCredits(): number {
  const credits = read<number>(K.credits, 0);
  if (!credits) {
    write(K.credits, 500);
    return 500;
  }
  return credits;
}

export function setCredits(v: number) { write(K.credits, v); }

export function getJobs(): DemoJob[] {
  return read<DemoJob[]>(K.jobs, []).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function setJobs(jobs: DemoJob[]) { write(K.jobs, jobs); }

export function getJobById(id: string) { return getJobs().find((j) => j.id === id); }

export function createDemoJob(input: {
  prompt: string;
  inputImageUrl: string;
  inputAudioUrl?: string | null;
  templateId?: string;
  seed?: number | null;
}): DemoJob {
  const credits = getCredits();
  const cost = 25;
  if (credits < cost) throw new Error('Not enough credits');
  setCredits(credits - cost);

  const templates = getTemplates();
  const template = templates.find((t) => t.id === input.templateId);
  const now = new Date().toISOString();
  const job: DemoJob = {
    id: `job_${Date.now()}`,
    status: 'queued',
    prompt: `${template?.promptPrefix ?? ''} ${input.prompt}`.trim(),
    seed: input.seed ?? template?.defaultSeed,
    inputImageUrl: input.inputImageUrl,
    inputAudioUrl: input.inputAudioUrl ?? template?.audioUrl,
    createdAt: now,
    updatedAt: now,
    costCredits: cost,
  };
  const jobs = getJobs();
  setJobs([job, ...jobs]);
  simulateProgress(job.id);
  return job;
}

export function rerollDemoJob(id: string): DemoJob {
  const src = getJobById(id);
  if (!src) throw new Error('Job not found');
  return createDemoJob({
    prompt: src.prompt,
    inputImageUrl: src.inputImageUrl,
    inputAudioUrl: src.inputAudioUrl,
    seed: src.seed,
  });
}

function updateJob(id: string, patch: Partial<DemoJob>) {
  const jobs = getJobs();
  const next = jobs.map((j) => (j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j));
  setJobs(next);
}

function simulateProgress(id: string) {
  setTimeout(() => updateJob(id, { status: 'running' }), 2000);
  setTimeout(() => updateJob(id, { status: 'uploading' }), 5000);
  setTimeout(() => updateJob(id, { status: 'done', outputVideoUrl: FALLBACK_VIDEO }), 8500);
}
