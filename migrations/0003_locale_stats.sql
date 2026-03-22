-- Migration: Add locale tracking and stats table for Trending/Latest
ALTER TABLE extractor_jobs ADD COLUMN locale TEXT DEFAULT 'en';

-- For future-proof language specific trends
CREATE TABLE IF NOT EXISTS job_stats (
    job_id TEXT NOT NULL,
    locale TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (job_id, locale, date)
);

-- Index for localized trending queries
CREATE INDEX IF NOT EXISTS idx_job_stats_locale_date 
  ON job_stats(locale, date DESC, count DESC);
