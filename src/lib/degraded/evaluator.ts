import { DEGRADED_THRESHOLDS, isManualOverrideEnabled } from "@/lib/degraded/config";
import { getDegradedFlag, getMetrics, setDegradedFlag } from "@/lib/degraded/state";
import type { DegradedSnapshot } from "@/lib/degraded/types";

function percentile95(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1);
  return sorted[idx];
}

function errorRatio(total: number, failed: number): number {
  if (total <= 0) return 0;
  return failed / total;
}

export function evaluateDegraded(): DegradedSnapshot {
  const metrics = getMetrics();
  const ratio = errorRatio(metrics.totalExtractAttempts, metrics.upstreamFailures);
  const p95 = percentile95(metrics.queueWaitSamplesMs);
  const active = metrics.activeJobs;

  const current = getDegradedFlag();

  if (isManualOverrideEnabled()) {
    setDegradedFlag(true);
    return {
      isDegraded: true,
      reason: "manual",
      metrics: { errorRatio: ratio, queueWaitP95Ms: p95, activeJobs: active },
    };
  }

  const enter =
    ratio >= DEGRADED_THRESHOLDS.enterErrorRatio ||
    p95 >= DEGRADED_THRESHOLDS.enterQueueWaitP95Ms ||
    active >= DEGRADED_THRESHOLDS.enterActiveJobs;

  if (!current.isDegraded && enter) {
    setDegradedFlag(true);
    const reason =
      ratio >= DEGRADED_THRESHOLDS.enterErrorRatio
        ? "error_ratio"
        : p95 >= DEGRADED_THRESHOLDS.enterQueueWaitP95Ms
        ? "queue_wait"
        : "active_jobs";
    return {
      isDegraded: true,
      reason,
      metrics: { errorRatio: ratio, queueWaitP95Ms: p95, activeJobs: active },
    };
  }

  if (current.isDegraded) {
    const canRecover =
      ratio < DEGRADED_THRESHOLDS.recoverErrorRatio &&
      p95 < DEGRADED_THRESHOLDS.recoverQueueWaitP95Ms &&
      active < DEGRADED_THRESHOLDS.recoverActiveJobs;

    if (canRecover && current.enteredAt && Date.now() - current.enteredAt >= DEGRADED_THRESHOLDS.recoverWindowMs) {
      setDegradedFlag(false);
      return {
        isDegraded: false,
        reason: "recovered",
        metrics: { errorRatio: ratio, queueWaitP95Ms: p95, activeJobs: active },
      };
    }

    return {
      isDegraded: true,
      reason: "none",
      metrics: { errorRatio: ratio, queueWaitP95Ms: p95, activeJobs: active },
    };
  }

  return {
    isDegraded: false,
    reason: "none",
    metrics: { errorRatio: ratio, queueWaitP95Ms: p95, activeJobs: active },
  };
}
