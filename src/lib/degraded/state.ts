import type { DegradedMetrics } from "@/lib/degraded/types";

const WINDOW_MS = 5 * 60 * 1000;

type TimedQueueSample = {
  at: number;
  waitMs: number;
};

const state: {
  totalExtractAttempts: number;
  upstreamFailures: number;
  queueSamples: TimedQueueSample[];
  activeJobs: number;
  isDegraded: boolean;
  degradedEnteredAt: number | null;
} = {
  totalExtractAttempts: 0,
  upstreamFailures: 0,
  queueSamples: [],
  activeJobs: 0,
  isDegraded: false,
  degradedEnteredAt: null,
};

function trimOldSamples(now: number): void {
  state.queueSamples = state.queueSamples.filter((s) => now - s.at <= WINDOW_MS);
}

export function recordExtractAttempt(args: { upstreamFailed: boolean; queueWaitMs: number }): void {
  const now = Date.now();
  state.totalExtractAttempts += 1;
  if (args.upstreamFailed) state.upstreamFailures += 1;
  state.queueSamples.push({ at: now, waitMs: Math.max(0, args.queueWaitMs) });
  trimOldSamples(now);
}

export function setActiveJobs(count: number): void {
  state.activeJobs = Math.max(0, count);
}

export function getMetrics(): DegradedMetrics {
  trimOldSamples(Date.now());
  return {
    totalExtractAttempts: state.totalExtractAttempts,
    upstreamFailures: state.upstreamFailures,
    queueWaitSamplesMs: state.queueSamples.map((s) => s.waitMs),
    activeJobs: state.activeJobs,
  };
}

export function getDegradedFlag(): { isDegraded: boolean; enteredAt: number | null } {
  return { isDegraded: state.isDegraded, enteredAt: state.degradedEnteredAt };
}

export function setDegradedFlag(isDegraded: boolean): void {
  if (state.isDegraded === isDegraded) return;
  state.isDegraded = isDegraded;
  state.degradedEnteredAt = isDegraded ? Date.now() : null;
}

