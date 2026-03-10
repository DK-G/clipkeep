PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS extractor_jobs (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('telegram', 'twitter', 'tiktok')),
  source_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  result_payload TEXT,
  error_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_extractor_jobs_status_created
  ON extractor_jobs(status, created_at DESC);

CREATE TABLE IF NOT EXISTS solution_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ar')),
  title TEXT NOT NULL,
  body_json TEXT NOT NULL,
  seo_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(slug, locale)
);
