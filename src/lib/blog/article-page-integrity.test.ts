import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { keywordArticles } from "./keyword-articles";

// Source-level guard for app/blog/[slug]/page.tsx.
//
// Why the assertions read the file as text instead of importing it: the per-slug
// failure-line dictionaries and the platform CTA hrefs live inside a Next App
// Router page module, which cannot be imported in a node test environment and
// must not grow extra exports just to be testable.
//
// What this protects: on 2026-09-03 a Portuguese word replacement ("video" ->
// "vídeo") had been applied to the whole page instead of only its pt branches.
// It rewrote 400 lookup keys into slugs that no article has, so 40 of 50
// articles silently fell back to the same three generic failure lines in all 10
// locales, and it broke 3 internal hrefs into live 404s. Nothing failed: types,
// lint and build were all green, because a dictionary miss is valid TypeScript.
// These are the two invariants that were violated.

const PAGE = fileURLToPath(new URL("../../../app/blog/[slug]/page.tsx", import.meta.url));
const source = readFileSync(PAGE, "utf8");

// Entries of the *SpecificFailLines dictionaries: four-space-indented
// 'slug': [ ... ] pairs.
const lookupKeys = [...source.matchAll(/^ {4}'([^']+)':\s*\[/gm)].map((m) => m[1]);

describe("blog article page: per-slug content is reachable", () => {
  const slugs = new Set(keywordArticles.map((a) => a.slug));

  it("finds per-slug failure-line entries in the page source", () => {
    // Guards the probe itself: if the dictionary shape changes, the two
    // assertions below would pass vacuously on an empty list.
    expect(lookupKeys.length).toBeGreaterThan(0);
  });

  it("resolves every failure-line key to a real article slug", () => {
    const orphans = lookupKeys.filter((k) => !slugs.has(k));
    expect(orphans).toEqual([]);
  });

  it("gives every article its own failure lines rather than the generic fallback", () => {
    const keyed = new Set(lookupKeys);
    const genericOnly = keywordArticles.map((a) => a.slug).filter((s) => !keyed.has(s));
    expect(genericOnly).toEqual([]);
  });
});

describe("blog article page: internal links point at real routes", () => {
  it("uses unaccented platform downloader paths", () => {
    const hrefs = [...source.matchAll(/\/download-[a-z]+-[a-zíé]+/g)].map((m) => m[0]);
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((h) => !h.endsWith("-video"))).toEqual([]);
  });
});
