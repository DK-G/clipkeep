# Daily Growth Optimization Playbook

Last updated: 2026-05-03

## Purpose

This playbook defines the daily operating loop for improving ClipKeep as an SEO-driven SNS media extraction tool.

The goal is not to make random daily changes. The goal is to identify one high-signal friction point each day, ship a small reversible improvement, and connect that change to a measurable metric.

## Scope

Use this playbook for:

- GA4 screenshot review
- Search Console screenshot review
- landing page and solution page improvement
- downloader funnel improvement
- event tracking checks
- daily task selection

Do not use this playbook for:

- extractor architecture changes
- platform compliance changes
- rate-limit or WAF policy changes
- new bulk download capability

Those require a separate design review or platform stabilization spec.

## Daily Inputs

Minimum screenshots are enough at the current stage.

Required:

1. GA4: Reports -> Realtime
2. GA4: Engagement -> Pages and screens, last 7 days and last 28 days
3. GA4: Acquisition -> Traffic acquisition, last 28 days
4. GA4: Engagement -> Events, last 28 days

Optional:

- Search Console: Performance -> Queries and Pages
- Cloudflare analytics: errors, cached requests, WAF/rate-limit events
- Manual smoke test for top 1-3 downloader pages

## Core Metrics

### Daily Scorecard

Use this small scorecard before deciding the day's task.

| Area | Metric | Current event/source | Daily question |
|---|---|---|---|
| Acquisition | Organic sessions | GA4 traffic acquisition / Search Console | Is SEO bringing qualified users? |
| Landing intent | Top landing pages | GA4 pages and screens | Which user intent is active today? |
| Trust | Submit rate | `extract_submit / downloader page views` | Do visitors trust the page enough to try? |
| Reliability | Completion rate | `processing_complete / extract_submit` | Is the extractor path working? |
| Value moment | Download start rate | `download_actual_start / processing_complete` | Do completed results become real downloads? |
| Friction | Error rate | `error_displayed / extract_submit` | Which platform or URL pattern is failing? |
| Content handoff | Blog CTA rate | `blog_cta_click / blog page views` | Do articles route readers to the tool? |
| Retention | Next-action rate | `cta_next_click`, `result_related_click` | Do users continue after one result? |

If screenshots are used, record the numerator and denominator manually. If API exports are available, use `docs/analytics/README.md`.

### Discovery

| Metric | Source | Why it matters |
|---|---|---|
| Users | GA4 | Confirms actual demand |
| Sessions | GA4 | Separates repeat usage from one-off visits |
| Organic Search sessions | GA4 / Search Console | Confirms SEO acquisition |
| Top landing pages | GA4 | Shows which intent is working |
| Country / locale | GA4 | Shows where translation or page targeting matters |

### Funnel

| Step | Event / proxy | Interpretation |
|---|---|---|
| Visit downloader page | page view | User found a tool surface |
| Submit extraction | `extract_submit` | User trusted the page enough to try |
| Processing completed | `processing_complete` | Extractor and upstream path worked |
| Download started | `download_actual_start` | User reached the real value moment |
| Error displayed | `error_displayed` | User hit a platform or UX failure |

Historical docs may mention older event names such as `download_click`, `similar_click`, `result_view`, or `extract_completed`. Treat the current implementation names above as the daily source of truth unless the code changes.

### Content

| Metric | Source | Interpretation |
|---|---|---|
| Solution page views | GA4 | Troubleshooting demand |
| Blog CTA clicks | `blog_cta_click` | Article-to-tool handoff quality |
| Related result clicks | `result_related_click` | Whether users continue browsing |
| Gallery card clicks | `gallery_card_click` | Discovery module usefulness |

## Daily Check Sequence

Target time: 15-25 minutes.

### 1. Health Check

Confirm:

- GA4 realtime shows current activity or recent activity
- no major drop to zero page views
- no sudden spike in `error_displayed`
- no platform-specific outage visible in manual smoke test

Decision:

