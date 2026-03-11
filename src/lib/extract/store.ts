import { setActiveJobs } from "@/lib/degraded/state";
import type { ExtractJob, Platform } from "@/lib/extract/types";

const jobs = new Map<string, ExtractJob>();

function nowIso(): string {
  return new Date().toISOString();
}

function syncActiveJobs(): void {
  const active = [...jobs.values()].filter((j) => j.status === "queued" || j.status === "processing").length;
  setActiveJobs(active);
}

export function createJob(platform: Platform, sourceUrl: string): ExtractJob {
  const now = nowIso();
  const id = `job_${crypto.randomUUID()}`;

  const job: ExtractJob = {
    id,
    platform,
    sourceUrl,
    status: "queued",
    progress: 0,
    media: [],
    warnings: [],
    createdAt: now,
    updatedAt: now,
  };

  jobs.set(id, job);
  syncActiveJobs();

  queueMicrotask(() => {
    const current = jobs.get(id);
    if (!current) return;
    const completed: ExtractJob = {
      ...current,
      status: "completed",
      progress: 100,
      media: [
        {
          mediaId: `m_${crypto.randomUUID()}`,
          type: "video",
          quality: "720p",
          downloadUrl: `https://cdn.clipkeep.local/${id}.mp4`,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      ],
      updatedAt: nowIso(),
    };
    jobs.set(id, completed);
    syncActiveJobs();
  });

  return job;
}

export function getJob(jobId: string): ExtractJob | undefined {
  return jobs.get(jobId);
}
