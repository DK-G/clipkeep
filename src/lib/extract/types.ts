export type Platform = "telegram" | "twitter" | "tiktok" | "instagram";
export type JobStatus = "queued" | "processing" | "completed" | "failed";

export type ExtractJob = {
  id: string;
  platform: Platform;
  sourceUrl: string;
  status: JobStatus;
  progress: number;
  media: Array<{
    mediaId: string;
    type: "video" | "audio" | "image";
    quality: string;
    downloadUrl: string;
    expiresAt: string;
    thumbUrl?: string;
  }>;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
};