- If traffic is normal, continue to growth checks.
- If traffic is zero or errors spike, stop growth work and investigate release, GA tag, extractor health, or Cloudflare status.

### 2. Top Page Movement

Look at GA4 Pages and screens.

Record:

- top 5 pages by views
- pages with visible growth versus previous period
- pages with views but weak downstream action

Patterns:

- Tool page has views but low `extract_submit`: trust/copy/input friction.
- Blog page has views but low `blog_cta_click`: CTA or intent mismatch.
- Solution page has views but no retry path: missing "try again" or platform-specific route.
- Result pages have views but low `download_actual_start`: download UI or guard friction.

When Search Console data is available, join GA4 and Search Console mentally by landing page:

```text
Search query -> landing page -> page views -> extract_submit -> download_actual_start
```

This is more useful than optimizing pages only by page views, because it separates "traffic that reads" from "traffic that tries the tool".

### 3. Funnel Drop Check

Compare event counts:

```text
extract_submit
processing_complete
download_actual_start
error_displayed
```

Rules of thumb:

- `processing_complete / extract_submit` below 70%: platform reliability or invalid URL guidance issue.
- `download_actual_start / processing_complete` below 60%: result page/download UI issue.
- `error_displayed` rising faster than submissions: platform failure, URL validation gap, or copy mismatch.
- `demo_click` high but real submit low: homepage trust is weak or form requires clearer examples.

For deeper weekly analysis, build the same sequence as a GA4 funnel exploration:

```text
page_view on downloader/blog/solution
-> extract_submit or blog_cta_click
-> processing_complete
-> download_actual_start
```

Use an open funnel when users can enter at result/solution pages. Use a closed funnel only when testing a specific guided flow.

### 4. Acquisition Check

Look at Traffic acquisition.

Record:

- Organic Search share
- Direct share
- Referral / Social sources
- any new source/medium

Actions:

- Organic growing: improve the landing pages already receiving impressions.
- Direct growing: improve retention/history/reuse flows.
- Referral growing: identify referring page/community and create a matching solution page.
- Paid/unknown spam showing up: do not optimize around it until validated.

Search Console linkage:

- impressions high + CTR low: metadata/snippet problem
- clicks high + submit low: landing-page trust or intent mismatch
- average position improving + no GA4 movement: page may rank for low-intent queries

### 5. Locale / Country Check

Look for country or language concentration.

Actions:

- Country growing but no localized page: add or improve localized title/description first.
- Locale page has views but weak funnel: check copy length, CTA clarity, and platform naming.
- RTL locale activity: run `docs/ops/arabic_ui_checklist.md` before UI changes.

## Improvement Decision Tree

### Case A: Page has traffic but no submissions

Likely issue:

- user does not trust the tool
- supported platform unclear
- input placeholder does not match copied URL
- CTA copy is generic

Daily improvement options:

- add one trust line near the form
- add "public links only / no login / no cookies" near the form
- add platform-specific URL example
- move warning before the form when platform is degraded
- tighten title/description to match exact search intent

Success metric:

- `extract_submit / page_view` improves after 7 days.

### Case B: Submissions happen but completion is weak

Likely issue:

- extractor instability
- unsupported URL variants
- platform restriction
- bad user expectation

Daily improvement options:

- improve invalid URL message
- add a solution page for the specific failure
- add URL normalization for a safe public URL variant
- add platform-specific limitation copy
- add status/degraded banner when known failure rate rises

Success metric:

- `processing_complete / extract_submit` improves.
- `error_displayed` rate drops.

### Case C: Completed results do not become downloads

Likely issue:

- result page does not make next action obvious
- mobile download behavior confusing
- too many variants or unclear quality labels
- ad/guard friction

Daily improvement options:

- make primary download button clearer
- improve quality labels
- add iPhone/Android hint near download
- reduce visual competition around download options
- create or link device-specific solution page

Success metric:

- `download_actual_start / processing_complete` improves.

### Case D: Blog/solution page gets traffic but does not hand off

Likely issue:

