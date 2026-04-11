# Telegram Architecture Assessment

Date: 2026-04-11  
Method: bynote (NotebookLM Deep Research + internal implementation review)  
Scope: Current ClipKeep architecture (`Next.js + Cloudflare Worker + D1`, no MTProto service)

## Verdict
- Conditionally appropriate.

## Why This Is Acceptable Now
- Public Telegram post extraction via `embed=1` is aligned with current edge-native architecture.
- Current implementation includes practical hardening:
- strict host/path normalization for Telegram input
- proxy domain allowlist and `dl=1` gated attachment behavior
- failure classification and release checks for Telegram probes
- Operational cost/complexity remains low compared with introducing a separate MTProto service.

## Explicit Boundaries (Accepted)
- Private / invite-only / restricted-saving content is out of scope.
- Public embed DOM changes can break extraction and require maintenance updates.
- This design is for lightweight public extraction, not full Telegram client parity.

## Residual Risks
- Upstream HTML/metadata format drift can increase false `MEDIA_NOT_FOUND` or degraded quality.
- 403/429 pressure can reduce extraction success under sustained traffic patterns.
- Large-file reliability remains limited by the current Worker-centric execution model.

## Architecture Change Triggers
- Need to support private/restricted Telegram media reliably.
- Need to support sustained large-file workflows with stronger resumable guarantees.
- Repeated upstream breakage makes embed-based maintenance cost exceed current ops threshold.

## Current Decision
- Keep current architecture for Telegram in this phase.
- Continue incremental hardening and monitoring within existing stack.
- Re-evaluate only when one of the above triggers is met.
