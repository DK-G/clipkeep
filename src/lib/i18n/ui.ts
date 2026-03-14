export type Locale = "en" | "ar" | "ja";

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value === "ja") return "ja";
  if (value === "ar") return "ar";
  return "en";
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
  localeJa: string;
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
  errorTitle: string;
  backToHome: string;
  statusTitle: string;
  states: Record<string, string>;
  mediaTitle: string;
  download: string;
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
  errorTitle: string;
  backToHome: string;
  getStarted: string;
};

type DegradedDict = {
  title: string;
  body: string;
  reasonLabel: string;
  retryAfter: string;
  openGuide: string;
  reasons: Record<string, string>;
};

type StatusDict = {
  title: string;
  liveHealth: string;
  currentTitle: string;
  currentBody: string;
  incidentTitle: string;
  partialDegradation: { title: string; body: string; nextUpdate: string };
  scheduledMaintenance: { title: string; body: string; window: string };
  majorOutage: { title: string; body: string; nextUpdate: string };
};

type FooterDict = {
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

type PlatformPageDict = {
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
  note?: string;
  noteBody?: string;
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
    localeJa: "Japanese",
    submit: "Start Extract",
    submitting: "Submitting...",
    status: "Status",
    initialMessage: "Paste a Telegram/X post URL and start extraction.",
    creatingJob: "Creating extraction job...",
    degradedMessage: "Extractor is temporarily limited. Please check solution guidance.",
    invalidRequest: "Request failed. Check URL/platform and try again.",
    networkError: "Network error while creating job.",
    helpPage: "Help page",
    supportedTools: "Supported Tools",
    telegramTitle: "Telegram Downloader",
    telegramDesc: "Save videos and media from Telegram channels and groups.",
    twitterTitle: "Twitter (X) Downloader",
    twitterDesc: "Archive videos and GIFs from X/Twitter posts instantly.",
    tiktokTitle: "TikTok Downloader",
    tiktokDesc: "Download TikTok videos and images for offline archiving."
  },
  ar: {
    title: "أداة ClipKeep",
    subtitle: "النسخة الأولية: تيليجرام أولًا ثم X/تويتر. تيك توك لاحقًا.",
    platformLabel: "المنصة",
    sourceUrlLabel: "رابط المصدر",
    localeLabel: "اللغة",
    localeEn: "الإنجليزية",
    localeAr: "العربية (RTL)",
    localeJa: "اليابانية",
    submit: "ابدأ الاستخراج",
    submitting: "جارٍ الإرسال...",
    status: "الحالة",
    initialMessage: "ألصق رابط منشور تيليجرام/X وابدأ الاستخراج.",
    creatingJob: "جارٍ إنشاء مهمة الاستخراج...",
    degradedMessage: "الخدمة محدودة مؤقتًا. راجع صفحة الحلول.",
    invalidRequest: "فشل الطلب. تحقق من الرابط/المنصة ثم أعد المحاولة.",
    networkError: "خطأ شبكة أثناء إنشاء المهمة.",
    helpPage: "صفحة المساعدة",
    supportedTools: "الأدوات المدعومة",
    telegramTitle: "محمل فيديوهات تيليجرام",
    telegramDesc: "احفظ الفيديوهات والوسائط من قنوات ومجموعات تيليجرام.",
    twitterTitle: "محمل فيديوهات تويتر (X)",
    twitterDesc: "أرشف الفيديوهات والصور المتحركة من منشورات X/تويتر فوراً.",
    tiktokTitle: "محمل فيديوهات تيك توك",
    tiktokDesc: "قم بتنزيل فيديوهات وصور تيك توك للأرشفة في وضع عدم الاتصال."
  },
  ja: {
    title: "ClipKeep 多機能ダウンローダー",
    subtitle: "TelegramとX/Twitterの動画を簡単に保存。TikTokも対応予定。",
    platformLabel: "プラットフォーム",
    sourceUrlLabel: "動画URL",
    localeLabel: "言語",
    localeEn: "英語",
    localeAr: "アラビア語",
    localeJa: "日本語",
    submit: "抽出を開始",
    submitting: "送信中...",
    status: "ステータス",
    initialMessage: "TelegramまたはXの投稿URLを貼り付けて開始してください。",
    creatingJob: "抽出ジョブを作成中...",
    degradedMessage: "現在抽出機能が制限されています。解決ガイドを確認してください。",
    invalidRequest: "リクエストに失敗しました。URLとプラットフォームを確認してください。",
    networkError: "ネットワークエラーが発生しました。",
    helpPage: "ヘルプページ",
    supportedTools: "対応ツール",
    telegramTitle: "Telegram ダウンローダー",
    telegramDesc: "Telegramのチャンネルやグループから動画やメディアを保存します。",
    twitterTitle: "Twitter (X) ダウンローダー",
    twitterDesc: "X/Twitterの投稿から動画やGIFを瞬時にアーカイブします。",
    tiktokTitle: "TikTok ダウンローダー",
    tiktokDesc: "オフライン保存用にTikTokの動画や画像をダウンロードします。"
  },
};

