import { getRequestId } from "@/lib/api/request-id";
import { failure, success } from "@/lib/api/response";
import { findSolutionPage } from "@/lib/solution-pages/store";
import { normalizeLocale, type Locale } from "@/lib/i18n/ui";

type Context = {
  params: Promise<{ slug: string }>;
};

const supported = new Set(["en", "ja", "ar", "es", "pt", "fr", "id", "hi", "de", "tr"]);

function normalizeApiLocale(value: string | null): Locale | null {
  if (!value) return "en";
  const normalized = value.toLowerCase();
  if (!supported.has(normalized)) return null;
  return normalizeLocale(normalized);
}

export async function GET(request: Request, context: Context) {
  const requestId = await getRequestId();
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const locale = normalizeApiLocale(searchParams.get("locale"));

  if (!locale) {
    return failure({
      status: 400,
      requestId,
      error: {
        code: "INVALID_REQUEST",
        message: "locale must be one of en, ja, ar, es, pt, fr, id, hi, de, tr",
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
