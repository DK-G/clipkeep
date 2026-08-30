import { describe, expect, it } from "vitest";

// The growth summary is an untyped ESM script (tsconfig has allowJs: false), so
// the import is deliberately unchecked. Only the pure aggregators are imported;
// growth-summary.mjs runs main() only when it is the process entry point.
// @ts-expect-error - untyped ESM analytics script
import * as summary from "./growth-summary.mjs";

const { isBrandQuery, computeBrandSplit, computePageDimension, computeMeasurementDivergence } = summary as {
  isBrandQuery: (query: string) => boolean;
  computeBrandSplit: (rows: Record<string, string>[]) => any;
  computePageDimension: (rows: Record<string, string>[]) => any;
  computeMeasurementDivergence: (rows: Record<string, string>[]) => any;
};

describe("isBrandQuery", () => {
  it("treats spacing and punctuation variants of the product name as brand", () => {
    for (const q of ["clipkeep", "ClipKeep", "clip keep", "clip-keep", "clipkeep.net", "clipkeep video"]) {
      expect(isBrandQuery(q)).toBe(true);
    }
  });

  it("treats look-alike names that do not contain the product name as non-brand", () => {
    for (const q of ["tubekeep", "twitter video download", "keep clip"]) {
      expect(isBrandQuery(q)).toBe(false);
    }
  });
});

describe("computeBrandSplit", () => {
  const rows = [
    { query: "clipkeep", impressions: "3", clicks: "1", position: "9" },
    { query: "clipkeep", impressions: "1", clicks: "0", position: "5" },
    { query: "tubekeep", impressions: "2", clicks: "0", position: "50" },
  ];

  it("separates brand from non-brand impressions and reports the non-brand share", () => {
    const split = computeBrandSplit(rows);
    expect(split.brand.impressions).toBe(4);
    expect(split.brand.clicks).toBe(1);
    expect(split.brand.queryCount).toBe(1);
    expect(split.nonBrand.impressions).toBe(2);
    expect(split.totalImpressions).toBe(6);
    expect(split.nonBrandShare).toBeCloseTo(2 / 6);
  });

  it("weights position by impressions instead of averaging rows", () => {
    const split = computeBrandSplit(rows);
    // (9*3 + 5*1) / 4 = 8, not (9+5)/2 = 7.
    expect(split.brand.topQueries[0].position).toBeCloseTo(8);
  });

  it("reports a zero non-brand share rather than dividing by zero on empty input", () => {
    const split = computeBrandSplit([]);
    expect(split.hasData).toBe(false);
    expect(split.nonBrandShare).toBe(0);
    expect(split.nonBrand.impressions).toBe(0);
  });
});

describe("computePageDimension", () => {
  const rows = [
    { page: "https://clipkeep.net/", locale: "en", impressions: "8", clicks: "0", position: "16" },
    { page: "https://clipkeep.net/pt", locale: "pt", impressions: "2", clicks: "1", position: "2" },
    { page: "https://clipkeep.net/pt/latest", locale: "pt", impressions: "1", clicks: "0", position: "4" },
    { page: "https://clipkeep.net/ja", locale: "ja", impressions: "1", clicks: "0", position: "25" },
  ];

  it("aggregates impressions per locale, sorted by impressions", () => {
    const dim = computePageDimension(rows);
    expect(dim.impressions).toBe(12);
    expect(dim.clicks).toBe(1);
    expect(dim.byLocale.map((l: { locale: string }) => l.locale)).toEqual(["en", "pt", "ja"]);
    expect(dim.byLocale[1]).toMatchObject({ locale: "pt", impressions: 3, pageCount: 2 });
  });

  it("bands pages by average position", () => {
    const dim = computePageDimension(rows);
    expect(dim.byPositionBand["1-3"].impressions).toBe(2);
    expect(dim.byPositionBand["4-10"].impressions).toBe(1);
    expect(dim.byPositionBand["11-20"].impressions).toBe(8);
    expect(dim.byPositionBand["21+"].impressions).toBe(1);
  });

  it("returns an empty-but-valid shape when the export is missing", () => {
    const dim = computePageDimension([]);
    expect(dim.hasData).toBe(false);
    expect(dim.impressions).toBe(0);
    expect(dim.position).toBe(0);
    expect(dim.byLocale).toEqual([]);
  });
});

describe("computeMeasurementDivergence", () => {
  it("flags traffic that starts sessions but never renders a page", () => {
    const divergence = computeMeasurementDivergence([
      { eventName: "session_start", eventCount: "223", activeUsers: "223" },
      { eventName: "page_view", eventCount: "4", activeUsers: "1" },
      { eventName: "ad_script_load", eventCount: "429", activeUsers: "220" },
    ]);
    expect(divergence.pageViewPerSessionStart).toBeCloseTo(4 / 223);
    expect(divergence.pageViewUsers).toBe(1);
    expect(divergence.humanShaped).toBe(false);
  });

  it("does not flag traffic whose sessions render pages", () => {
    const divergence = computeMeasurementDivergence([
      { eventName: "session_start", eventCount: "100", activeUsers: "100" },
      { eventName: "page_view", eventCount: "140", activeUsers: "95" },
    ]);
    expect(divergence.humanShaped).toBe(true);
  });

  it("does not report a healthy ratio when there is no data at all", () => {
    const divergence = computeMeasurementDivergence([]);
    expect(divergence.hasData).toBe(false);
    expect(divergence.pageViewPerSessionStart).toBe(0);
    expect(divergence.humanShaped).toBe(false);
  });
});