export const telegramText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Telegram Video Downloader",
    subtitle: "Download videos, files, and media from Telegram channels and groups quickly and securely.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Download Telegram Videos",
    howToSteps: [
      "Copy the Telegram Link: Open Telegram, right-click (or long-press) on the video or post, and select \"Copy Post Link\".",
      "Paste the Link: Paste the copied URL into the input field above.",
      "Start Extraction: Click the \"Submit\" button. ClipKeep will process the Telegram link.",
      "Save to Device: Click the resulting download button to save the media."
    ],
    whyTitle: "Why use ClipKeep for Telegram?",
    whyBody: "Telegram is a powerful platform for sharing media, but downloading directly can sometimes be slow. ClipKeep bridges the connection for stable extraction.",
    whyPoints: [
      "Privacy Minded: We do not log your download history.",
      "No Registration Required: Start downloading immediately.",
      "Platform Compatibility: Works on Windows, macOS, Android, and iOS."
    ],
    faqTitle: "Frequently Asked Questions",
    faqItems: [
      { q: "Can I download from private channels?", a: "ClipKeep supports public links. Private content is restricted by Telegram's auth policies." },
      { q: "Is there a file size limit?", a: "We support common sizes. 2GB+ files may experience timeouts." }
    ]
  },
  ar: {
    title: "محمل فيديوهات تيليجرام",
    subtitle: "قم بتنزيل مقاطع الفيديو والملفات والوسائط من قنوات ومجموعات تيليجرام بسرعة وأمان.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية تنزيل فيديوهات تيليجرام",
    howToSteps: [
      "انسخ رابط تيليجرام: افتح تيليجرام، انقر بزر الماوس الأيمن (أو اضغط مطولًا) على الفيديو أو المنشور، واختر \"نسخ رابط المنشور\".",
      "الصق الرابط: الصق الرابط المنسوخ في حقل الإدخال أعلاه.",
      "ابدأ الاستخراج: انقر على زر \"إرسال\". سيقوم ClipKeep بمعالجة الرابط.",
      "احفظ في الجهاز: انقر على زر التنزيل الناتج لحفظ الوسائط."
    ],
    whyTitle: "لماذا تستخدم ClipKeep لتيليجرام؟",
    whyBody: "تيليجرام منصة قوية لمشاركة الوسائط، لكن التنزيل المباشر قد يكون بطيئًا أحيانًا. يوفر ClipKeep جسرًا لاتصال مستقر لاستخراج الوسائط.",
    whyPoints: [
      "الخصوصية أولًا: نحن لا نسجل تاريخ تنزيلاتك.",
      "لا يلزم التسجيل: ابدأ التنزيل فوراً دون الحاجة لإنشاء حساب.",
      "توافق المنصات: يعمل على ويندوز، ماك، أندرويد، وiOS."
    ],
    faqTitle: "الأسئلة الشائعة",
    faqItems: [
      { q: "هل يمكنني التنزيل من القنوات الخاصة؟", a: "يدعم ClipKeep الروابط العامة فقط. الوصول للمحتوى الخاص محمي بسياسات توثيق تيليجرام." },
      { q: "هل هناك حد لحجم الملفات؟", a: "ندعم معظم الأحجام الشائعة. الملفات الضخمة جدًا (أكثر من 2 جيجابايت) قد تواجه مهلة زمنية." }
    ]
  },
  ja: {
    title: "Telegram 動画ダウンローダー",
    subtitle: "Telegramの動画やメディアを、素早く安全にデバイスへ保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Telegram動画の保存方法",
    howToSteps: [
      "リンクをコピー: Telegramで動画や投稿を長押し（または右クリック）し、「投稿リンクをコピー」を選択します。",
      "リンクを貼り付け: コピーしたURLを上記の入力フィールドに貼り付けます。",
      "抽出を開始: 「抽出を開始」ボタンをクリックすると、ClipKeepが処理を開始します。",
      "保存して完了: 抽出完了後、ダウンロードボタンからメディアを保存します。"
    ],
    whyTitle: "なぜClipKeepを選ぶのか？",
    whyBody: "Telegramの動画保存は公式アプリでは時間がかかることがありますが、ClipKeepは高速かつ安定した接続を提供します。",
    whyPoints: [
      "プライバシー重視: ユーザーのダウンロード履歴は一切記録しません。",
      "会員登録不要: アカウント作成なしで、今すぐダウンロードを開始できます。",
      "マルチデバイス対応: Windows、Mac、Android、iOSの全てで動作します。"
    ],
    faqTitle: "よくある質問",
    faqItems: [
      { q: "プライベートチャネルからダウンロードできますか？", a: "ClipKeepは公開リンクのみ対応しています。鍵付きのチャネルは対応外です。" },
      { q: "ファイルサイズに制限はありますか？", a: "一般的なサイズに対応していますが、2GBを超えるファイルはタイムアウトの可能性があります。" }
    ]
  }
};

