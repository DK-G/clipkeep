-- Migration: Add date-first index on job_stats for trending query performance
-- The trending API queries `WHERE date >= ?` without a locale filter,
-- but the existing index (locale, date, count) has locale as the leading column,
-- causing a full table scan as job_stats grows.
CREATE INDEX IF NOT EXISTS idx_job_stats_date
  ON job_stats(date DESC, job_id);
