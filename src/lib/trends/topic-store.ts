// 柱2 トレンド鮮度ページ — Phase 0 配管。
// トレンド・トピック -> jobIds マップを KV (TREND_KV) に永続化する。
// D1 スキーマには意図的に触れない（Phase 1 で専用テーブルを導入する）。
// 設計正本: docs/strategy/trend-freshness-pages-design.md
import type { Locale } from "@/lib/i18n/ui";

export type TopicJob = {
  jobId: string;
  sourceUrl: string;
  platform: string;
  addedAt: string;
};

export type TopicRecord = {
  /** /trend/<slug> URL に使う安定 ID（判断4: t-<hash>）。検索語は本文側で当てる。 */
  slug: string;
  /** 正規化キー（KV キーのサフィックス）。 */
  key: string;
  /** 元のトレンド表示名（本文/見出しに出す語句）。 */
  displayName: string;
  platform: string;
  locale: Locale;
  firstSeenAt: string;
  lastTrendedAt: string;
  jobs: TopicJob[];
};

export type TopicLink = {
  topic: string;
  platform: string;
  jobId: string;
  sourceUrl: string;
};

export type RunMeta = {
  at: string;
  discovered: { twitter: number; tiktok: number };
  topicsWritten: number;
  jobsLinked: number;
};

export const TOPIC_PREFIX = "topic:";
export const INDEX_KEY = "topics:index";
export const META_KEY = "meta:last_run";
const MAX_JOBS_PER_TOPIC = 20;

/** トレンド表示名を KV キー用に正規化する（小文字・先頭 # 除去・空白圧縮）。 */
export function normalizeTopicKey(name: string): string {
  return name
    .normalize("NFKC")
    .trim()
    .replace(/^[#＃]+/, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** 正規化キーから安定した slug（t-<hash>）を生成する（FNV-1a, 同期）。 */
export function slugifyTopic(name: string): string {
  const normalized = normalizeTopicKey(name);
  let h = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return "t-" + (h >>> 0).toString(36);
}

function safeParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * トピック -> jobIds を KV へ upsert する。既存レコードがあれば jobs を追記（dedup・上限あり）。
 * @returns 書き込んだトピック数とリンクした job 数
 */
export async function recordTopicLinks(
  kv: KVNamespace,
  links: TopicLink[],
  locale: Locale,
): Promise<{ topicsWritten: number; jobsLinked: number }> {
  const now = new Date().toISOString();

  // 正規化キーでグルーピング
  const byKey = new Map<string, { displayName: string; platform: string; links: TopicLink[] }>();
  for (const link of links) {
    const key = normalizeTopicKey(link.topic);
    if (!key) continue;
    const bucket = byKey.get(key) ?? { displayName: link.topic.trim(), platform: link.platform, links: [] };
    bucket.links.push(link);
    byKey.set(key, bucket);
  }

  let jobsLinked = 0;
  const writtenKeys: string[] = [];

  for (const [key, bucket] of byKey) {
    const existingRaw = await kv.get(TOPIC_PREFIX + key);
    const existing = existingRaw ? safeParse<TopicRecord>(existingRaw) : null;
    const jobs = existing?.jobs ? [...existing.jobs] : [];
    const seen = new Set(jobs.map((j) => j.jobId));

    for (const link of bucket.links) {
      if (seen.has(link.jobId)) continue;
      jobs.push({ jobId: link.jobId, sourceUrl: link.sourceUrl, platform: link.platform, addedAt: now });
      seen.add(link.jobId);
      jobsLinked++;
    }

    const record: TopicRecord = {
      slug: slugifyTopic(key),
      key,
      displayName: existing?.displayName ?? bucket.displayName,
      platform: existing?.platform ?? bucket.platform,
      locale: existing?.locale ?? locale,
      firstSeenAt: existing?.firstSeenAt ?? now,
      lastTrendedAt: now,
      jobs: jobs.slice(-MAX_JOBS_PER_TOPIC),
    };

    await kv.put(TOPIC_PREFIX + key, JSON.stringify(record));
    writtenKeys.push(key);
  }

  if (writtenKeys.length > 0) {
    await mergeIndex(kv, writtenKeys);
  }

  return { topicsWritten: writtenKeys.length, jobsLinked };
}

async function mergeIndex(kv: KVNamespace, keys: string[]): Promise<void> {
  const raw = await kv.get(INDEX_KEY);
  const current = raw ? safeParse<string[]>(raw) ?? [] : [];
  const set = new Set(current);
  for (const k of keys) set.add(k);
  await kv.put(INDEX_KEY, JSON.stringify([...set]));
}

/** 毎回のヒートビート。トレンド有無に関わらず「配管が動いた」ことを検証可能にする。 */
export async function recordRunMeta(kv: KVNamespace, meta: Omit<RunMeta, "at">): Promise<void> {
  const record: RunMeta = { at: new Date().toISOString(), ...meta };
  await kv.put(META_KEY, JSON.stringify(record));
}
