# ClipKeep DB Schema (MVP v0.2)

## Scope
- DB: Cloudflare D1
- Domain: extractor jobs, solution pages
- FactItems / votes は対象外

## Tables
- `extractor_jobs`
  - `id`, `platform`, `source_url`, `status`, `progress`, `result_payload`, `error_code`, `created_at`, `updated_at`
- `solution_pages`
  - `id`, `slug`, `locale`, `title`, `body_json`, `seo_json`, `updated_at`
