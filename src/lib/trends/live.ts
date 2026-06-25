// 柱2 トレンド鮮度ページ — P0-3 ランタイム読み取りヘルパー。
// getCloudflareContext（@opennextjs/cloudflare）への依存をここに隔離し、
// sitemap / trending 内部リンク / trend ページの index 判定から共通利用する。
// ビルド時の静的生成や bindings 未注入では throw しうるため、すべて空フォールバックで握り潰す。
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { listLiveTopics, listRemovedSlugs, type LiveTopic } from '@/lib/trends/topic-store';

async function getTrendKv(): Promise<KVNamespace | null> {
  try {
    const env = (await getCloudflareContext()).env as { TREND_KV?: KVNamespace };
    return env.TREND_KV ?? null;
  } catch {
    return null;
  }
}

/** ゲート通過した live トピック。KV 不在・読み取り失敗時は空配列（呼び出し側は描画を省く）。 */
export async function loadLiveTopics(): Promise<LiveTopic[]> {
  const kv = await getTrendKv();
  if (!kv) return [];
  try {
    return await listLiveTopics(kv);
  } catch {
    return [];
  }
}

/** 指定プラットフォームの live トピックのみ（/trending/[platform] の内部リンク用）。 */
export async function loadLiveTopicsForPlatform(platform: string): Promise<LiveTopic[]> {
  const topics = await loadLiveTopics();
  const p = platform.toLowerCase();
  return topics.filter((t) => t.platform.toLowerCase() === p);
}

/** slug が live（ゲート通過＝index/ sitemap 対象）か。trend ページの robots 判定に使う。 */
export async function isSlugLive(slug: string): Promise<boolean> {
  const topics = await loadLiveTopics();
  return topics.some((t) => t.slug === slug);
}

/**
 * slug が手動撤去済みか（P0-4 §5.4 個別撤去導線）。trend ページが撤去トピックを
 * 404（コンテンツ消去）にするか判定する。KV 不在・読み取り失敗時は false（誤って消さない）。
 */
export async function isSlugRemoved(slug: string): Promise<boolean> {
  const kv = await getTrendKv();
  if (!kv) return false;
  try {
    const removed = await listRemovedSlugs(kv);
    return removed.has(slug);
  } catch {
    return false;
  }
}