- article answers question but does not route to tool
- CTA too late
- wrong platform target
- search intent is informational, not transactional

Daily improvement options:

- add above-the-fold tool CTA
- add inline CTA after first answer
- add "when this will not work" section
- add internal links to the exact downloader and failure guide
- rewrite intro to answer query in first 2-3 sentences

Success metric:

- `blog_cta_click / blog_page_view` improves.
- downstream `extract_submit` improves.

### Case E: Search impressions exist but CTR is weak

Likely issue:

- title does not match query language
- meta description is generic
- competing pages promise a clearer benefit

Daily improvement options:

- rewrite title around exact query
- add year only when freshness matters
- avoid unsafe claims like private/bulk/cookies
- use "public", "no login", "safe", "not working" where relevant
- strengthen one internal link cluster around the page

Success metric:

- Search Console CTR improves over 7-14 days.

## Daily Task Selection

Choose one task per day using this priority:

1. Fix measurement or outage if data is broken.
2. Fix top funnel leak on the highest-traffic page.
3. Improve a page that is growing organically.
4. Add one solution page for a repeated failure reason.
5. Improve internal linking from article/solution to tool.
6. Add or tune one event if an important behavior is invisible.

Do not pick more than three changes per day. Small changes are easier to attribute.

Each daily task must include:

- one target page or platform
- one metric to improve
- one expected direction
- one recheck date, usually 7 days later

If the proposed task cannot be connected to a metric, move it to weekly planning instead of daily execution.

## Change Types

### Safe Daily Changes

- copy clarification
- CTA placement
- internal link additions
- solution page expansion
- metadata adjustment
- event tracking improvement
- local history/reuse affordance
- platform limitation wording

### Weekly Changes

- new platform support page cluster
- design changes to result/download area
- new dashboard or analytics automation
- larger i18n pass

### Requires Separate Review

- private/login-required support
- cookies-from-browser
- bulk download
- scraping account-level pages
- bypassing platform restrictions
- changing rate-limit thresholds
- changing ad formats

## Daily Log Template

Create a dated note only when a change is made. Use `docs/ops/daily/YYYY-MM-DD.md` if daily records become frequent.

```md
# Daily Growth Log: YYYY-MM-DD

## Data Window
- GA4 period:
- Comparison:

## Observations
- Top page:
- Growing page:
- Weak funnel step:
- Error/platform issue:

## Decision
- Today's task:
- Reason:
- Expected metric:

## Change
- Files:
- Summary:

## Follow-up Date
- Recheck on:
- Metric to compare:
```

## Screenshot Review Checklist

When screenshots are used instead of API exports, capture enough context to avoid guesswork.

Required screenshot details:

- date range visible
- comparison range visible when available
- table rows visible, not only chart
- event names visible
- page paths visible

Minimum screenshot pack:

1. Realtime
2. Pages and screens
3. Traffic acquisition
4. Events
5. Countries or languages

Optional Search Console pack:

1. Queries, last 7 days compared with previous 7 days
2. Pages, same period
3. Query filtered to the top growing landing page
4. Page filtered to the top downloader or solution page

When Search Console screenshots are available, choose improvements from query/page pairs, not from queries alone.

## Automation Trigger

Do not automate GA4 collection yet if weekly screenshots are enough.

Move to automated analytics when at least one condition is true:

- daily sessions exceed 100 for 7 consecutive days
- page count exceeds 100 active pages
- more than 3 growth changes are shipped per week
- platform-specific success rate becomes a recurring question
- manual screenshot review takes more than 30 minutes per review

When triggered, use `docs/analytics/README.md` and `npm run analytics:ga4`.

## Related Docs

- `docs/ops/weekly_review_playbook.md`
- `docs/ops/ga4_weekly_review_template.md`
- `docs/ops/search_query_landing_monitoring_sheet.md`
- `docs/ops/arabic_ui_checklist.md`
- `docs/infra/ga4_key_events_setup.md`
- `docs/analytics/README.md`
