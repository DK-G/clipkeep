export type Locale = "en" | "ar";

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "ar" ? "ar" : "en";
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

type HomeDict = {
  title: string;
  subtitle: string;
  platformLabel: string;
  sourceUrlLabel: string;
  localeLabel: string;
  localeEn: string;
  localeAr: string;
  submit: string;
  submitting: string;
  status: string;
  initialMessage: string;
  creatingJob: string;
  degradedMessage: string;
  invalidRequest: string;
  networkError: string;
  helpPage: string;
};

type ResultDict = {
  title: string;
  jobIdLabel: string;
  statusLabel: string;
  stateLabel: string;
  progressLabel: string;
  loading: string;
  failedToLoad: string;
  completed: string;
  polling: (status: string) => string;
  networkError: string;
  downloads: string;
  noMedia: string;
  warnings: string;
  needHelp: string;
  checkSolution: string;
};

type SolutionDict = {
  loading: string;
  title: string;
  notFound: string;
  networkError: string;
  heroSubtitle: string;
  quickAnswer: string;
  quickFallback: string;
  stepByStep: string;
  trustSafety: string;
  trustBody: string;
  internalLinks: string;
};

type DegradedDict = {
  title: string;
  body: string;
  reasonLabel: string;
  retryAfter: string;
  openGuide: string;
  reasons: Record<string, string>;
};

export const homeText: Record<Locale, HomeDict> = {
  en: {
    title: "ClipKeep Extractor",
    subtitle: "MVP: Telegram first, then X/Twitter. TikTok is planned later.",
    platformLabel: "Platform",
    sourceUrlLabel: "Source URL",
    localeLabel: "Locale",
    localeEn: "English",
    localeAr: "Arabic (RTL)",
    submit: "Start Extract",
    submitting: "Submitting...",
    status: "Status",
    initialMessage: "Paste a Telegram/X post URL and start extraction.",
    creatingJob: "Creating extraction job...",
    degradedMessage: "Extractor is temporarily limited. Please check solution guidance.",
    invalidRequest: "Request failed. Check URL/platform and try again.",
    networkError: "Network error while creating job.",
    helpPage: "Help page",
  },
  ar: {
    title: "أداة ClipKeep",
    subtitle: "النسخة الأولية: تيليجرام أولًا ثم X/تويتر. تيك توك لاحقًا.",
    platformLabel: "المنصة",
    sourceUrlLabel: "رابط المصدر",
    localeLabel: "اللغة",
    localeEn: "الإنجليزية",
    localeAr: "العربية (RTL)",
    submit: "ابدأ الاستخراج",
    submitting: "جارٍ الإرسال...",
    status: "الحالة",
    initialMessage: "ألصق رابط منشور تيليجرام/X وابدأ الاستخراج.",
    creatingJob: "جارٍ إنشاء مهمة الاستخراج...",
    degradedMessage: "الخدمة محدودة مؤقتًا. راجع صفحة الحلول.",
    invalidRequest: "فشل الطلب. تحقق من الرابط/المنصة ثم أعد المحاولة.",
    networkError: "خطأ شبكة أثناء إنشاء المهمة.",
    helpPage: "صفحة المساعدة",
  },
};

export const resultText: Record<Locale, ResultDict> = {
  en: {
    title: "Extraction Result",
    jobIdLabel: "Job ID",
    statusLabel: "Status",
    stateLabel: "State",
    progressLabel: "Progress",
    loading: "Loading result...",
    failedToLoad: "Failed to load result.",
    completed: "Extraction completed.",
    polling: (status) => `Extraction is ${status}...`,
    networkError: "Network error while polling result.",
    downloads: "Downloads",
    noMedia: "No media items returned.",
    warnings: "Warnings",
    needHelp: "Need help?",
    checkSolution: "Check solution guidance",
  },
  ar: {
    title: "نتيجة الاستخراج",
    jobIdLabel: "معرف المهمة",
    statusLabel: "الحالة",
    stateLabel: "الوضع",
    progressLabel: "التقدم",
    loading: "جارٍ تحميل النتيجة...",
    failedToLoad: "تعذر تحميل النتيجة.",
    completed: "اكتمل الاستخراج.",
    polling: (status) => `الاستخراج ${status}...`,
    networkError: "خطأ شبكة أثناء متابعة النتيجة.",
    downloads: "التنزيلات",
    noMedia: "لا توجد ملفات مرجعة.",
    warnings: "تنبيهات",
    needHelp: "هل تحتاج مساعدة؟",
    checkSolution: "راجع إرشادات الحل",
  },
};

export const solutionText: Record<Locale, SolutionDict> = {
  en: {
    loading: "Loading solution page...",
    title: "Solution",
    notFound: "Solution page not found.",
    networkError: "Network error while loading solution page.",
    heroSubtitle: "Practical recovery steps for extraction issues.",
    quickAnswer: "Quick Answer",
    quickFallback: "Please follow the steps below.",
    stepByStep: "Step-by-Step",
    trustSafety: "Trust / Safety",
    trustBody: "Use only public links and avoid sharing private account credentials.",
    internalLinks: "Internal Links",
  },
  ar: {
    loading: "جارٍ تحميل صفحة الحل...",
    title: "الحل",
    notFound: "لم يتم العثور على صفحة الحل.",
    networkError: "خطأ شبكة أثناء تحميل صفحة الحل.",
    heroSubtitle: "خطوات عملية لمعالجة مشاكل الاستخراج.",
    quickAnswer: "إجابة سريعة",
    quickFallback: "يرجى اتباع الخطوات أدناه.",
    stepByStep: "خطوة بخطوة",
    trustSafety: "الثقة / الأمان",
    trustBody: "استخدم الروابط العامة فقط وتجنب مشاركة بيانات الدخول الخاصة.",
    internalLinks: "روابط داخلية",
  },
};

export const degradedText: Record<Locale, DegradedDict> = {
  en: {
    title: 'Extractor is in degraded mode',
    body: 'Some extraction requests are temporarily limited.',
    reasonLabel: 'Reason',
    retryAfter: 'Suggested retry after',
    openGuide: 'Open recovery guide',
    reasons: {
      manual: 'Manual override',
      error_ratio: 'High upstream error ratio',
      queue_wait: 'Queue wait is too high',
      active_jobs: 'Too many active jobs',
      recovered: 'Recovered',
      none: 'Monitoring',
    },
  },
  ar: {
    title: 'أداة الاستخراج في وضع تقليل الأحمال',
    body: 'بعض طلبات الاستخراج محدودة مؤقتًا.',
    reasonLabel: 'السبب',
    retryAfter: 'أعد المحاولة بعد',
    openGuide: 'افتح دليل الاستعادة',
    reasons: {
      manual: 'تفعيل يدوي',
      error_ratio: 'ارتفاع معدل أخطاء المصدر',
      queue_wait: 'زمن الانتظار في الطابور مرتفع',
      active_jobs: 'عدد المهام النشطة مرتفع',
      recovered: 'تمت الاستعادة',
      none: 'تحت المراقبة',
    },
  },
};