export const twitterText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Twitter (X) Video Downloader",
    subtitle: "The fastest way to archive videos and GIFs from X/Twitter directly to your device.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Twitter Videos",
    howToSteps: [
      "Find the Post: Navigate to the X/Twitter post containing the video or GIF.",
      "Copy the Link: Click the share icon and select \"Copy Link\".",
      "Extract with ClipKeep: Paste the URL above and click \"Submit\".",
      "Download: Once processed, click the download button."
    ],
    whyTitle: "Benefits of using ClipKeep for X",
    whyBody: "Archiving media from X (formerly Twitter) is essential for curators and journalists. ClipKeep provides a clean experience focused on speed.",
    whyPoints: [
      "Support for GIFs & Videos: Extract any media type hosted on X posts.",
      "Fast Handshake: Cloudflare-powered backend ensures minimal latency.",
      "Secure Extraction: We do not require account access or cookies."
    ],
    faqTitle: "Common Questions",
    faqItems: [
      { q: "Can I download private tweets?", a: "No. ClipKeep only supports public media extraction." },
      { q: "What quality will the video be?", a: "ClipKeep extracts the highest available bitrate provided by the platform." }
    ]
  },
  ar: {
    title: "محمل فيديوهات تويتر (X)",
    subtitle: "أسرع طريقة لأرشفة مقاطع الفيديو والصور المتحركة (GIF) من X/تويتر مباشرة إلى جهازك.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ فيديوهات تويتر",
    howToSteps: [
      "ابحث عن المنشور: انتقل إلى منشور X/تويتر الذي يحتوي على الفيديو أو الصورة المتحركة.",
      "انسخ الرابط: انقر على أيقونة المشاركة واختر \"نسخ الرابط\".",
      "استخرج مع ClipKeep: الصق الرابط أعلاه وانقر على \"إرسال\".",
      "التنزيل: بمجرد المعالجة، انقر على زر التنزيل."
    ],
    whyTitle: "فوائد استخدام ClipKeep لـ X",
    whyBody: "أرشفة الوسائط من X (تويتر سابقًا) ضرورية للمنسقين والصحفيين. يوفر ClipKeep تجربة نظيفة تركز على السرعة.",
    whyPoints: [
      "دعم الصور المتحركة والفيديو: استخرج أي نوع وسائط مستضاف على منشورات X.",
      "استجابة سريعة: تضمن الواجهة الخلفية المدعومة بـ Cloudflare أقل تأخير ممكن.",
      "استخراج آمن: نحن لا نطلب الوصول إلى الحساب أو ملفات تعريف الارتباط."
    ],
    faqTitle: "الأسئلة الشائعة",
    faqItems: [
      { q: "هل يمكنني تنزيل التغريدات الخاصة؟", a: "لا. يدعم ClipKeep استخراج الوسائط العامة فقط." },
      { q: "ما هي جودة الفيديو؟", a: "يستخرِج ClipKeep أعلى معدل بث متاح توفره المنصة." }
    ]
  },
  ja: {
    title: "Twitter (X) 動画ダウンローダー",
    subtitle: "X/Twitterの動画やGIFを最速でデバイスにアーカイブします。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Twitter動画の保存方法",
    howToSteps: [
      "投稿を探す: 動画やGIFが含まれるX/Twitterの投稿に移動します。",
      "リンクをコピー: 共有アイコンをクリックし、「リンクをコピー」を選択します。",
      "ClipKeepで抽出: 上記のフォームにURLを貼り付け、「抽出を開始」をクリックします。",
      "ダウンロード: 処理が完了したら、ダウンロードボタンから保存します。"
    ],
    whyTitle: "ClipKeepを使うメリット",
    whyBody: "Xのメディア保存はクリエイターやジャーナリストにとって重要です。ClipKeepはスピードに特化したクリーンな体験を提供します。",
    whyPoints: [
      "動画とGIFに対応: Xに投稿されたあらゆるメディア形式を抽出可能です。",
      "高速な処理: Cloudflareを活用したバックエンドにより、遅延を最小限に抑えます。",
      "安全な接続: アカウント情報やパスワードの入力は一切不要です。"
    ],
    faqTitle: "よくある質問",
    faqItems: [
      { q: "鍵垢（非公開投稿）からダウンロードできますか？", a: "いいえ。ClipKeepは公開されているメディアのみ対応しています。" },
      { q: "動画の画質はどうなりますか？", a: "ClipKeepはプラットフォームが提供する最高画質のリンクを抽出します。" }
    ]
  }
};

