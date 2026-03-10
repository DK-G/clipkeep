# Benchmark Observation Log (P2-17)

## 1. Method
- Source: `memo.md` line 26+
- Axes:
  - UI (input, CTA, ad placement)
  - SEO (slug, heading, FAQ)
  - UX (clicks to download)
  - RTL (layout mirror quality)

## 2. Competitor Matrix

| Site | Category | UI Notes | SEO Notes | UX Notes | RTL Notes | ClipKeep Action |
|---|---|---|---|---|---|---|
| SnapInsta | Direct downloader | Very simple input-first UI, clear CTA | Many intent pages | Short flow | N/A | Keep hero minimal and CTA above fold |
| SSSTwitter | Direct downloader | Focused single-purpose screens | Strong multilingual page set | Fast input-to-result | Partial | Reuse multilingual structure for Telegram/X |
| SaveFrom | Hub model | Hub navigation to many sources | Platform hub slugs | Moderate flow | N/A | Add hub routing and platform landing consistency |
| SnapTik | Direct downloader | TikTok-specific optimized UI | Strong TikTok query capture | Very short flow | N/A | Keep for Phase 4 TikTok reference |
| Y2mate | UI reference | Input + immediate action pattern | Basic SEO | Very few clicks | N/A | Maintain <=3 clicks from input to result |
| 9xbuddy | UI reference | Hub-oriented simple UI | Broad intent pages | Moderate clicks | N/A | Use simple hub layout for generic pages |
| HowToGeek | SEO reference | Article-first layout | Strong how-to structure | Guided steps | N/A | Apply heading/FAQ template for solution pages |
| WikiHow | SEO reference | Step-heavy explainers | Long-tail query coverage | Educational flow | N/A | Add step-by-step + common mistakes block |
| Aljazeera | RTL reference | Mature RTL layout patterns | News SEO style | N/A | High quality | Use mirrored spacing and nav direction checks |
| ArabyTools | RTL tools reference | Tool-style RTL UI | Tool query slugs | Short utility flow | Good | Validate Arabic tool UX patterns for extractor pages |

## 3. Key Decisions Applied
- Do not copy one site wholesale; combine strengths by layer.
- Telegram/X pages use downloader hub + how-to pages in parallel.
- CTA placement: primary action always above fold.
- Target UX: input -> result within 3 clicks.
- RTL: enforce logical CSS properties and mirrored iconography.

## 4. Gaps / Follow-up
- Need quantified ad density benchmark before monetization decisions.
- Need keyword difficulty scoring for top 30 pages.
- Need manual screenshot archive for UI parity review.
