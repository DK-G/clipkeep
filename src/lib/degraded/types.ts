export type DegradedThresholds = {
  enterErrorRatio: number;
  recoverErrorRatio: number;
  enterQueueWaitP95Ms: number;
  recoverQueueWaitP95Ms: number;
  enterActiveJobs: number;
  recoverActiveJobs: number;
  recoverWindowMs: number;
};

export type DegradedMetrics = {
  totalExtractAttempts: number;
  upstreamFailures: number;
  queueWaitSamplesMs: number[];
  activeJobs: number;
};

export type DegradedSnapshot = {
  isDegraded: boolean;
  reason: "manual" | "error_ratio" | "queue_wait" | "active_jobs" | "recovered" | "none";
  metrics: {
    errorRatio: number;
    queueWaitP95Ms: number;
    activeJobs: number;
  };
};