export const tiktokText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "TikTok Media Downloader",
    subtitle: "Efficiently archive your favorite TikTok moments for offline viewing and content curation.",
    statusLabel: "Status",
    helpPage: "Help Page",
    note: "Note: Early Access",
    noteBody: "TikTok extraction is currently in limited early access. Some features may be restricted.",
    howToTitle: "How to Download TikTok Content",
    howToSteps: [
      "Get the TikTok URL: Open TikTok, find the video, and click 'Copy Link'.",
      "Paste into ClipKeep: Use the form above to paste your link.",
      "Process & Save: Our system will provide a direct media path for saving."
    ],
    whyTitle: "Professional Media Archiving",
    whyBody: "For digital marketers, maintaining an archive of trending TikTok content is vital. ClipKeep offers a streamlined workflow.",
    whyPoints: [],
    faqTitle: "TikTok FAQ",
    faqItems: [
      { q: "Is watermarking removed?", a: "We aim for the most direct path, which often means no overlays." },
      { q: "Can I download TikTok slideshows?", a: "Slideshow support is currently limited." }
    ]
  },
  ar: {
    title: "محمل وسائط تيك توك",
    subtitle: "أرشفة لحظات تيك توك المفضلة لديك بكفاءة للمشاهدة دون اتصال بالإنترنت وتنسيق المحتوى.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    note: "ملاحظة: وصول مبكر",
    noteBody: "استخراج تيك توك حاليًا في مرحلة الوصول المبكر المحدود. قد تكون بعض الميزات مقيدة.",
    howToTitle: "كيفية تنزيل محتوى تيك توك",
    howToSteps: [
      "احصل على رابط تيك توك: افتح تطبيق أو موقع تيك توك، ابحث عن الفيديو، وانقر على 'نسخ الرابط'.",
      "الصق في ClipKeep: استخدم النموذج أعلاه للصق الرابط الخاص بك.",
      "المعالجة والحفظ: سيوفر نظامنا مسارًا مباشرًا للوسائط لحفظها."
    ],
    whyTitle: "أرشفة الوسائط الاحترافية",
    whyBody: "للمسوقين الرقميين، الحفاظ على أرشيف لمحتوى تيك توك الرائج أمر حيوي. يوفر ClipKeep سير عمل مبسطاً.",
    whyPoints: [],
    faqTitle: "الأسئلة الشائعة حول تيك توك",
    faqItems: [
      { q: "هل يتم إزالة العلامة المائية؟", a: "نهدف لتوفير المسار الأكثر مباشرة، مما يعني غالبًا عدم وجود إضافات." },
      { q: "هل يمكنني تنزيل عروض شرائح تيك توك؟", a: "دعم عروض الشرائح محدود حاليًا." }
    ]
  },
  ja: {
    title: "TikTok メディアダウンローダー",
    subtitle: "オフライン視聴やコンテンツ制作のために、お気に入りのTikTokを効率的に保存。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    note: "注意: 早期アクセス",
    noteBody: "TikTok抽出機能は現在テスト運用中です。一部の機能が制限される場合があります。",
    howToTitle: "TikTokのダウンロード方法",
    howToSteps: [
      "動画ページへ移動: TikTokアプリまたはサイトで、保存したい動画の「リンクをコピー」をクリックします。",
      "ClipKeepに貼り付け: 上記のフォームにURLを貼り付けます。",
      "保存して完了: 処理が完了すると、動画の保存リンクが表示されます。"
    ],
    whyTitle: "プロフェッショナルな保存環境",
    whyBody: "マーケターやクリエイターにとって、トレンドをアーカイブすることは重要です。ClipKeepはそれをシンプルにします。",
    whyPoints: [],
    faqTitle: "よくある質問",
    faqItems: [
      { q: "透かし（ロゴ）は除去されますか？", a: "可能な限りオリジナルの動画を取得するため、多くの場合ロゴなしでの保存が可能です。" },
      { q: "スライドショーはダウンロードできますか？", a: "スライドショー形式は現在一部制限があります。" }
    ]
  }
};

