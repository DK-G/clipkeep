export type Locale = "en" | "ar" | "ja" | "es" | "pt" | "fr" | "id" | "hi" | "de" | "tr";

export type HomeDict = {
  title: string;
  subtitle: string;
  platformLabel: string;
  sourceUrlLabel: string;
  localeLabel: string;
  submit: string;
  submitting: string;
  status: string;
  initialMessage: string;
  creatingJob: string;
  degradedMessage: string;
  invalidRequest: string;
  networkError: string;
  helpPage: string;
  supportedTools: string;
  telegramTitle: string;
  telegramDesc: string;
  twitterTitle: string;
  twitterDesc: string;
  tiktokTitle: string;
  tiktokDesc: string;
  globalTrending: string;
  globalTrendingSubtitle: string;
  demoButton: string;
  successRateTikTok: string;
  successRateX: string;
  instagramMaintenanceAlternative: string;
  redditTitle: string;
  redditDesc: string;
  pinterestTitle: string;
  pinterestDesc: string;
  threadsTitle: string;
  threadsDesc: string;
  blueskyTitle: string;
  blueskyDesc: string;
  lemon8Title: string;
  lemon8Desc: string;
  bilibiliTitle: string;
  bilibiliDesc: string;
  discordTitle: string;
  discordDesc: string;
  facebookTitle: string;
  facebookDesc: string;
  historyTitle: string;
  clearHistory: string;
};

export type ResultDict = {
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
  errorTitle: string;
  backToHome: string;
  statusTitle: string;
  states: Record<string, string>;
  mediaTitle: string;
  download: string;
  loadingTitle: string;
  loadingSubtitle: string;
  backToDownloader: string;
  successSubtitle: string;
  downloadDescription: string;
  unknownAuthor: string;
  warningsTitle: string;
  recommendedClips: string;
  sourcePost: string;
  readyToDownload: string;
  preparingDownload: string;
  nextActionAnother: string;
  nextActionPaste: string;
};

export type SolutionDict = {
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
  errorTitle: string;
  backToHome: string;
  getStarted: string;
};

export type DegradedDict = {
  title: string;
  body: string;
  reasonLabel: string;
  retryAfter: string;
  openGuide: string;
  reasons: Record<string, string>;
};

export type StatusDict = {
  title: string;
  liveHealth: string;
  currentTitle: string;
  currentBody: string;
  incidentTitle: string;
  partialDegradation: { title: string; body: string; nextUpdate: string };
  scheduledMaintenance: { title: string; body: string; window: string };
  majorOutage: { title: string; body: string; nextUpdate: string };
};

export type FooterDict = {
  about: string;
  faq: string;
  terms: string;
  privacy: string;
  cookies: string;
  dmca: string;
  contact: string;
  status: string;
  adsDisclaimer: string;
};

export type MenuDict = {
  downloads: string;
  rankings: string;
  latest: string;
  viewAllTrending: string;
  latestPageSubtitle?: string;
  loadingLabel?: string;
  language: string;
  more: string;
  bilibili: string;
  bluesky: string;
  discord: string;
  lemon8: string;
  pinterest: string;
  reddit: string;
  telegram: string;
  threads: string;
  tiktok: string;
  twitter: string;
  facebook: string;
  about: string;
  faq: string;
  privacy: string;
  contact: string;
  globalHub: string;
  globalTrend: string;
};

export type PlatformPageDict = {
  title: string;
  subtitle: string;
  statusLabel: string;
  helpPage: string;
  howToTitle: string;
  howToSteps: string[];
  whyTitle: string;
  whyBody: string;
  whyPoints: string[];
  faqTitle: string;
  faqItems: Array<{ q: string; a: string }>;
  galleryTitle: string;
  trendingTitle?: string;
  note?: string;
  noteBody?: string;
  seoContent?: string;
};

export type GalleryPageDict = {
  title: string;
  subtitle: string;
  description: string;
  seoContent?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQDict = {
  title: string;
  lastUpdated: string;
  items: FAQItem[];
  stillQuestions: string;
  contactSupport: string;
  contactText: string;
};

export type LegalSection = {
  title: string;
  content: string;
};

export type LegalPageDict = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export type AboutDict = {
  title: string;
  body: string;
  visionTitle: string;
  visionBody: string;
  whyUsTitle: string;
  whyUsBody: string;
  projectNote: string;
};

export type ContactDict = {
  title: string;
  subtitle: string;
  emailLabel: string;
  dmcaTitle: string;
  dmcaBody: string;
  socialTitle: string;
  socialBody: string;
  comingSoon: string;
};

export type GalleryRangeDict = {
  trendingTodaySubtitle: string;
  trendingWeekSubtitle: string;
  trendingMonthSubtitle: string;
  latestTodaySubtitle: string;
  latestWeekSubtitle: string;
  latestMonthSubtitle: string;
};

