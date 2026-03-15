-- Migration: Add gallery-specific columns for tracking recent and trending videos
-- Add columns to extractor_jobs table
ALTER TABLE extractor_jobs ADD COLUMN thumbnail_url TEXT;
ALTER TABLE extractor_jobs ADD COLUMN is_public INTEGER NOT NULL DEFAULT 1; -- 1 for true, 0 for false
ALTER TABLE extractor_jobs ADD COLUMN access_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE extractor_jobs ADD COLUMN last_accessed_at TEXT;

-- Create index for faster access-based queries (Trending/Recent)
CREATE INDEX IF NOT EXISTS idx_extractor_jobs_gallery
  ON extractor_jobs(platform, status, is_public, access_count DESC, created_at DESC);