export const footerText: Record<Locale, FooterDict> = {
  en: {
    about: "About",
    faq: "FAQ",
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
    dmca: "DMCA",
    contact: "Contact",
    status: "Status",
    adsDisclaimer: "Ads, when enabled, are labeled as sponsored content."
  },
  ar: {
    about: "من نحن",
    faq: "الأسئلة الشائعة",
    terms: "الشروط",
    privacy: "الخصوصية",
    cookies: "ملفات التعريف",
    dmca: "حقوق النشر",
    contact: "اتصل بنا",
    status: "الحالة",
    adsDisclaimer: "الإعلانات، عند تمكينها، يتم تصنيفها كمحتوى ممول."
  },
  ja: {
    about: "このサイトについて",
    faq: "よくある質問",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    cookies: "Cookie設定",
    dmca: "著作権報告",
    contact: "お問い合わせ",
    status: "サービス状況",
    adsDisclaimer: "広告が表示される場合は、スポンサーコンテンツとして識別されます。"
  }
};

export const statusText: Record<Locale, StatusDict> = {
  en: {
    title: "Service Status",
    liveHealth: "Live API health",
    currentTitle: "Current",
    currentBody: "All core services are operating normally.",
    incidentTitle: "Incident Templates",
    partialDegradation: {
      title: "Partial Degradation",
      body: "We are experiencing elevated failures in extraction requests. Some requests may return temporary limits. We are actively mitigating this issue.",
      nextUpdate: "Next update: within 30 minutes."
    },
    scheduledMaintenance: {
      title: "Scheduled Maintenance",
      body: "Scheduled maintenance is in progress. Extraction and API response times may be temporarily affected.",
      window: "Planned window: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Major Outage",
      body: "We are currently experiencing a major outage affecting core extraction functionality. Our team is investigating and recovery actions are underway.",
      nextUpdate: "Next update: within 15 minutes."
    }
  },
  ar: {
    title: "حالة الخدمة",
    liveHealth: "حالة الـ API المباشرة",
    currentTitle: "الحالي",
    currentBody: "جميع الخدمات الأساسية تعمل بشكل طبيعي.",
    incidentTitle: "نماذج الحوادث",
    partialDegradation: {
      title: "تدهور جزئي",
      body: "نواجه حالات فشل متزايدة في طلبات الاستخراج. قد ترجع بعض الطلبات حدوداً مؤقتة. نحن نعمل بنشاط على معالجة هذه المشكلة.",
      nextUpdate: "التحديث القادم: خلال 30 دقيقة."
    },
    scheduledMaintenance: {
      title: "صيانة مجدولة",
      body: "هناك صيانة مجدولة قيد التنفيذ. قد تتأثر أوقات الاستجابة والاستخراج مؤقتاً.",
      window: "النافذة المخطط لها: 00:00-01:00 بالتوقيت العالمي."
    },
    majorOutage: {
      title: "عطل كبير",
      body: "نواجه حالياً عطلاً كبيراً يؤثر على وظائف الاستخراج الأساسية. فريقنا يحقق في الأمر وإجراءات الاستعادة جارية.",
      nextUpdate: "التحديث القادم: خلال 15 دقيقة."
    }
  },
  ja: {
    title: "稼働状況",
    liveHealth: "APIの正常性",
    currentTitle: "現在",
    currentBody: "全ての主要サービスは正常に動作しています。",
    incidentTitle: "過去のインシデント",
    partialDegradation: {
      title: "一部機能制限",
      body: "現在、メディアの抽出リクエストで断続的なエラーが発生しています。エンジニアが調査および修正を行っています。",
      nextUpdate: "次回の更新：30分以内"
    },
    scheduledMaintenance: {
      title: "定期メンテナンス",
      body: "現在サービス向上のため定期メンテナンスを行っています。一部の機能に影響が出る場合があります。",
      window: "予定時間：00:00-01:00 UTC"
    },
    majorOutage: {
      title: "重大な障害",
      body: "現在システム全体に及ぶ重大な障害が発生しています。復旧に向けて全力で作業中です。",
      nextUpdate: "次回の更新：15分以内"
    }
  }
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
    errorTitle: "Something went wrong",
    backToHome: "Back to Home",
    statusTitle: "Status",
    states: {
      queued: "Queued",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
    },
    mediaTitle: "Media Ready",
    download: "Download",
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
    errorTitle: "حدث خطأ ما",
    backToHome: "العودة للرئيسية",
    statusTitle: "الحالة",
    states: {
      queued: "في الانتظار",
      processing: "جار المعالجة",
      completed: "مكتمل",
      failed: "فشل",
    },
    mediaTitle: "الملفات جاهزة",
    download: "تحميل",
  },
  ja: {
    title: "抽出結果",
    jobIdLabel: "ジョブID",
    statusLabel: "ステータス",
    stateLabel: "状態",
    progressLabel: "進捗",
    loading: "読み込み中...",
    failedToLoad: "読み込みに失敗しました。",
    completed: "抽出が完了しました。",
    polling: (status) => `${status}中...`,
    networkError: "ステータス確認中にエラーが発生しました。",
    downloads: "保存リンク",
    noMedia: "メディアが見つかりませんでした。",
    warnings: "警告",
    needHelp: "お困りですか？",
    checkSolution: "解決ガイドを確認",
    errorTitle: "エラーが発生しました",
    backToHome: "ホームへ戻る",
    statusTitle: "状況",
    states: {
      queued: "待機中",
      processing: "処理中",
      completed: "完了",
      failed: "失敗",
    },
    mediaTitle: "保存準備完了",
    download: "ダウンロード",
  }
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
    errorTitle: "Page Not Found",
    backToHome: "Back to Home",
    getStarted: "Get Started",
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
    errorTitle: "الصفحة غير موجودة",
    backToHome: "العودة للرئيسية",
    getStarted: "ابدأ الآن",
  },
  ja: {
    loading: "読み込み中...",
    title: "解決ガイド",
    notFound: "ページが見つかりませんでした。",
    networkError: "接続エラーが発生しました。",
    heroSubtitle: "抽出エラーの具体的な対処方法です。",
    quickAnswer: "クイックアンサー",
    quickFallback: "以下の手順に従って解決をお試しください。",
    stepByStep: "ステップガイド",
    trustSafety: "安全性について",
    trustBody: "ClipKeepでは公開URLのみを使用し、アカウントのPW等を求めることはありません。",
    internalLinks: "関連リンク",
    errorTitle: "404 Not Found",
    backToHome: "ホームへ戻る",
    getStarted: "今すぐ試す",
  }
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
  ja: {
    title: 'サービス制限モード',
    body: '現在一部のリクエストが制限されています。',
    reasonLabel: '理由',
    retryAfter: '推奨される再試行時間',
    openGuide: 'リカバリーガイドを開く',
    reasons: {
      manual: '手動オーバーライド',
      error_ratio: 'エラー率の上昇',
      queue_wait: '待機時間の超過',
      active_jobs: '同時処理数の上限',
      recovered: '復旧済み',
      none: '監視中',
    },
  },
};
