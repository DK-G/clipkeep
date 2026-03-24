export type Platform = "telegram" | "twitter" | "tiktok"  | "reddit" | "pinterest" | "facebook" | "threads" | "bluesky" | "lemon8" | "bilibili" | "discord";
export type JobStatus = "queued" | "processing" | "completed" | "failed";

export type ExtractionMedia = {
  type: "video" | "audio" | "image";
  url: string;
  downloadUrl?: string; // Standardized field for the frontend
  quality?: string;
  thumbUrl?: string;
  title?: string;
  sourcePath?: string; // e.g., 'api', 'direct', 'fixer'
};

export type ExtractJob = {
  id: string;
  platform: Platform;
  sourceUrl: string;
  status: JobStatus;
  progress: number;
  media: Array<ExtractionMedia & {
    mediaId: string;
    expiresAt: string;
  }>;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
};

