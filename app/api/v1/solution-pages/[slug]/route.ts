export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { findSolutionPage } from "@/lib/solution-pages/store";

type Context = {
  params: Promise<{ slug: string }>;
};

function normalizeLocale(value: string | null): "en" | "ar" | null {
  if (!value) return "en";
  const normalized = value.toLowerCase();
  if (normalized === "en" || normalized === "ar") return normalized;
  return null;
}

export async function GET(request: Request, context: Context) {
  const requestId = await getRequestId();
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const locale = normalizeLocale(searchParams.get("locale"));

  if (!locale) {
    return failure({
      status: 400,
      requestId,
      error: {
        code: "INVALID_REQUEST",
        message: "locale must be en or ar",
        details: {},
      },
    });
  }

  const page = findSolutionPage(slug, locale);
  if (!page) {
    return failure({
      status: 404,
      requestId,
      locale,
      error: {
        code: "JOB_NOT_FOUND",
        message: "Solution page not found",
        details: { slug, locale },
      },
    });
  }

  return success({
    requestId,
    locale,
    data: {
      slug: page.slug,
      locale: page.locale,
      title: page.title,
      sections: page.sections,
      cta: page.cta,
    },
  });
}
