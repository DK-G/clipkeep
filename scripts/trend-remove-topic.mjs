#!/usr/bin/env node
// 柱2 トレンド鮮度ページ — P0-4 §5.4「問題トピックの即時・個別撤去導線」（事後対応路）。
//
// 問題のあるトレンドトピック（不適切・誤検出など）を、デプロイなしで即座に
// 公開停止する運用ツール。撤去 slug を本番 KV(TREND_KV) の `topics:removed`
// 配列へ書き込む。アプリ側 (listLiveTopics / isSlugRemoved) がこのキーを読み、
//   - sitemap から除外
//   - /trend/[slug] を 404（コンテンツ消去）
//   - 内部リンク・index 対象から除外
// する。撤去は冪等で、同一トピックが再トレンドしても保持される（別キーのため
// cron の upsert に上書きされない）。
//
// 使い方:
//   node scripts/trend-remove-topic.mjs list                 # 現在の撤去リスト表示（読み取りのみ・安全）
//   node scripts/trend-remove-topic.mjs remove  <slug>       # 撤去（公開停止）
//   node scripts/trend-remove-topic.mjs restore <slug>       # 撤去解除（誤撤去の復帰）
//   ...  [--test]                                            # 本番ではなく test 環境の KV を対象にする
//
// slug は /trend/<slug> の <slug>（例: t-abc123）。本番健全性は --remote 読み取りで
// 必ず本番 ns を見る（2026-06-22 の --remote 付け忘れ誤診断の教訓）。
import { spawnSync } from 'node:child_process';

const REMOVED_KEY = 'topics:removed';
const BINDING = 'TREND_KV';

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error(
    [
      'usage: node scripts/trend-remove-topic.mjs <list|remove|restore> [slug] [--test]',
      '  list             show current removed slugs (read-only)',
      '  remove  <slug>   take a problem topic down (404 + sitemap/index removal)',
      '  restore <slug>   undo a removal',
      '  --test           target the test KV instead of production',
    ].join('\n'),
  );
  process.exit(2);
}

const args = process.argv.slice(2);
const isTest = args.includes('--test');
const positional = args.filter((a) => a !== '--test');
const action = positional[0];
const slug = positional[1];

if (!action || !['list', 'remove', 'restore'].includes(action)) usage('unknown action');
if ((action === 'remove' || action === 'restore') && !slug) usage(`${action} requires a <slug>`);

const config = isTest ? 'wrangler.test.toml' : 'wrangler.production.toml';

function wrangler(cmdArgs) {
  // --remote is mandatory: without it wrangler reads the local miniflare namespace
  // and silently shows an empty / wrong store.
  const full = ['wrangler', ...cmdArgs, '--binding', BINDING, '-c', config, '--remote'];
  const res = spawnSync('npx', full, { encoding: 'utf8', shell: process.platform === 'win32' });
  return res;
}

function readRemoved() {
  const res = wrangler(['kv', 'key', 'get', REMOVED_KEY]);
  if (res.status !== 0) {
    // Missing key (never removed anything yet) surfaces as a non-zero exit.
    const err = (res.stderr || '').toLowerCase();
    if (err.includes('not found') || err.includes('no value')) return [];
    // Any other failure is a real error (auth, wrong ns, CLI bug) — surface it.
    console.error(res.stderr || res.stdout || 'kv get failed');
    process.exit(1);
  }
  const raw = (res.stdout || '').trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error(`unexpected non-array value at ${REMOVED_KEY}: ${raw}`);
    process.exit(1);
  }
}

function writeRemoved(list) {
  const value = JSON.stringify([...new Set(list)].sort());
  const res = wrangler(['kv', 'key', 'put', REMOVED_KEY, value]);
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout || 'kv put failed');
    process.exit(1);
  }
}

const env = isTest ? 'test' : 'PRODUCTION';
const current = readRemoved();

if (action === 'list') {
  console.log(`[${env}] removed topics (${current.length}):`);
  for (const s of current) console.log(`  ${s}`);
  if (current.length === 0) console.log('  (none)');
  process.exit(0);
}

if (action === 'remove') {
  if (current.includes(slug)) {
    console.log(`[${env}] ${slug} already removed; no change.`);
    process.exit(0);
  }
  writeRemoved([...current, slug]);
  console.log(`[${env}] removed ${slug}. /trend/${slug} now 404s and is dropped from sitemap/index.`);
  console.log('Verify: curl -I https://clipkeep.net/trend/' + slug + '  (expect 404)');
  process.exit(0);
}

if (action === 'restore') {
  if (!current.includes(slug)) {
    console.log(`[${env}] ${slug} was not removed; no change.`);
    process.exit(0);
  }
  writeRemoved(current.filter((s) => s !== slug));
  console.log(`[${env}] restored ${slug}. It re-enters the live gate if it still qualifies.`);
  process.exit(0);
}
