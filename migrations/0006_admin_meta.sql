-- Migration: Add admin_meta table for storing admin-level key-value state
-- Used by auto-trend rate limiting to persist last execution timestamp.
CREATE TABLE IF NOT EXISTS admin_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
