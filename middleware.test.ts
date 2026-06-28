import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware";

// NEXT_PUBLIC_SITE_URL is unset in the test env, so CANONICAL_HOST defaults to
// clipkeep.net (see middleware.ts). All canonical-host cases use that host.
function req(url: string, host?: string): NextRequest {
  const headers = new Headers();
  if (host) headers.set("host", host);
  return new NextRequest(url, { headers });
}

function rewriteTarget(res: Response): URL | null {
  const h = res.headers.get("x-middleware-rewrite");
  return h ? new URL(h) : null;
}

const isNext = (res: Response) => res.headers.get("x-middleware-next") === "1";

describe("canonical host redirect (duplicate-content guard)", () => {
  it("301-redirects a non-canonical workers.dev host to the canonical origin", () => {
    const res = middleware(req("https://clipkeep-web.workers.dev/result?id=abc", "clipkeep-web.workers.dev"));
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://clipkeep.net/result?id=abc");
  });

  it("does not redirect the canonical host", () => {
    const res = middleware(req("https://clipkeep.net/", "clipkeep.net"));
    expect(res.status).not.toBe(301);
    expect(isNext(res)).toBe(true);
  });

  it("does not redirect a non-workers.dev host (e.g. a custom preview)", () => {
    const res = middleware(req("https://staging.example.com/", "staging.example.com"));
    expect(res.status).not.toBe(301);
  });
});

describe("passthrough paths", () => {
  it.each(["/api/v1/health", "/_next/static/chunk.js", "/favicon.ico", "/sitemap.xml"])(
    "calls next() for %s without rewriting",
    (path) => {
      const res = middleware(req(`https://clipkeep.net${path}`, "clipkeep.net"));
      expect(isNext(res)).toBe(true);
      expect(rewriteTarget(res)).toBeNull();
    },
  );
});

describe("locale path rewrite (ja/pt/ar)", () => {
  it.each(["ja", "pt", "ar"])("rewrites /%s/result to /result?locale=%s", (locale) => {
    const res = middleware(req(`https://clipkeep.net/${locale}/result`, "clipkeep.net"));
    const target = rewriteTarget(res);
    expect(target).not.toBeNull();
    expect(target!.pathname).toBe("/result");
    expect(target!.searchParams.get("locale")).toBe(locale);
  });

  it("rewrites a bare locale root /ja to / with locale set", () => {
    const target = rewriteTarget(middleware(req("https://clipkeep.net/ja", "clipkeep.net")));
    expect(target!.pathname).toBe("/");
    expect(target!.searchParams.get("locale")).toBe("ja");
  });

  it("preserves existing query params alongside the injected locale", () => {
    const target = rewriteTarget(middleware(req("https://clipkeep.net/pt/result?id=abc&x=1", "clipkeep.net")));
    expect(target!.pathname).toBe("/result");
    expect(target!.searchParams.get("locale")).toBe("pt");
    expect(target!.searchParams.get("id")).toBe("abc");
    expect(target!.searchParams.get("x")).toBe("1");
  });
});

describe("default (en) and unknown segments are not rewritten", () => {
  it.each(["/", "/result", "/solutions/tiktok", "/de/result"])(
    "calls next() for non-path-locale %s (en is the default, de is header-based)",
    (path) => {
      const res = middleware(req(`https://clipkeep.net${path}`, "clipkeep.net"));
      expect(isNext(res)).toBe(true);
      expect(rewriteTarget(res)).toBeNull();
    },
  );
});
