-- Migration: Expand platform CHECK constraint in extractor_jobs
-- SQLite doesn't support ALTER TABLE ... DROP CONSTRAINT or ALTER COLUMN,
-- so we must create a new table, copy data, and swap it.

CREATE TABLE extractor_jobs_new (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('telegram', 'twitter', 'tiktok', 'instagram', 'reddit', 'pinterest', 'facebook', 'threads', 'bluesky', 'lemon8', 'bilibili', 'discord')),
  source_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  result_payload TEXT,
  error_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  -- Columns from 0002_gallery.sql
  thumbnail_url TEXT,
  is_public INTEGER NOT NULL DEFAULT 1,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TEXT,
  -- Column from 0003_locale_stats.sql
  locale TEXT DEFAULT 'en'
);

INSERT INTO extractor_jobs_new SELECT * FROM extractor_jobs;

DROP TABLE extractor_jobs;

ALTER TABLE extractor_jobs_new RENAME TO extractor_jobs;

-- Re-create indices that were dropped with the table
CREATE INDEX IF NOT EXISTS idx_extractor_jobs_status_created
  ON extractor_jobs(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_extractor_jobs_gallery
  ON extractor_jobs(platform, status, is_public, access_count DESC, created_at DESC);
