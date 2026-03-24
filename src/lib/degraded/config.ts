import type { DegradedThresholds } from "@/lib/degraded/types";

export const DEGRADED_THRESHOLDS: DegradedThresholds = {
  enterErrorRatio: 0.25,
  recoverErrorRatio: 0.1,
  enterQueueWaitP95Ms: 8000,
  recoverQueueWaitP95Ms: 4000,
  enterActiveJobs: 500,
  recoverActiveJobs: 300,
  recoverWindowMs: 10 * 60 * 1000,
};

export function isManualOverrideEnabled(): boolean {
  const value = (process.env.DEGRADED_FORCE ?? "").toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

