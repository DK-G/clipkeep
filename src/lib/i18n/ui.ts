export type Locale = "en" | "ar" | "ja" | "es" | "pt" | "fr" | "id" | "hi" | "de" | "tr";

export function normalizeLocale(value: string | null | undefined): Locale {
  const v = value?.toLowerCase();
  if (v === "ja") return "ja";
  if (v === "ar") return "ar";
  if (v === "es") return "es";
  if (v === "pt") return "pt";
  if (v === "fr") return "fr";
  if (v === "id") return "id";
  if (v === "hi") return "hi";
  if (v === "de") return "de";
  if (v === "tr") return "tr";
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

type MenuDict = {
  downloads: string;
  rankings: string;
  latest: string;
  language: string;
  more: string;
  twitter: string;
  tiktok: string;
  telegram: string;
  instagram: string;
  about: string;
  faq: string;
  privacy: string;
  contact: string;
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

export const homeText: Record<Locale, HomeDict> = {
  en: {
    title: "Video Downloader & Extractor",
    subtitle: "Download videos from Twitter (X), Telegram, and TikTok instantly.",
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
    title: "SNS動画ダウンローダー",
    subtitle: "X (Twitter)、Telegram、TikTokの動画を今すぐ保存。素早く安定したデータ抽出を提供。",
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
  es: {
    title: "ClipKeep Extractor",
    subtitle: "MVP: Telegram primero, luego X/Twitter. TikTok planeado próximamente.",
    platformLabel: "Plataforma",
    sourceUrlLabel: "URL de origen",
    localeLabel: "Idioma",
    localeEn: "Inglés",
    localeAr: "Árabe",
    localeJa: "Japonés",
    submit: "Iniciar extracción",
    submitting: "Enviando...",
    status: "Estado",
    initialMessage: "Pegue una URL de Telegram/X e inicie la extracción.",
    creatingJob: "Creando tarea de extracción...",
    degradedMessage: "El extractor está limitado temporalmente. Consulte la guía.",
    invalidRequest: "Error. Verifique la URL/plataforma e intente de nuevo.",
    networkError: "Error de red al crear la tarea.",
    helpPage: "Ayuda",
    supportedTools: "Herramientas soportadas",
    telegramTitle: "Descargador de Telegram",
    telegramDesc: "Guarde videos y archivos de canales y grupos de Telegram.",
    twitterTitle: "Descargador de Twitter (X)",
    twitterDesc: "Archive videos y GIFs de X/Twitter al instante.",
    tiktokTitle: "Descargador de TikTok",
    tiktokDesc: "Descargue videos de TikTok para verlos sin conexión."
  },
  pt: {
    title: "ClipKeep Extractor",
    subtitle: "MVP: Telegram primeiro, depois X/Twitter. TikTok planejado.",
    platformLabel: "Plataforma",
    sourceUrlLabel: "URL de origem",
    localeLabel: "Idioma",
    localeEn: "Inglês",
    localeAr: "Árabe",
    localeJa: "Japonês",
    submit: "Iniciar extração",
    submitting: "Enviando...",
    status: "Status",
    initialMessage: "Cole uma URL do Telegram/X e inicie a extração.",
    creatingJob: "Criando tarefa de extração...",
    degradedMessage: "Extrator temporariamente limitado. Verifique a solução.",
    invalidRequest: "Falha na solicitação. Verifique URL/plataforma.",
    networkError: "Erro de rede ao criar tarefa.",
    helpPage: "Ajuda",
    supportedTools: "Ferramentas suportadas",
    telegramTitle: "Downloader do Telegram",
    telegramDesc: "Salve vídeos e mídia de canais e grupos do Telegram.",
    twitterTitle: "Downloader do Twitter (X)",
    twitterDesc: "Arquive vídeos e GIFs do X/Twitter instantaneamente.",
    tiktokTitle: "Downloader do TikTok",
    tiktokDesc: "Baixe vídeos do TikTok para visualização offline."
  },
  fr: {
    title: "ClipKeep Extractor",
    subtitle: "MVP : Telegram d'abord, puis X/Twitter. TikTok prévu plus tard.",
    platformLabel: "Plateforme",
    sourceUrlLabel: "URL source",
    localeLabel: "Langue",
    localeEn: "Anglais",
    localeAr: "Arabe",
    localeJa: "Japonais",
    submit: "Démarrer l'extraction",
    submitting: "Envoi...",
    status: "État",
    initialMessage: "Collez une URL Telegram/X et démarrez l'extraction.",
    creatingJob: "Création de la tâche d'extraction...",
    degradedMessage: "L'extracteur est temporairement limité. Consultez l'aide.",
    invalidRequest: "Échec. Vérifiez l'URL/plateforme et réessayez.",
    networkError: "Erreur réseau lors de la création de la tâche.",
    helpPage: "Aide",
    supportedTools: "Outils pris en charge",
    telegramTitle: "Téléchargeur Telegram",
    telegramDesc: "Enregistrez des vidéos de canaux et groupes Telegram.",
    twitterTitle: "Téléchargeur Twitter (X)",
    twitterDesc: "Archivez instantanément des vidéos et GIFs de X/Twitter.",
    tiktokTitle: "Téléchargeur TikTok",
    tiktokDesc: "Téléchargez des vidéos TikTok pour une lecture hors ligne."
  },
  id: {
    title: "ClipKeep Extractor",
    subtitle: "MVP: Telegram dulu, lalu X/Twitter. TikTok direncanakan nanti.",
    platformLabel: "Platform",
    sourceUrlLabel: "URL Sumber",
    localeLabel: "Bahasa",
    localeEn: "Inggris",
    localeAr: "Arab",
    localeJa: "Jepang",
    submit: "Mulai Ekstrak",
    submitting: "Mengirim...",
    status: "Status",
    initialMessage: "Tempel URL Telegram/X dan mulai ekstraksi.",
    creatingJob: "Membuat tugas ekstraksi...",
    degradedMessage: "Ekstraktor terbatas sementara. Periksa panduan solusi.",
    invalidRequest: "Permintaan gagal. Periksa URL/platform.",
    networkError: "Kesalahan jaringan saat membuat tugas.",
    helpPage: "Bantuan",
    supportedTools: "Alat yang didukung",
    telegramTitle: "Pengunduh Telegram",
    telegramDesc: "Simpan video dan media dari saluran dan grup Telegram.",
    twitterTitle: "Pengunduh Twitter (X)",
    twitterDesc: "Arsip video dan GIF dari postingan X/Twitter secara instan.",
    tiktokTitle: "Pengunduh TikTok",
    tiktokDesc: "Unduh video TikTok untuk arsip offline."
  },
  hi: {
    title: "ClipKeep एक्सट्रैक्टर",
    subtitle: "MVP: पहले टेलीग्राम, फिर X/ट्विटर। टिकटॉक बाद में।",
    platformLabel: "प्लेटफॉर्म",
    sourceUrlLabel: "स्रोत URL",
    localeLabel: "भाषा",
    localeEn: "अंग्रेज़ी",
    localeAr: "अरबी",
    localeJa: "जापानी",
    submit: "एक्सट्रैक्शन शुरू करें",
    submitting: "सबमिट हो रहा है...",
    status: "स्थिति",
    initialMessage: "टेलीग्राम/X पोस्ट URL पेस्ट करें और एक्सट्रैक्शन शुरू करें।",
    creatingJob: "एक्सट्रैक्शन कार्य बनाया जा रहा है...",
    degradedMessage: "एक्सट्रैक्टर अस्थायी रूप से सीमित है। समाधान मार्गदर्शिका देखें।",
    invalidRequest: "अनुरोध विफल। URL/प्लेटफॉर्म की जांच करें।",
    networkError: "कार्य बनाते समय नेटवर्क त्रुटि।",
    helpPage: "सहायता",
    supportedTools: "समर्थित उपकरण",
    telegramTitle: "टेलीग्राम डाउनलोडर",
    telegramDesc: "टेलीग्राम चैनलों और समूहों से वीडियो और मीडिया सहेजें।",
    twitterTitle: "ट्विटर (X) डाउनलोडर",
    twitterDesc: "X/ट्विटर पोस्ट से वीडियो और GIF तुरंत आर्काइव करें।",
    tiktokTitle: "टिकटॉक डाउनलोडर",
    tiktokDesc: "ऑफलाइन आर्काइविंग के लिए टिकटॉक वीडियो डाउनलोड करें।"
  },
  de: {
    title: "ClipKeep Extractor",
    subtitle: "MVP: Zuerst Telegram, dann X/Twitter. TikTok folgt später.",
    platformLabel: "Plattform",
    sourceUrlLabel: "Quell-URL",
    localeLabel: "Sprache",
    localeEn: "Englisch",
    localeAr: "Arabisch",
    localeJa: "Japanisch",
    submit: "Extraktion starten",
    submitting: "Senden...",
    status: "Status",
    initialMessage: "Telegram/X URL einfügen und Extraktion starten.",
    creatingJob: "Aufgabe wird erstellt...",
    degradedMessage: "Eingeschränkt. Bitte Lösungshinweise prüfen.",
    invalidRequest: "Fehlgeschlagen. URL/Plattform prüfen.",
    networkError: "Netzwerkfehler beim Erstellen der Aufgabe.",
    helpPage: "Hilfe",
    supportedTools: "Unterstützte Tools",
    telegramTitle: "Telegram Downloader",
    telegramDesc: "Speichern Sie Videos von Telegram-Kanälen.",
    twitterTitle: "Twitter (X) Downloader",
    twitterDesc: "Archivieren Sie Videos von X/Twitter sofort.",
    tiktokTitle: "TikTok Downloader",
    tiktokDesc: "Videos für die Offline-Ansicht herunterladen."
  },
  tr: {
    title: "ClipKeep Ayıklayıcı",
    subtitle: "MVP: Önce Telegram, sonra X/Twitter. TikTok yakında.",
    platformLabel: "Platform",
    sourceUrlLabel: "Kaynak URL",
    localeLabel: "Dil",
    localeEn: "İngilizce",
    localeAr: "Arapça",
    localeJa: "Japonca",
    submit: "Ayıklamayı Başlat",
    submitting: "Gönderiliyor...",
    status: "Durum",
    initialMessage: "Telegram/X URL yapıştırın ve ayıklayıcıyı başlatın.",
    creatingJob: "Ayıklama görevi oluşturuluyor...",
    degradedMessage: "Ayıklayıcı geçici olarak sınırlı. Kılavuza bakın.",
    invalidRequest: "İstek başarısız. URL/platformu kontrol edin.",
    networkError: "Görev oluşturulurken ağ hatası oluştu.",
    helpPage: "Yardım",
    supportedTools: "Desteklenen Araçlar",
    telegramTitle: "Telegram İndirici",
    telegramDesc: "Telegram kanallarından videoları kaydedin.",
    twitterTitle: "Twitter (X) İndirici",
    twitterDesc: "Postlardan videoları anında arşivleyin.",
    tiktokTitle: "TikTok İndirici",
    tiktokDesc: "TikTok videolarını çevrimdışı arşivleyin."
  }
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
    ],
    galleryTitle: "Recently Processed Telegram Videos",
    trendingTitle: "Trending Telegram Videos (Weekly)",
    seoContent: "ClipKeep's Telegram Video Downloader is the ultimate tool for archiving media from one of the world's most popular messaging platforms. As Telegram channels and groups become secondary news hubs and content repositories, the need for a reliable extraction tool has never been greater. Our service allows you to save videos, documentaries, and large media files directly from public Telegram posts with just a single click.\n\nTelegram's architecture can sometimes make direct downloads slow or interrupted. ClipKeep solves this by acting as a high-speed bridge, ensuring that you get the most stable connection possible. We support various formats and aim to preserve the original quality of the file. Whether you are following a niche educational channel or a tech community group, ClipKeep ensures that the knowledge and entertainment shared there are always accessible to you, even without an internet connection.\n\nSecurity and privacy are at our core. Unlike many other tools, ClipKeep does not require you to link your Telegram account or provide any personal data. We operate purely on public links, respecting the native privacy settings of the platform. Combine this with our lightning-fast processing and mobile-first design, and you have the most practical solution for Telegram media management available today."
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
    ],
    galleryTitle: "فيديوهات تيليجرام التي تمت معالجتها مؤخراً",
    trendingTitle: "فيديوهات تيليجرام الرائجة (أسبوعياً)"
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
    ],
    galleryTitle: "最近抽出されたTelegram動画",
    trendingTitle: "週間トレンド・Telegram動画",
    seoContent: "ClipKeepのTelegram動画ダウンロードツールは、世界で最も人気のあるメッセージングプラットフォームの一つであるTelegramからメディアをアーカイブするための究極のツールです。Telegramのチャンネルやグループがニュース配信やコンテンツの保管場所として機能する中、信頼できる抽出ツールの重要性はかつてないほど高まっています。当サイトでは、公開されているTelegramの投稿から動画、ドキュメンタリー、そして大容量のメディアファイルを、ワンクリックで直接保存することが可能です。\n\nTelegramの構造上、直接のダウンロードが遅くなったり中断されたりすることがありますが、ClipKeepは高速なブリッジとして機能し、可能な限り安定した接続を確保します。私たちは様々なフォーマットをサポートし、ファイルの元の品質を維持することを目指しています。教育的なチャンネルから技術コミュニティのグループまで、ClipKeepを使えば、そこで共有される知識やエンターテインメントを、インターネット接続がない環境でもいつでも楽しむことができます。\n\nセキュリティとプライバシーは、当サイトの核となる価値観です。他の多くのツールとは異なり、ClipKeepはユーザーにTelegramアカウントの連携や個人情報の提供を求めることはありません。公開リンクのみで動作し、プラットフォームのネイティブなプライバシー設定を尊重します。この安全性と、モバイルファーストの設計、そして超高速な処理能力を組み合わせることで、Telegramメディア管理における最も実用的なソリューションを提供します。"
  },
  es: {
    title: "Descargador de Telegram",
    subtitle: "Descargue videos y archivos de Telegram de forma rápida y segura.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo descargar videos de Telegram",
    howToSteps: [
      "Copie el enlace: En Telegram, copie el enlace del post del video.",
      "Pegue el enlace: Pegue la URL en el campo arriba.",
      "Extraer: Haga clic en 'Iniciar extracción'.",
      "Guardar: Haga clic en el botón de descarga resultante."
    ],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una conexión estable para extraer medios de Telegram sin complicaciones.",
    whyPoints: [
      "Privacidad: No registramos su historial.",
      "Sin registro: Descargue inmediatamente.",
      "Compatibilidad total: PC, Mac, Android e iOS."
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      { q: "¿Soportan canales privados?", a: "Solo soportamos enlaces públicos por políticas de Telegram." },
      { q: "¿Hay límite de tamaño?", a: "Soportamos tamaños comunes; archivos de +2GB pueden fallar." }
    ],
    galleryTitle: "Videos de Telegram recientes",
    trendingTitle: "Tendencias semanales de Telegram"
  },
  pt: {
    title: "Downloader do Telegram",
    subtitle: "Baixe vídeos e arquivos do Telegram de forma rápida e segura.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como baixar vídeos do Telegram",
    howToSteps: [
      "Copie o link: No Telegram, copie o link da postagem.",
      "Cole o link: Cole na caixa de entrada acima.",
      "Extrair: Clique em 'Iniciar extração'.",
      "Salvar: Clique no botão de download."
    ],
    whyTitle: "Por que usar o ClipKeep?",
    whyBody: "O ClipKeep garante uma extração estável e rápida para mídias do Telegram.",
    whyPoints: [
      "Privacidade total: Não salvamos seu histórico.",
      "Sem cadastro: Baixe agora mesmo.",
      "Multiplataforma: Funciona em todos os dispositivos."
    ],
    faqTitle: "Perguntas Frequentes",
    faqItems: [
      { q: "Canais privados são suportados?", a: "Apenas links públicos são suportados no momento." },
      { q: "Existe limite de tamanho?", a: "Arquivos muito grandes (+2GB) podem sofrer timeout." }
    ],
    galleryTitle: "Vídeos do Telegram recentes",
    trendingTitle: "Tendências da semana - Telegram"
  },
  fr: {
    title: "Téléchargeur Telegram",
    subtitle: "Téléchargez des vidéos et fichiers Telegram rapidement et en toute sécurité.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment télécharger ?",
    howToSteps: [
      "Copiez le lien : Sur Telegram, copiez le lien du post.",
      "Collez le lien : Collez l'URL dans le champ ci-dessus.",
      "Extraire : Cliquez sur 'Démarrer l'extraction'.",
      "Enregistrer : Cliquez sur le bouton de téléchargement."
    ],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet une extraction stable là où le téléchargement direct peut être lent.",
    whyPoints: [
      "Confidentialité : Aucun historique n'est conservé.",
      "Sans inscription : Téléchargez instantanément.",
      "Compatible : Windows, Mac, iOS, Android."
    ],
    faqTitle: "FAQ",
    faqItems: [
      { q: "Canaux privés ?", a: "Seuls les liens publics sont accessibles." },
      { q: "Limite de taille ?", a: "Les fichiers de plus de 2 Go peuvent échouer." }
    ],
    galleryTitle: "Vidéos Telegram récentes",
    trendingTitle: "Tendances Telegram de la semaine"
  },
  id: {
    title: "Pengunduh Video Telegram",
    subtitle: "Unduh video dan media dari saluran Telegram dengan cepat dan aman.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara Mengunduh",
    howToSteps: [
      "Salin Link: Salin tautan postingan dari Telegram.",
      "Tempel Link: Tempel ke kolom di atas.",
      "Ekstrak: Klik tombol 'Mulai Ekstrak'.",
      "Simpan: Klik tombol unduh yang muncul."
    ],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep menyediakan koneksi stabil untuk ekstraksi media Telegram.",
    whyPoints: [
      "Privasi: Kami tidak mencatat riwayat Anda.",
      "Tanpa Daftar: Langsung unduh sekarang.",
      "Semua Perangkat: PC, Android, iOS."
    ],
    faqTitle: "Pertanyaan Umum",
    faqItems: [
      { q: "Bisa unduh dari grup privat?", a: "Hanya link publik yang didukung." },
      { q: "Ada batas ukuran?", a: "File di atas 2GB mungkin gagal." }
    ],
    galleryTitle: "Video Telegram Terbaru",
    trendingTitle: "Tren Mingguan Telegram"
  },
  hi: {
    title: "टेलीग्राम वीडियो डाउनलोडर",
    subtitle: "टेलीग्राम चैनलों और समूहों से वीडियो और मीडिया जल्दी और सुरक्षित रूप से डाउनलोड करें।",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "टेलीग्राम वीडियो कैसे डाउनलोड करें",
    howToSteps: [
      "लिंक कॉपी करें: टेलीग्राम में पोस्ट लिंक कॉपी करें।",
      "लिंक पेस्ट करें: ऊपर दिए गए इनपुट में URL पेस्ट करें।",
      "एक्सट्रैक्शन शुरू करें: 'एक्सट्रैक्शन शुरू करें' पर क्लिक करें।",
      "सहेजें: डाउनलोड बटन पर क्लिक करें।"
    ],
    whyTitle: "ClipKeep का उपयोग क्यों करें?",
    whyBody: "ClipKeep टेलीग्राम मीडिया के लिए स्थिर और तेज़ एक्सट्रैक्शन प्रदान करता है।",
    whyPoints: [
      "गोपनीयता: हम आपका इतिहास रिकॉर्ड नहीं करते हैं।",
      "कोई पंजीकरण नहीं: तुरंत डाउनलोड करना शुरू करें।",
      "सभी डिवाइस: Windows, Android, iOS पर काम करता है।"
    ],
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqItems: [
      { q: "क्या मैं प्राइवेट चैनल से डाउनलोड कर सकता हूँ?", a: "ClipKeep केवल सार्वजनिक लिंक का समर्थन करता है।" },
      { q: "क्या कोई फ़ाइल आकार सीमा है?", a: "हम सामान्य आकार का समर्थन करते हैं। 2GB+ फ़ाइलें विफल हो सकती हैं।" }
    ],
    galleryTitle: "हाल ही में एक्सट्रैक्ट किए गए टेलीग्राम वीडियो",
    trendingTitle: "साप्ताहिक ट्रेंडिंग टेलीग्राम वीडियो"
  },
  de: {
    title: "Telegram Downloader",
    subtitle: "Videos von Telegram-Kanälen schnell und sicher speichern.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Anleitung",
    howToSteps: [
      "Link kopieren: Telegram-Post-Link kopieren.",
      "Einfügen: URL oben einfügen.",
      "Extrahieren: Start klicken.",
      "Speichern: Download-Button nutzen."
    ],
    whyTitle: "Vorteile",
    whyBody: "ClipKeep ermöglicht stabile Downloads von Telegram-Medien.",
    whyPoints: [
      "Privatsphäre: Kein Verlauf.",
      "Ohne Anmeldung: Direkt starten.",
      "Überall: Windows, Android, iOS."
    ],
    faqTitle: "FAQ",
    faqItems: [
      { q: "Private Kanäle?", a: "Nur öffentliche Links werden unterstützt." },
      { q: "Größenbeschränkung?", a: "Über 2GB kann es zu Timeouts kommen." }
    ],
    galleryTitle: "Neueste Telegram Videos",
    trendingTitle: "Wochentrends Telegram"
  },
  tr: {
    title: "Telegram İndirici",
    subtitle: "Telegram kanallarından videoları güvenle ve hızla indirin.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Nasıl İndirilir?",
    howToSteps: [
      "Linki Kopyalayın: Telegram post linkini kopyalayın.",
      "Yapıştırın: URL'yi yukarıdaki alana yapıştırın.",
      "Ayıklayın: 'Başlat' butonuna tıklayın.",
      "Kaydedin: İndir butonuna tıklayın."
    ],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Telegram videoları için en hızlı ayıklama çözümüdür.",
    whyPoints: [
      "Gizlilik: Kayıt tutmuyoruz.",
      "Üyeliksiz: Hemen kullanın.",
      "Uyumluluk: Her cihazda çalışır."
    ],
    faqTitle: "Sık Sorulan Sorular",
    faqItems: [
      { q: "Gizli kanallar?", a: "Yalnızca herkese açık linkler desteklenir." },
      { q: "Boyut sınırı?", a: "2GB üzerindeki dosyalarda sorun çıkabilir." }
    ],
    galleryTitle: "Son Telegram Videoları",
    trendingTitle: "Haftalık Popüler - Telegram"
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
    ],
    galleryTitle: "Recent X/Twitter Archives",
    trendingTitle: "Trending X/Twitter Videos (Weekly)",
    seoContent: "ClipKeep for Twitter (X) is a premium media extraction solution designed for curators, journalists, and everyday users who need to archive high-quality video content from the X platform. In an era where digital content can vanish in an instant, having a reliable way to save important news clips, educational threads, and viral moments is more critical than ever.\n\nOur Twitter downloader is optimized for speed and clarity. We bypass the complexities of traditional downloading methods, providing you with a direct path to the highest-quality MP4 or GIF versions of any public tweet. Powered by an advanced Cloudflare-based infrastructure, ClipKeep handles high traffic with ease, ensuring that you never have to wait for your media to be processed. Whether it's a short 15-second clip or a multi-minute documentary posted on X, our engine extracts the best available bitrate for your viewing pleasure.\n\nUsing ClipKeep is simple: just copy the post URL, paste it into our prominent extractor field, and click download. We've designed our interface to be clean and tool-focused, removing unnecessary distractions so you can get what you need and get back to your day. Our commitment to privacy means no tracking of your history and no account requirements. Experience the future of SNS media archiving with ClipKeep."
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
    ],
    galleryTitle: "أرشيفات X/تويتر الأخيرة",
    trendingTitle: "فيديوهات X/تويتر الرائجة (أسبوعياً)"
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
    ],
    galleryTitle: "最近のX/Twitterアーカイブ",
    trendingTitle: "週間トレンド・X/Twitter動画",
    seoContent: "ClipKeepのTwitter (X) 動画ダウンロードツールは、ジャーナリスト、クリエイター、そしてソーシャルメディア上の貴重なコンテンツを保存したい全てのユーザーのために設計された、プレミアムなデータ抽出ソリューションです。デジタルコンテンツが瞬時に消え去る可能性がある現代において、重要なニュース、教育的なスレッド、そして話題の瞬間を確実に保存しておくことは、これまで以上に重要になっています。\n\n当サイトのTwitterダウンローダーは、スピードと画質の両立を追求しています。従来の複雑なダウンロード手順を排除し、公開されているツイートから最高品質のMP4やGIFへのダイレクトなパスを提供します。Cloudflareを活用した高度なインフラストラクチャにより、アクセスが集中する時間帯でも安定したパフォーマンスを発揮し、メディアの処理を待たされることはありません。15秒の短いクリップから、Xに投稿された数分にわたるドキュメンタリーまで、当社のエンジンは利用可能な最高のビットレートを抽出し、快適な視聴体験を実現します。\n\nClipKeepの使用方法は非常にシンプルです。投稿のURLをコピーし、当サイトの目立つ入力フィールドに貼り付けてダウンロードをクリックするだけ。ツールとしての機能性を最優先。プライバシーへの取り組みとして、履歴の追跡やアカウントの登録は一切不要です。ClipKeepで、次世代のSNSメディアアーカイブを体験してください。"
  },
  es: {
    title: "Descargador de Twitter (X)",
    subtitle: "Archive videos y GIFs de X/Twitter directamente en su dispositivo.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar videos de Twitter",
    howToSteps: [
      "Busque el post: Vaya al post de X que contiene el video.",
      "Copie el enlace: Haga clic en compartir y copie el enlace.",
      "ClipKeep: Pegue la URL arriba y haga clic en 'Enviar'.",
      "Descargar: Guarde el archivo generado."
    ],
    whyTitle: "Beneficios",
    whyBody: "Archivar contenido de X es vital para creadores. ClipKeep se enfoca en la velocidad.",
    whyPoints: [
      "Videos y GIFs: Soporte completo.",
      "Baja latencia: Potenciado por Cloudflare.",
      "Sin cookies: No pedimos sus credenciales."
    ],
    faqTitle: "Dudas comunes",
    faqItems: [
      { q: "¿Tweets privados?", a: "No. Solo contenido público." },
      { q: "¿Qué calidad?", a: "La máxima disponible en la plataforma." }
    ],
    galleryTitle: "Archivos de X recientes",
    trendingTitle: "Tendencias de X (Semanal)"
  },
  pt: {
    title: "Downloader do Twitter (X)",
    subtitle: "A maneira mais rápida de arquivar vídeos e GIFs do X/Twitter.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar vídeos do Twitter",
    howToSteps: [
      "Encontre o post: Vá até o post do X com o vídeo.",
      "Copie o link: Use o ícone de compartilhar.",
      "ClipKeep: Cole acima e clique em 'Enviar'.",
      "Download: Salve no seu dispositivo."
    ],
    whyTitle: "Vantagens",
    whyBody: "ClipKeep foca em uma experiência rápida e segura para usuários do X.",
    whyPoints: [
      "GIFs e Vídeos: Suporte total.",
      "Processamento rápido: Backend otimizado.",
      "Seguro: Não pedimos acesso à sua conta."
    ],
    faqTitle: "Dúvidas",
    faqItems: [
      { q: "Tweets privados funcionam?", a: "Não. Apenas conteúdo público pode ser extraído." },
      { q: "Qual a qualidade?", a: "Extraímos a melhor qualidade oferecida pelo X." }
    ],
    galleryTitle: "Arquivos do X recentes",
    trendingTitle: "Tendências do X (Semanal)"
  },
  fr: {
    title: "Téléchargeur Twitter (X)",
    subtitle: "Le moyen le plus rapide d'archiver des vidéos de X/Twitter.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment faire ?",
    howToSteps: [
      "Trouvez le post : Allez sur le post X contenant la vidéo.",
      "Copiez le lien : Utilisez l'icône de partage.",
      "ClipKeep : Collez et cliquez sur 'Démarrer'.",
      "Télécharger : Enregistrez le fichier."
    ],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep offre une expérience propre axée sur la performance pour X.",
    whyPoints: [
      "GIFs et Vidéos : Support intégral.",
      "Vitesse : Optimisé par Cloudflare.",
      "Sécurité : Aucune connexion requise."
    ],
    faqTitle: "Questions",
    faqItems: [
      { q: "Tweets privés ?", a: "Impossible. Uniquement contenu public." },
      { q: "Qualité ?", a: "La plus haute disponible." }
    ],
    galleryTitle: "Archives X récentes",
    trendingTitle: "Tendances X de la semaine"
  },
  id: {
    title: "Pengunduh Video Twitter (X)",
    subtitle: "Cara tercepat mengarsipkan video dan GIF dari X/Twitter ke HP Anda.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara Simpan Video",
    howToSteps: [
      "Cari Postingan: Buka postingan X yang berisi video.",
      "Salin Link: Klik ikon share dan salin tautan.",
      "ClipKeep: Tempel URL dan klik 'Kirim'.",
      "Download: Simpan media setelah diproses."
    ],
    whyTitle: "Keuntungan ClipKeep",
    whyBody: "ClipKeep menyediakan akses cepat untuk konten X tanpa ribet.",
    whyPoints: [
      "Dukung GIF: Ekstrak semua jenis media di X.",
      "Cepat: Latensi minimal dengan Cloudflare.",
      "Aman: Tanpa perlu login akun X."
    ],
    faqTitle: "FAQ X",
    faqItems: [
      { q: "Bisa tweet gembok?", a: "Tidak. Hanya konten publik." },
      { q: "Gimana kualitasnya?", a: "Kualitas tertinggi yang tersedia di server X." }
    ],
    galleryTitle: "Arsip X Terbaru",
    trendingTitle: "Tren Mingguan X"
  },
  hi: {
    title: "ट्विटर (X) वीडियो डाउनलोडर",
    subtitle: "X/ट्विटर से सीधे अपने डिवाइस पर वीडियो और GIF आर्काइव करने का सबसे तेज़ तरीका।",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "ट्विटर वीडियो कैसे सहेजें",
    howToSteps: [
      "पोस्ट खोजें: वीडियो वाले X/ट्विटर पोस्ट पर जाएं।",
      "लिंक कॉपी करें: शेयर आइकन पर क्लिक करें और 'कॉपी लिंक' चुनें।",
      "ClipKeep के साथ एक्सट्रैक्ट करें: ऊपर URL पेस्ट करें और 'सबमिट' पर क्लिक करें।",
      "डाउनलोड करें: प्रक्रिया पूरी होने के बाद डाउनलोड बटन पर क्लिक करें।"
    ],
    whyTitle: "X के लिए ClipKeep के लाभ",
    whyBody: "ClipKeep गति और शुद्धता पर केंद्रित एक स्वच्छ अनुभव प्रदान करता है।",
    whyPoints: [
      "GIF और वीडियो समर्थन: X पोस्ट पर मौजूद किसी भी मीडिया को एक्सट्रैक्ट करें।",
      "तेज़ रिस्पॉन्स: Cloudflare द्वारा समर्थित बैकएंड न्यूनतम विलंबता सुनिश्चित करता है।",
      "सुरक्षित: हमें खाता पहुंच या कुकीज़ की आवश्यकता नहीं है।"
    ],
    faqTitle: "सामान्य प्रश्न",
    faqItems: [
      { q: "क्या मैं प्राइवेट ट्वीट डाउनलोड कर सकता हूँ?", a: "नहीं। ClipKeep केवल सार्वजनिक मीडिया का समर्थन करता है।" },
      { q: "वीडियो की गुणवत्ता क्या होगी?", a: "ClipKeep उच्चतम उपलब्ध बिटरेट एक्सट्रैक्ट करता है।" }
    ],
    galleryTitle: "हालिया X/ट्विटर आर्काइव",
    trendingTitle: "साप्ताहिक ट्रेंडिंग X/ट्विटर वीडियो"
  },
  de: {
    title: "Twitter (X) Downloader",
    subtitle: "Der schnellste Weg, Videos von X zu speichern.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Anleitung",
    howToSteps: [
      "Post finden: X-Post mit Video aufrufen.",
      "Link kopieren: Über Teilen-Icon den Link kopieren.",
      "ClipKeep: URL einfügen und 'Senden'.",
      "Download: Datei speichern."
    ],
    whyTitle: "Vorteile",
    whyBody: "Schnelle und saubere Archivierung von X-Medien.",
    whyPoints: [
      "GIF & Video: Volle Unterstützung.",
      "Speed: Cloudflare optimiert.",
      "Sicher: Kein Login nötig."
    ],
    faqTitle: "Häufige Fragen",
    faqItems: [
      { q: "Private Tweets?", a: "Nein, nur öffentliche Inhalte." },
      { q: "Bildqualität?", a: "Höchste verfügbare Qualität." }
    ],
    galleryTitle: "Neueste X-Archive",
    trendingTitle: "Trends auf X"
  },
  tr: {
    title: "Twitter (X) İndirici",
    subtitle: "X/Twitter'daki videoları cihazınıza kaydetmenin en hızlı yolu.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Nasıl Kaydedilir?",
    howToSteps: [
      "Postu Bulun: Videonun olduğu X postuna gidin.",
      "Linki Kopyalayın: Paylaş ikonundan linki kopyalayın.",
      "ClipKeep: URL'yi yapıştırın ve 'Gönder'e basın.",
      "İndirin: İşlem bitince dosyanızı indirin."
    ],
    whyTitle: "Neden ClipKeep?",
    whyBody: "X medyalarını saklamak için hız odaklı temiz bir deneyim sunuyoruz.",
    whyPoints: [
      "GIF Desteği: X postlarındaki tüm medyaları indirin.",
      "Düşük Gecikme: Cloudflare destekli altyapı.",
      "Güvenli: Hesap erişimi gerekmez."
    ],
    faqTitle: "Sık Sorulanlar",
    faqItems: [
      { q: "Gizli tweetler?", a: "Hayır. Sadece herkese açık içerikler." },
      { q: "Video kalitesi?", a: "Platformda bulunan en yüksek kalite." }
    ],
    galleryTitle: "Son X Arşivleri",
    trendingTitle: "Haftalık Popüler - X"
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
    ],
    galleryTitle: "Recent TikTok Discoveries",
    trendingTitle: "Trending TikTok Videos (Weekly)",
    seoContent: "ClipKeep's TikTok Downloader is a high-performance solution for anyone looking to save and archive viral content from the world's fastest-growing social video platform. TikTok has revolutionized how we consume short-form media, making it essential for creators, researchers, and digital curators to have a reliable way to keep these fleeting moments for future reference.\n\nOur tool focuses on speed and quality. We provide a direct bridge to TikTok's media servers, allowing for high-definition extractions that preserve the integrity of the original upload. Whether you are building a personal archive of your favorite creators, conducting market research on trending hashtags, or simply wanting to enjoy videos offline where internet access is limited, ClipKeep delivers a seamless experience.\n\nWe prioritize user privacy and simplicity. No account linking or personal data is required to use our service. We also aim to provide the most direct media path possible, often enabling downloads without intrusive watermarks or additional branding. Combined with our global infrastructure, ClipKeep ensures that you can extraction TikTok media from anywhere in the world, on any device, with professional-grade stability."
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
    ],
    galleryTitle: "اكتشافات تيك توك الأخيرة",
    trendingTitle: "فيديوهات تيك توك الرائجة (أسبوعياً)"
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
    ],
    galleryTitle: "最近のTikTok動画",
    trendingTitle: "週間トレンド・TikTok動画",
    seoContent: "ClipKeepのTikTok動画ダウンロードツールは、世界で最も急速に成長しているソーシャルビデオプラットフォームからバイラルコンテンツを保存・アーカイブしようとする全ての人のための高性能なソリューションです。TikTokは短尺メディアの消費方法に革命をもたらしました。クリエイター、リサーチャー、デジタルキュレーターにとって、これらの刹那的な瞬間を将来の参照用に保管するための信頼できる手段を持つことは今や不可欠です。\n\n当サイトのツールは、スピードと品質に重点を置いています。TikTokのメディアサーバーへの直接的なブリッジを提供することで、元のアップロードの鮮明さを維持したまま、高画質な抽出を可能にします。お気に入りのクリエイターの個人アーカイブを作成する場合でも、トレンドのハッシュタグに関する市場調査を行う場合でも、あるいは単にインターネットアクセスが制限されている場所で動画をオフラインで楽しみたい場合でも、ClipKeepはシームレスな体験を提供します。\n\n私たちはユーザーのプライバシーとシンプルさを最優先しています。サービスを利用するためにアカウントの連携や個人データの提供は一切不要です。また、可能な限り直接的なメディアパスを提供することを目指しており、多くの場合、邪魔なロゴ（透かし）のない状態での保存が可能です。世界規模のインフラと組み合わせることで、ClipKeepは世界中のどこからでも、どんなデバイスからでも、プロフェッショナル級の安定性でTikTokメディアの抽出を保証します。"
  },
  es: {
    title: "Descargador de TikTok",
    subtitle: "Archive sus momentos favoritos de TikTok para ver sin conexión.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    note: "Nota: Acceso temprano",
    noteBody: "La extracción de TikTok está en acceso temprano limitado.",
    howToTitle: "Cómo descargar contenido",
    howToSteps: [
      "Obtenga la URL: En TikTok, copie el enlace del video.",
      "Pegue en ClipKeep: Use el formulario arriba.",
      "Procesar y Guardar: Obtendrá una ruta directa al medio."
    ],
    whyTitle: "Archivado Profesional",
    whyBody: "ClipKeep ofrece un flujo de trabajo optimizado para curadores de contenido.",
    whyPoints: [],
    faqTitle: "FAQ TikTok",
    faqItems: [
      { q: "¿Se elimina la marca de agua?", a: "Buscamos la ruta más directa, a menudo sin logo." },
      { q: "¿Soportan presentaciones?", a: "El soporte para diapositivas es limitado por ahora." }
    ],
    galleryTitle: "Descubrimientos recientes",
    trendingTitle: "Tendencias de TikTok (Semanal)"
  },
  pt: {
    title: "Downloader do TikTok",
    subtitle: "Arquive seus momentos favoritos do TikTok para ver offline.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    note: "Nota: Acesso Antecipado",
    noteBody: "Extração do TikTok em acesso antecipado limitado.",
    howToTitle: "Como baixar conteúdo",
    howToSteps: [
      "Obtenha a URL: Copie o link do vídeo no TikTok.",
      "Cole no ClipKeep: Use a caixa acima.",
      "Processar e Salvar: Nosso sistema fornecerá o caminho direto."
    ],
    whyTitle: "Arquivamento Profissional",
    whyBody: "Para criadores, manter um histórico é vital. ClipKeep simplifica isso.",
    whyPoints: [],
    faqTitle: "FAQ TikTok",
    faqItems: [
      { q: "A marca d'água é removida?", a: "Sim, buscamos o link direto sem logo sempre que possível." },
      { q: "Slideshow é suportado?", a: "Suporte para apresentações ainda é limitado." }
    ],
    galleryTitle: "Descobertas recentes",
    trendingTitle: "Tendências do TikTok (Semanal)"
  },
  fr: {
    title: "Téléchargeur TikTok",
    subtitle: "Archivez vos moments TikTok favoris pour une lecture hors ligne.",
    statusLabel: "État",
    helpPage: "Aide",
    note: "Note : Accès anticipé",
    noteBody: "L'extraction TikTok est en accès anticipé limité.",
    howToTitle: "Comment télécharger ?",
    howToSteps: [
      "Obtenir l'URL : Copiez le lien de la vidéo TikTok.",
      "Collez dans ClipKeep : Utilisez le champ ci-dessus.",
      "Traiter & Enregistrer : Récupérez le fichier directement."
    ],
    whyTitle: "Archivage professionnel",
    whyBody: "ClipKeep offre un flux de travail simplifié pour vos archives.",
    whyPoints: [],
    faqTitle: "FAQ TikTok",
    faqItems: [
      { q: "Filigrane supprimé ?", a: "Nous visons le fichier original, souvent sans logo." },
      { q: "Diaporamas ?", a: "Le support des diaporamas est limité." }
    ],
    galleryTitle: "Découvertes récentes",
    trendingTitle: "Tendances TikTok de la semaine"
  },
  id: {
    title: "Pengunduh Media TikTok",
    subtitle: "Arsip momen TikTok favorit Anda untuk dilihat offline.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    note: "Catatan: Akses Awal",
    noteBody: "Ekstraksi TikTok sedang dalam akses awal terbatas.",
    howToTitle: "Cara Mengunduh",
    howToSteps: [
      "Salin URL: Cari video di TikTok dan salin tautannya.",
      "Tempel: Gunakan formulir di atas.",
      "Simpan: Kami akan memproses file untuk Anda."
    ],
    whyTitle: "Pengarsipan Media Profesional",
    whyBody: "Penting bagi kreator untuk menyimpan konten populer.",
    whyPoints: [],
    faqTitle: "FAQ TikTok",
    faqItems: [
      { q: "Watermark dihapus?", a: "Kami mengambil file langsung, biasanya tanpa logo." },
      { q: "Bisa unduh slideshow?", a: "Dukungan slideshow masih terbatas." }
    ],
    galleryTitle: "Temuan TikTok Terbaru",
    trendingTitle: "Tren Mingguan TikTok"
  },
  hi: {
    title: "टिकटॉक मीडिया डाउनलोडर",
    subtitle: "ऑफलाइन देखने के लिए अपने पसंदीदा टिकटॉक पलों को आर्काइव करें।",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    note: "नोट: अर्ली एक्सेस",
    noteBody: "टिकटॉक एक्सट्रैक्शन वर्तमान में सीमित अर्ली एक्सेस में है।",
    howToTitle: "कंटेंट कैसे डाउनलोड करें",
    howToSteps: [
      "टिकटॉक URL प्राप्त करें: 'कॉपी लिंक' पर क्लिक करें।",
      "ClipKeep में पेस्ट करें: ऊपर दिए गए फॉर्म का उपयोग करें।",
      "प्रक्रिया और सहेजें: हमारी प्रणाली एक सीधा मीडिया पथ प्रदान करेगी।"
    ],
    whyTitle: "प्रोफेसनल मीडिया आर्काइविंग",
    whyBody: "ट्रेंडिंग टिकटॉक कंटेंट का आर्काइव रखना डिजिटल मार्केटर्स के लिए महत्वपूर्ण है।",
    whyPoints: [],
    faqTitle: "टिकटॉक FAQ",
    faqItems: [
      { q: "क्या वॉटरमार्किंग हटा दी गई है?", a: "हम सीधा पथ प्रदान करते हैं, जिसमें अक्सर कोई वॉटरमार्क नहीं होता।" },
      { q: "क्या मैं टिकटॉक स्लाइडशो डाउनलोड कर सकता हूँ?", a: "स्लाइडशो समर्थन अभी सीमित है।" }
    ],
    galleryTitle: "हालिया टिकटॉक खोजें",
    trendingTitle: "साप्ताहिक ट्रेंडिंग टिकटॉक वीडियो"
  },
  de: {
    title: "TikTok Media Downloader",
    subtitle: "Speichern Sie Ihre TikTok-Favoriten offline.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    note: "Hinweis: Early Access",
    noteBody: "TikTok-Extraktion ist derzeit im frühen Zugriff.",
    howToTitle: "Anleitung",
    howToSteps: [
      "Link holen: TikTok-Video-Link kopieren.",
      "Einfügen: Oben im Formular einfügen.",
      "Speichern: Link zum Download nutzen."
    ],
    whyTitle: "Professionelle Archivierung",
    whyBody: "Schneller Workflow für Content-Ersteller.",
    whyPoints: [],
    faqTitle: "TikTok FAQ",
    faqItems: [
      { q: "Ohne Wasserzeichen?", a: "Wir laden die Originaldatei ohne Overlays." },
      { q: "Slideshows?", a: "Derzeit eingeschränkt unterstützt." }
    ],
    galleryTitle: "Neueste TikTok-Funde",
    trendingTitle: "Trends auf TikTok"
  },
  tr: {
    title: "TikTok Medya İndirici",
    subtitle: "TikTok videolarını çevrimdışı izlemek üzere kaydedin.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    note: "Not: Erken Erişim",
    noteBody: "TikTok ayıklama erişimi henüz kısıtlıdır.",
    howToTitle: "Nasıl İndirilir?",
    howToSteps: [
      "Linki Alın: TikTok videosunun linkini kopyalayın.",
      "Yapıştırın: Formu kullanarak linki buraya ekleyin.",
      "Kaydedin: Sistem doğrudan indirme yolu sunacaktır."
    ],
    whyTitle: "Profesyonel Arşivleme",
    whyBody: "İçerik küratörleri için optimize edilmiş iş akışı.",
    whyPoints: [],
    faqTitle: "TikTok SSS",
    faqItems: [
      { q: "Logo kaldırılır mı?", a: "Genellikle logosuz orijinal dosyaya ulaşırız." },
      { q: "Slayt gösterileri?", a: "Şu an için destek sınırlıdır." }
    ],
    galleryTitle: "Son TikTok Keşifleri",
    trendingTitle: "Haftalık Popüler - TikTok"
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
  },
  es: {
    about: "Nosotros",
    faq: "FAQ",
    terms: "Términos",
    privacy: "Privacidad",
    cookies: "Cookies",
    dmca: "DMCA",
    contact: "Contacto",
    status: "Estado",
    adsDisclaimer: "Los anuncios se etiquetan como contenido patrocinado."
  },
  pt: {
    about: "Sobre",
    faq: "FAQ",
    terms: "Termos",
    privacy: "Privacidade",
    cookies: "Cookies",
    dmca: "DMCA",
    contact: "Contato",
    status: "Status",
    adsDisclaimer: "Anúncios são marcados como conteúdo patrocinado."
  },
  fr: {
    about: "À propos",
    faq: "FAQ",
    terms: "Conditions",
    privacy: "Confidentialité",
    cookies: "Cookies",
    dmca: "DMCA",
    contact: "Contact",
    status: "État",
    adsDisclaimer: "Les publicités sont étiquetées comme contenu sponsorisé."
  },
  id: {
    about: "Tentang Kami",
    faq: "FAQ",
    terms: "Ketentuan",
    privacy: "Privasi",
    cookies: "Cookie",
    dmca: "DMCA",
    contact: "Kontak",
    status: "Status",
    adsDisclaimer: "Iklan ditandai sebagai konten bersponsor."
  },
  hi: {
    about: "बारे में",
    faq: "FAQ",
    terms: "शर्तें",
    privacy: "गोपनीयता",
    cookies: "कुकीज़",
    dmca: "DMCA",
    contact: "संपर्क",
    status: "स्थिति",
    adsDisclaimer: "विज्ञापनों को प्रायोजित सामग्री के रूप में लेबल किया गया है।"
  },
  de: {
    about: "Über uns",
    faq: "FAQ",
    terms: "AGB",
    privacy: "Datenschutz",
    cookies: "Cookies",
    dmca: "DMCA",
    contact: "Kontakt",
    status: "Status",
    adsDisclaimer: "Anzeigen sind als gesponserte Inhalte gekennzeichnet."
  },
  tr: {
    about: "Hakkında",
    faq: "SSS",
    terms: "Şartlar",
    privacy: "Gizlilik",
    cookies: "Çerezler",
    dmca: "DMCA",
    contact: "İletişim",
    status: "Durum",
    adsDisclaimer: "Reklamlar sponsorlu içerik olarak işaretlenmiştir."
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
  },
  es: {
    title: "Estado del servicio",
    liveHealth: "Salud de la API",
    currentTitle: "Actual",
    currentBody: "Servicios operando correctamente.",
    incidentTitle: "Incidentes",
    partialDegradation: {
      title: "Degradación parcial",
      body: "Elevados errores en la extracción. Estamos mitigando el problema.",
      nextUpdate: "Próxima actualización: en 30 min."
    },
    scheduledMaintenance: {
      title: "Mantenimiento programado",
      body: "Mantenimiento en curso. Tiempos de respuesta afectados.",
      window: "Ventana: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Corte mayor",
      body: "Experimentamos un corte importante. Recovery en curso.",
      nextUpdate: "Próxima actualización: en 15 min."
    }
  },
  pt: {
    title: "Status do Serviço",
    liveHealth: "Saúde da API",
    currentTitle: "Atual",
    currentBody: "Todos os serviços operando normalmente.",
    incidentTitle: "Incidentes",
    partialDegradation: {
      title: "Degradação Parcial",
      body: "Falhas elevadas em requisições. Estamos mitigando.",
      nextUpdate: "Novo status: em 30 min."
    },
    scheduledMaintenance: {
      title: "Manutenção Agendada",
      body: "Em progresso. Extrações podem ser lentas.",
      window: "Horário: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Instabilidade Crítica",
      body: "Falha geral nas funções de extração. Equipe investigando.",
      nextUpdate: "Novo status: em 15 min."
    }
  },
  fr: {
    title: "État des services",
    liveHealth: "Santé de l'API",
    currentTitle: "Actuel",
    currentBody: "Les services fonctionnent normalement.",
    incidentTitle: "Incidents",
    partialDegradation: {
      title: "Dégradation partielle",
      body: "Erreurs élevées sur les extractions. En cours de résolution.",
      nextUpdate: "Prochaine mise à jour : 30 min."
    },
    scheduledMaintenance: {
      title: "Maintenance programmée",
      body: "Maintenance en cours. Performances réduites.",
      window: "Fenêtre : 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Interruption majeure",
      body: "Panne générale de l'extracteur. Nos équipes sont mobilisées.",
      nextUpdate: "Prochaine mise à jour : 15 min."
    }
  },
  id: {
    title: "Status Layanan",
    liveHealth: "Kesehatan API",
    currentTitle: "Sekarang",
    currentBody: "Semua layanan inti beroperasi normal.",
    incidentTitle: "Template Insiden",
    partialDegradation: {
      title: "Degradasi Parsial",
      body: "Terjadi kesalahan pada ekstraksi. Kami sedang menanganinya.",
      nextUpdate: "Update: dalam 30 menit."
    },
    scheduledMaintenance: {
      title: "Pemeliharaan Terjadwal",
      body: "Pemeliharaan sistem sedang berlangsung.",
      window: "Rencana: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Gangguan Utama",
      body: "Terjadi pemadaman sistem utama. Tim sedang memulihkan.",
      nextUpdate: "Update: dalam 15 menit."
    }
  },
  hi: {
    title: "सेवा स्थिति",
    liveHealth: "लाइव API स्वास्थ्य",
    currentTitle: "वर्तमान",
    currentBody: "सभी मुख्य सेवाएं सामान्य रूप से काम कर रही हैं।",
    incidentTitle: "इंसिडेंट",
    partialDegradation: {
      title: "आंशिक गिरावट",
      body: "एक्सट्रैक्शन अनुरोधों में विफलताएं आ रही हैं। हम इसे कम करने की कोशिश कर रहे हैं।",
      nextUpdate: "अगला अपडेट: 30 मिनट के भीतर।"
    },
    scheduledMaintenance: {
      title: "अनुसूचित रखरखाव",
      body: "अनुरक्षण कार्य प्रगति पर है। रिस्पॉन्स टाइम प्रभावित हो सकता है।",
      window: "योजना: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "मेजर आउटेज",
      body: "वर्तमान में मुख्य एक्सट्रैक्शन कार्यक्षमता प्रभावित है। टीम जांच कर रही है।",
      nextUpdate: "अगला अपडेट: 15 मिनट के भीतर।"
    }
  },
  de: {
    title: "Systemstatus",
    liveHealth: "API-Status",
    currentTitle: "Aktuell",
    currentBody: "Alle Dienste laufen normal.",
    incidentTitle: "Vorfälle",
    partialDegradation: {
      title: "Teileinschränkung",
      body: "Erhöhte Fehlerzahlen. Wir arbeiten an einer Lösung.",
      nextUpdate: "Update in 30 Min."
    },
    scheduledMaintenance: {
      title: "Wartung",
      body: "Wartungsarbeiten werden durchgeführt.",
      window: "Zeitfenster: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Schwere Störung",
      body: "Hauptfunktionen sind offline. Team ist informiert.",
      nextUpdate: "Update in 15 Min."
    }
  },
  tr: {
    title: "Hizmet Durumu",
    liveHealth: "API Sağlığı",
    currentTitle: "Güncel",
    currentBody: "Tüm servisler normal çalışıyor.",
    incidentTitle: "Olaylar",
    partialDegradation: {
      title: "Kısmi Yavaşlama",
      body: "Ayıklama hataları artmış durumda. Müdahale ediliyor.",
      nextUpdate: "Sonraki güncelleme: 30 dk içinde."
    },
    scheduledMaintenance: {
      title: "Planlı Bakım",
      body: "Bakım çalışması sürüyor. Hız etkilenebilir.",
      window: "Zaman dilimi: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Büyük Kesinti",
      body: "Ana ayıklama motoru devre dışı. Kurtarma işlemi sürüyor.",
      nextUpdate: "Sonraki güncelleme: 15 dk içinde."
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
  },
  es: {
    title: "Resultado de ClipKeep",
    jobIdLabel: "ID de trabajo",
    statusLabel: "Estado de extracción",
    stateLabel: "Estado actual",
    progressLabel: "Progreso",
    loading: "Cargando datos...",
    failedToLoad: "Error al cargar el resultado.",
    completed: "¡Extracción completada!",
    polling: (status) => `Esperando... (${status})`,
    networkError: "Error de red al consultar.",
    downloads: "Descargas",
    noMedia: "No se encontraron medios.",
    warnings: "Advertencias",
    needHelp: "¿Ayuda?",
    checkSolution: "Ver guía",
    errorTitle: "Algo salió mal",
    backToHome: "Inicio",
    statusTitle: "Estado",
    states: {
      queued: "En cola",
      processing: "Procesando",
      completed: "Completado",
      failed: "Error",
    },
    mediaTitle: "Media Lista",
    download: "Descargar"
  },
  pt: {
    title: "Resultado do ClipKeep",
    jobIdLabel: "ID da Tarefa",
    statusLabel: "Status da Extração",
    stateLabel: "Estado Atual",
    progressLabel: "Progresso",
    loading: "Carregando dados...",
    failedToLoad: "Falha ao carregar.",
    completed: "Extração concluída!",
    polling: (status) => `Verificando... (${status})`,
    networkError: "Erro de rede.",
    downloads: "Downloads",
    noMedia: "Nenhum arquivo encontrado.",
    warnings: "Avisos",
    needHelp: "Ajuda?",
    checkSolution: "Ver guia",
    errorTitle: "Erro",
    backToHome: "Início",
    statusTitle: "Status",
    states: {
      queued: "Na fila",
      processing: "Processando",
      completed: "Concluído",
      failed: "Falha",
    },
    mediaTitle: "Mídia Pronta",
    download: "Baixar"
  },
  fr: {
    title: "Résultat ClipKeep",
    jobIdLabel: "ID de tâche",
    statusLabel: "État de l'extraction",
    stateLabel: "État actuel",
    progressLabel: "Progression",
    loading: "Chargement...",
    failedToLoad: "Échec du chargement.",
    completed: "Extraction terminée !",
    polling: (status) => `Consultation... (${status})`,
    networkError: "Erreur réseau.",
    downloads: "Téléchargements",
    noMedia: "Aucun média trouvé.",
    warnings: "Alertes",
    needHelp: "Aide ?",
    checkSolution: "Voir le guide",
    errorTitle: "Erreur",
    backToHome: "Accueil",
    statusTitle: "État",
    states: {
      queued: "En file",
      processing: "Traitement",
      completed: "Terminé",
      failed: "Échec",
    },
    mediaTitle: "Médias prêts",
    download: "Télécharger"
  },
  id: {
    title: "Hasil ClipKeep",
    jobIdLabel: "ID Tugas",
    statusLabel: "Status Ekstraksi",
    stateLabel: "Kondisi Saat Ini",
    progressLabel: "Kemajuan",
    loading: "Memuat data...",
    failedToLoad: "Gagal memuat hasil.",
    completed: "Ekstraksi selesai!",
    polling: (status) => `Memeriksa... (${status})`,
    networkError: "Kesalahan jaringan.",
    downloads: "Unduhan",
    noMedia: "Media tidak ditemukan.",
    warnings: "Peringatan",
    needHelp: "Bantuan?",
    checkSolution: "Lihat panduan",
    errorTitle: "Terjadi kesalahan",
    backToHome: "Kembali",
    statusTitle: "Status",
    states: {
      queued: "Antre",
      processing: "Memproses",
      completed: "Selesai",
      failed: "Gagal",
    },
    mediaTitle: "Media Siap",
    download: "Unduh"
  },
  hi: {
    title: "ClipKeep परिणाम",
    jobIdLabel: "कार्य ID",
    statusLabel: "एक्सट्रैक्शन स्थिति",
    stateLabel: "वर्तमान स्थिति",
    progressLabel: "प्रगति",
    loading: "लोड हो रहा है...",
    failedToLoad: "परिणाम लोड करने में विफल।",
    completed: "एक्सट्रैक्शन पूर्ण!",
    polling: (status) => `प्रतीक्षा करें... (${status})`,
    networkError: "नेटवर्क त्रुटि।",
    downloads: "डाउनलोड",
    noMedia: "कोई मीडिया नहीं मिला।",
    warnings: "चेतावनी",
    needHelp: "सहायता?",
    checkSolution: "गाइड देखें",
    errorTitle: "त्रुटि हुई",
    backToHome: "होम",
    statusTitle: "स्थिति",
    states: {
      queued: "कतार में",
      processing: "प्रोसेसिंग",
      completed: "पूर्ण",
      failed: "विफल",
    },
    mediaTitle: "मीडिया तैयार",
    download: "डाउनलोड"
  },
  de: {
    title: "ClipKeep Ergebnis",
    jobIdLabel: "Job ID",
    statusLabel: "Status",
    stateLabel: "Zustand",
    progressLabel: "Fortschritt",
    loading: "Lade Daten...",
    failedToLoad: "Fehler beim Laden.",
    completed: "Extraktion fertig!",
    polling: (status) => `Abfrage... (${status})`,
    networkError: "Netzwerkfehler.",
    downloads: "Downloads",
    noMedia: "Keine Medien gefunden.",
    warnings: "Warnungen",
    needHelp: "Hilfe?",
    checkSolution: "Anleitung lesen",
    errorTitle: "Fehler",
    backToHome: "Home",
    statusTitle: "Status",
    states: {
      queued: "Warteschlange",
      processing: "Verarbeitung",
      completed: "Fertig",
      failed: "Fehlgeschlagen",
    },
    mediaTitle: "Medien bereit",
    download: "Download"
  },
  tr: {
    title: "ClipKeep Sonucu",
    jobIdLabel: "Görev ID",
    statusLabel: "Durum",
    stateLabel: "Mevcut Durum",
    progressLabel: "İlerleme",
    loading: "Yükleniyor...",
    failedToLoad: "Yükleme başarısız.",
    completed: "Ayıklama bitti!",
    polling: (status) => `Sorgulanıyor... (${status})`,
    networkError: "Ağ hatası.",
    downloads: "İndirmeler",
    noMedia: "Medya bulunamadı.",
    warnings: "Uyarılar",
    needHelp: "Destek?",
    checkSolution: "Rehbere bak",
    errorTitle: "Hata oluştu",
    backToHome: "Anasayfa",
    statusTitle: "Durum",
    states: {
      queued: "Sırada",
      processing: "İşleniyor",
      completed: "Tamamlandı",
      failed: "Hata",
    },
    mediaTitle: "Dosyalar Hazır",
    download: "İndir"
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
  },
  es: {
    loading: "Cargando soluciones...",
    title: "Guía de soluciones",
    notFound: "No encontrado.",
    networkError: "Error de red.",
    heroSubtitle: "Instrucciones de recuperación.",
    quickAnswer: "Respuesta rápida",
    quickFallback: "Siga estos pasos.",
    stepByStep: "Paso a paso",
    trustSafety: "Seguridad",
    trustBody: "ClipKeep es seguro y privado.",
    internalLinks: "Vínculos",
    errorTitle: "Error 404",
    backToHome: "Inicio",
    getStarted: "Empezar"
  },
  pt: {
    loading: "Carregando...",
    title: "Guia",
    notFound: "Não encontrado.",
    networkError: "Erro.",
    heroSubtitle: "Passos de recuperação.",
    quickAnswer: "Resposta Rápida",
    quickFallback: "Siga os passos.",
    stepByStep: "Passo a passo",
    trustSafety: "Segurança",
    trustBody: "Privacidade garantida.",
    internalLinks: "Links",
    errorTitle: "Erro",
    backToHome: "Início",
    getStarted: "Começar"
  },
  fr: {
    loading: "Chargement...",
    title: "Guide",
    notFound: "Non trouvé.",
    networkError: "Erreur.",
    heroSubtitle: "Étapes de récupération.",
    quickAnswer: "Réponse rapide",
    quickFallback: "Suivez les étapes.",
    stepByStep: "Étape par étape",
    trustSafety: "Sécurité",
    trustBody: "ClipKeep est sûr.",
    internalLinks: "Liens",
    errorTitle: "Erreur",
    backToHome: "Accueil",
    getStarted: "Démarrer"
  },
  id: {
    loading: "Memuat...",
    title: "Panduan",
    notFound: "Tidak ditemukan.",
    networkError: "Error.",
    heroSubtitle: "Langkah pemulihan.",
    quickAnswer: "Jawaban Cepat",
    quickFallback: "Ikuti langkah.",
    stepByStep: "Langkah demi langkah",
    trustSafety: "Keamanan",
    trustBody: "ClipKeep aman.",
    internalLinks: "Tautan",
    errorTitle: "Error",
    backToHome: "Beranda",
    getStarted: "Mulai"
  },
  hi: {
    loading: "लोड हो रहा है...",
    title: "गाइड",
    notFound: "नहीं मिला।",
    networkError: "त्रुटि।",
    heroSubtitle: "रिकवरी चरण।",
    quickAnswer: "त्वरित उत्तर",
    quickFallback: "चरणों का पालन करें।",
    stepByStep: "चरण-दर-चरण",
    trustSafety: "सुरक्षा",
    trustBody: "ClipKeep सुरक्षित है।",
    internalLinks: "लिंक",
    errorTitle: "त्रुटि",
    backToHome: "होम",
    getStarted: "शुरू करें"
  },
  de: {
    loading: "Lade...",
    title: "Hilfe",
    notFound: "Nicht gefunden.",
    networkError: "Fehler.",
    heroSubtitle: "Wiederherstellungsschritte.",
    quickAnswer: "Schnellantwort",
    quickFallback: "Schritte folgen.",
    stepByStep: "Vorgehensweise",
    trustSafety: "Sicherheit",
    trustBody: "Sicher und privat.",
    internalLinks: "Links",
    errorTitle: "Fehler",
    backToHome: "Home",
    getStarted: "Starten"
  },
  tr: {
    loading: "Yükleniyor...",
    title: "Rehber",
    notFound: "Bulunamadı.",
    networkError: "Hata.",
    heroSubtitle: "Kurtarma adımları.",
    quickAnswer: "Hızlı Cevap",
    quickFallback: "Adımları izleyin.",
    stepByStep: "Adım Adım",
    trustSafety: "Güvenlik",
    trustBody: "Güvenli ve gizli.",
    internalLinks: "Bağlantılar",
    errorTitle: "Hata",
    backToHome: "Anasayfa",
    getStarted: "Başlat"
  }
};

export const instagramText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Instagram Video Downloader",
    subtitle: "Save Reels, Stories, and photos from Instagram in high quality.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Instagram Videos",
    howToSteps: [
      "Open Instagram: Find the post, Reel, or Story you want to save.",
      "Copy Link: Click the share button and select 'Copy Link'.",
      "Paste in ClipKeep: Paste the URL into the input field above and click 'Submit'.",
      "Download: Save the media to your device once processing is complete."
    ],
    whyTitle: "Why ClipKeep for Instagram?",
    whyBody: "Instagram often restricts direct downloads. ClipKeep allows you to archive your favorite memories and viral Reels safely.",
    whyPoints: [
      "High Quality: Preserves original resolution.",
      "Works with Reels: Supported dedicated Reel extraction.",
      "No Personal Data: We don't ask for your password."
    ],
    faqTitle: "Instagram FAQ",
    faqItems: [
      { q: "Can I save Stories?", a: "Yes, public Stories can be extracted by pasting their link." },
      { q: "Is it anonymous?", a: "Yes, ClipKeep does not notify users when you download their public content." }
    ],
    galleryTitle: "Recent Instagram Saves",
    trendingTitle: "Trending Instagram Reels"
  },
  ja: {
    title: "Instagram 動画保存",
    subtitle: "Instagramのリール、ストーリー、写真を高品質で保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Instagram動画の保存方法",
    howToSteps: [
      "URLをコピー: 保存したい投稿やリール、ストーリーの「リンクをコピー」をクリックします。",
      " ClipKeepに貼り付け: 上記の入力欄にリンクを貼り付け、「抽出を開始」をクリックします。",
      "保存: 抽出完了後、ダウンロードボタンから保存します。"
    ],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Instagramの動画を簡単に、かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: [
      "最高画質: 元の解像度を維持して保存します。",
      "リール対応: 人気のリール動画もスムーズに抽出可能です。",
      "安全・安心: ログイン情報は一切必要ありません。"
    ],
    faqTitle: "よくある質問",
    faqItems: [
      { q: "ストーリーは保存できますか？", a: "はい、公開されているストーリーであればURLから保存可能です。" },
      { q: "相手に通知されますか？", a: "いいえ、当サービスを利用してダウンロードしたことが相手に伝わることはありません。" }
    ],
    galleryTitle: "最近のInstagram保存",
    trendingTitle: "トレンドのリール動画"
  },
  ar: { 
    title: "محمل فيديوهات إنستغرام", 
    subtitle: "احفظ الريلز، القصص، والصور من إنستغرام بجودة عالية.", 
    statusLabel: "الحالة", 
    helpPage: "مساعدة", 
    howToTitle: "كيفية التحميل", 
    howToSteps: [
      "افتح إنستغرام: ابحث عن المنشور أو الريل أو القصة التي تريد حفظها.",
      "انسخ الرابط: انقر على زر المشاركة واختر 'نسخ الرابط'.",
      "الصق في ClipKeep: الصق الرابط في حقل الإدخال أعلاه وانقر على 'إرسال'.",
      "التنزيل: احفظ الوسائط على جهازك بمجرد اكتمال المعالجة."
    ], 
    whyTitle: "لماذا نستخدم ClipKeep لإنستغرام؟", 
    whyBody: "غالباً ما يقيد إنستغرام التنزيلات المباشرة. يسمح لك ClipKeep بأرشفة ذكرياتك المفضلة والريلز الرائجة بأمان.", 
    whyPoints: ["جودة عالية", "دعم الريلز", "بدون بيانات شخصية"], 
    faqTitle: "الأسئلة", 
    faqItems: [
      { q: "هل يمكنني حفظ القصص؟", a: "نعم، يمكن استخراج القصص العامة عن طريق لصق رابطها." },
      { q: "هل هو مجهول الهوية؟", a: "نعم، لا يقوم ClipKeep بإخطار المستخدمين عند تنزيل محتواهم العام." }
    ], 
    galleryTitle: "آخر التنزيلات", 
    trendingTitle: "الرائجة" 
  },
  es: { 
    title: "Descargador de Instagram", 
    subtitle: "Guarda Reels, Historias y fotos de Instagram en alta calidad.", 
    statusLabel: "Estado", 
    helpPage: "Ayuda", 
    howToTitle: "Cómo descargar", 
    howToSteps: [
      "Abre Instagram: Busca la publicación, Reel o Historia que quieras guardar.",
      "Copia el enlace: Haz clic en el botón de compartir y selecciona 'Copiar enlace'.",
      "Pega en ClipKeep: Pega la URL en el campo de arriba y haz clic en 'Enviar'.",
      "Descargar: Guarda el archivo en tu dispositivo una vez finalizado el proceso."
    ], 
    whyTitle: "¿Why ClipKeep?", 
    whyBody: "Instagram suele restringir las descargas directas. ClipKeep te permite archivar tus recuerdos favoritos de forma segura.", 
    whyPoints: ["Alta calidad", "Soporte para Reels", "Sin datos personales"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "¿Historias públicas?", a: "Sí, las Historias públicas se pueden extraer pegando su enlace." },
      { q: "¿Es anónimo?", a: "Sí, ClipKeep no notifica a los usuarios cuando descargas su contenido público." }
    ], 
    galleryTitle: "Recientes", 
    trendingTitle: "Tendencias" 
  },
  pt: { 
    title: "Downloader do Instagram", 
    subtitle: "Salve Reels, Stories e fotos do Instagram em alta qualidade.", 
    statusLabel: "Status", 
    helpPage: "Ajuda", 
    howToTitle: "Como baixar", 
    howToSteps: [
      "Abra o Instagram: Encontre o post, Reel ou Story que deseja salvar.",
      "Copie o link: Clique no botão de compartilhar e selecione 'Copiar link'.",
      "Cole no ClipKeep: Cole a URL no campo acima e clique em 'Enviar'.",
      "Download: Salve a mídia no seu dispositivo após o processamento."
    ], 
    whyTitle: "Vantagens", 
    whyBody: "O Instagram geralmente restringe downloads diretos. O ClipKeep permite que você arquive suas memórias favoritas com segurança.", 
    whyPoints: ["Alta qualidade", "Focado em Reels", "Seguro e Simples"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "Stories públicos?", a: "Sim, Stories públicos podem ser extraídos colando o link." },
      { q: "É anônimo?", a: "Sim, o ClipKeep não notifica os usuários quando você baixa conteúdo público." }
    ], 
    galleryTitle: "Recientes", 
    trendingTitle: "Tendências" 
  },
  fr: { 
    title: "Téléchargeur Instagram", 
    subtitle: "Enregistrez Reels, Stories et photos d'Instagram en haute qualité.", 
    statusLabel: "État", 
    helpPage: "Aide", 
    howToTitle: "Comment télécharger", 
    howToSteps: [
      "Ouvrez Instagram : Trouvez la publication, le Reel ou la Story à enregistrer.",
      "Copiez le lien : Cliquez sur le bouton de partage et sélectionnez 'Copier le lien'.",
      "Collez dans ClipKeep : Collez l'URL dans le champ ci-dessus et cliquez sur 'Envoyer'.",
      "Télécharger : Enregistrez le fichier sur votre appareil une fois le traitement terminé."
    ], 
    whyTitle: "Pourquoi ClipKeep", 
    whyBody: "Instagram restreint souvent les téléchargements directs. ClipKeep vous permet d'archiver vos souvenirs préférés en toute sécurité.", 
    whyPoints: ["Haute qualité", "Support Reels", "Anonyme"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "Sauver des Stories ?", a: "Oui, les Stories publiques peuvent être extraites en collant leur lien." },
      { q: "Est-ce anonyme ?", a: "Oui, ClipKeep ne notifie pas les utilisateurs lorsque vous téléchargez leur contenu public." }
    ], 
    galleryTitle: "Récents", 
    trendingTitle: "Tendances" 
  },
  id: { 
    title: "Instagram Downloader", 
    subtitle: "Simpan Reel, Story, dan foto dari Instagram dengan kualitas tinggi.", 
    statusLabel: "Status", 
    helpPage: "Bantuan", 
    howToTitle: "Cara unduh", 
    howToSteps: [
      "Buka Instagram: Cari postingan, Reel, atau Story yang ingin Anda simpan.",
      "Salin Tautan: Klik tombol bagikan dan pilih 'Salin Tautan'.",
      "Tempel di ClipKeep: Tempel URL ke kolom di atas dan klik 'Kirim'.",
      "Unduh: Simpan media ke perangkat Anda setelah proses selesai."
    ], 
    whyTitle: "Kelebihan", 
    whyBody: "Instagram sering membatasi unduhan langsung. ClipKeep memungkinkan Anda mengarsipkan kenangan favorit dengan aman.", 
    whyPoints: ["Kualitas Tinggi", "Mendukung Reels", "Tanpa Login"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "Simpan Story?", a: "Ya, Story publik dapat diekstrak dengan menempelkan tautannya." },
      { q: "Apakah anonim?", a: "Ya, ClipKeep tidak memberi tahu pengguna saat Anda mengunduh konten publik mereka." }
    ], 
    galleryTitle: "Terbaru", 
    trendingTitle: "Tren" 
  },
  hi: { 
    title: "इंस्टाग्राम डाउनलोडर", 
    subtitle: "रील्स और फोटो को हाई क्वालिटी में डाउनलोड करें", 
    statusLabel: "स्थिति", 
    helpPage: "सहायता", 
    howToTitle: "डाउनलोड कैसे करें", 
    howToSteps: [
      "इंस्टाग्राम खोलें: वह पोस्ट ढूंढें जिसे आप सेव करना चाहते हैं।",
      "लिंक कॉपी करें: 'लिंक कॉपी करें' चुनें।",
      "ClipKeep में पेस्ट करें: ऊपर दिए गए फ़ील्ड में URL पेस्ट करें और 'सबमिट' पर क्लिक करें।",
      "डाउनलोड करें: मीडिया को अपने डिवाइस पर सेव करें।"
    ], 
    whyTitle: "फायदे", 
    whyBody: "इंस्टाग्राम अक्सर डायरेक्ट डाउनलोड को रोकता है। ClipKeep आपको अपनी यादों को सुरक्षित रूप से सहेजने में मदद करता है।", 
    whyPoints: ["हाई क्वालिटी", "रील्स सपोर्ट", "सुरक्षित"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "स्टोरीज सेव करें?", a: "हाँ, सार्वजनिक स्टोरीज को उनके लिंक द्वारा निकाला जा सकता है।" },
      { q: "क्या यह गुमनाम है?", a: "हाँ, उपयोगकर्ताओं को कोई सूचना नहीं भेजी जाती है।" }
    ], 
    galleryTitle: "नवीनतम", 
    trendingTitle: "ट्रेंडिंग" 
  },
  de: { 
    title: "Instagram Downloader", 
    subtitle: "Speichere Reels und Fotos in hoher Qualität", 
    statusLabel: "Status", 
    helpPage: "Hilfe", 
    howToTitle: "Anleitung", 
    howToSteps: [
      "Instagram öffnen: Suche den Post, das Reel oder die Story.",
      "Link kopieren: Wähle 'Link kopieren'.",
      "In ClipKeep einfügen: URL oben einfügen und 'Senden' klicken.",
      "Download: Speichere die Datei auf deinem Gerät."
    ], 
    whyTitle: "Vorteile", 
    whyBody: "Instagram schränkt Downloads oft ein. ClipKeep ermöglicht eine sichere Archivierung.", 
    whyPoints: ["Hohe Qualität", "Reels Unterstützung", "Sicher"], 
    faqTitle: "FAQ", 
    faqItems: [
      { q: "Stories speichern?", a: "Ja, öffentliche Stories können extrahiert werden." },
      { q: "Ist es anonym?", a: "Ja, es erfolgt keine Benachrichtigung an den Urheber." }
    ], 
    galleryTitle: "Neueste", 
    trendingTitle: "Trends" 
  },
  tr: { 
    title: "Instagram İndirici", 
    subtitle: "Instagram Reels ve fotoğraflarını indir", 
    statusLabel: "Durum", 
    helpPage: "Yardım", 
    howToTitle: "Nasıl indirilir", 
    howToSteps: [
      "Instagram'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.",
      "Bağlantıyı Kopyalayın: 'Bağlantıyı Kopyala'yı seçin.",
      "ClipKeep'e Yapıştırın: URL'yi yukarıdaki alana yapıştırın ve 'Gönder'e tıklayın.",
      "İndir: Medyayı cihazınıza kaydedin."
    ], 
    whyTitle: "Avantajlar", 
    whyBody: "Instagram genellikle doğrudan indirmeleri kısıtlar. ClipKeep güvenli bir arşivleme sunar.", 
    whyPoints: ["Yüksek Kalite", "Reels Desteği", "Güvenli"], 
    faqTitle: "SSS", 
    faqItems: [
      { q: "Hikayeler?", a: "Evet, kamuya açık hikayeler indirilebilir." },
      { q: "Anonim mi?", a: "Evet, karşı tarafa bildirim gitmez." }
    ], 
    galleryTitle: "Son", 
    trendingTitle: "Popüler" 
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
  es: {
    title: 'Servicio limitado',
    body: 'Tráfico elevado detectado.',
    reasonLabel: 'Motivo',
    retryAfter: 'Reintentar después',
    openGuide: 'Abrir guía',
    reasons: {
      manual: 'Manual',
      error_ratio: 'Error',
      queue_wait: 'Cola',
      active_jobs: 'Tareas',
      recovered: 'Recuperado',
      none: 'Ninguno',
    },
  },
  pt: {
    title: 'Serviço Limitado',
    body: 'Alta demanda detectada.',
    reasonLabel: 'Motivo',
    retryAfter: 'Tentar após',
    openGuide: 'Abrir guia',
    reasons: {
      manual: 'Manual',
      error_ratio: 'Erro',
      queue_wait: 'Fila',
      active_jobs: 'Jobs',
      recovered: 'Recuperado',
      none: 'Nada',
    },
  },
  fr: {
    title: 'Service limité',
    body: 'Trafic important.',
    reasonLabel: 'Motif',
    retryAfter: 'Réessayer après',
    openGuide: 'Ouvrir le guide',
    reasons: {
      manual: 'Manuel',
      error_ratio: 'Erreur',
      queue_wait: 'Attente',
      active_jobs: 'Actifs',
      recovered: 'Récupéré',
      none: 'Aucun',
    },
  },
  id: {
    title: 'Layanan Terbatas',
    body: 'Lalu lintas tinggi.',
    reasonLabel: 'Alasan',
    retryAfter: 'Coba lagi setelah',
    openGuide: 'Buka panduan',
    reasons: {
      manual: 'Manual',
      error_ratio: 'Error',
      queue_wait: 'Antrean',
      active_jobs: 'Tugas',
      recovered: 'Pulih',
      none: 'Tidak ada',
    },
  },
  hi: {
    title: 'सीमित सेवा',
    body: 'उच्च ट्रैफिक।',
    reasonLabel: 'कारण',
    retryAfter: 'फिर से प्रयास करें',
    openGuide: 'गाइड खोलें',
    reasons: {
      manual: 'मैनुअल',
      error_ratio: 'त्रुटि',
      queue_wait: 'कतार',
      active_jobs: 'सक्रिय',
      recovered: 'सुधार',
      none: 'कोई नहीं',
    },
  },
  de: {
    title: 'Eingeschränkt',
    body: 'Hohe Last.',
    reasonLabel: 'Grund',
    retryAfter: 'Warten',
    openGuide: 'Anleitung',
    reasons: {
      manual: 'Manuell',
      error_ratio: 'Fehler',
      queue_wait: 'Warten',
      active_jobs: 'Jobs',
      recovered: 'Erholt',
      none: 'Keiner',
    },
  },
  tr: {
    title: 'Sınırlı',
    body: 'Yüksek trafik.',
    reasonLabel: 'Neden',
    retryAfter: 'Warten',
    openGuide: 'Rehber',
    reasons: {
      manual: 'Manuel',
      error_ratio: 'Hata',
      queue_wait: 'Sıra',
      active_jobs: 'Görevler',
      recovered: 'Düzeldi',
      none: 'Yok',
    },
  },
};

export const menuText: Record<Locale, MenuDict> = {
  en: {
    downloads: "DOWNLOAD",
    rankings: "Weekly Ranking",
    latest: "Latest Downloads",
    language: "LANGUAGE",
    more: "MORE",
    twitter: "Twitter (X) Downloader",
    tiktok: "TikTok Downloader",
    telegram: "Telegram Downloader",
    instagram: "Instagram Downloader",
    about: "About",
    faq: "FAQ",
    privacy: "Privacy Policy",
    contact: "Contact Support",
  },
  ar: {
    downloads: "تنزيل",
    rankings: "الترتيب الأسبوعي",
    latest: "آخر التنزيلات",
    language: "اللغة",
    more: "المزيد",
    twitter: "تويتر",
    tiktok: "تيك توك",
    telegram: "تيليجرام",
    instagram: "محمل إنستغرام",
    about: "من نحن",
    faq: "الأسئلة الشائعة",
    privacy: "سياسة الخصوصية",
    contact: "اتصل بنا",
  },
  ja: {
    downloads: "ダウンロード",
    rankings: "週間ランキング",
    latest: "最近のダウンロード",
    language: "言語切り替え",
    more: "その他",
    twitter: "Twitter 保存",
    tiktok: "TikTok 保存",
    telegram: "Telegram 保存",
    instagram: "Instagram 保存",
    about: "サイトについて",
    faq: "よくある質問",
    privacy: "プライバシーポリシー",
    contact: "お問い合わせ",
  },
  es: {
    downloads: "DESCARGAS",
    rankings: "Ranking semanal",
    latest: "Recientes",
    language: "IDIOMA",
    more: "MÁS",
    twitter: "Downloader de Twitter",
    tiktok: "Downloader de TikTok",
    telegram: "Downloader de Telegram",
    instagram: "Downloader de Instagram",
    about: "Sobre nosotros",
    faq: "FAQ",
    privacy: "Privacidad",
    contact: "Contacto"
  },
  pt: {
    downloads: "DOWNLOADS",
    rankings: "Ranking Semanal",
    latest: "Recentes",
    language: "IDIOMA",
    more: "MAIS",
    twitter: "Downloader do Twitter",
    tiktok: "Downloader do TikTok",
    telegram: "Downloader do Telegram",
    instagram: "Downloader do Instagram",
    about: "Sobre",
    faq: "FAQ",
    privacy: "Privacidade",
    contact: "Contato"
  },
  fr: {
    downloads: "TÉLÉCHARGEMENTS",
    rankings: "Classement hebdomadaire",
    latest: "Récents",
    language: "LANGUE",
    more: "PLUS",
    twitter: "Téléchargeur Twitter",
    tiktok: "Téléchargeur TikTok",
    telegram: "Téléchargeur Telegram",
    instagram: "Téléchargeur Instagram",
    about: "À propos",
    faq: "FAQ",
    privacy: "Confidentialité",
    contact: "Contact"
  },
  id: {
    downloads: "UNDUHAN",
    rankings: "Peringkat Mingguan",
    latest: "Terbaru",
    language: "BAHASA",
    more: "LAINNYA",
    twitter: "Pengunduh Twitter",
    tiktok: "Pengunduh TikTok",
    telegram: "Pengunduh Telegram",
    instagram: "Pengunduh Instagram",
    about: "Tentang",
    faq: "FAQ",
    privacy: "Privasi",
    contact: "Kontak"
  },
  hi: {
    downloads: "डाउनलोड",
    rankings: "साप्ताहिक रैंकिंग",
    latest: "नवीनतम डाउनलोड",
    language: "भाषा",
    more: "अधिक",
    twitter: "ट्विटर डाउनलोडर",
    tiktok: "टिकटॉक डाउनलोडर",
    telegram: "टेलीग्राम डाउनलोडर",
    instagram: "इंस्टाग्राम डाउनलोडer",
    about: "बारे में",
    faq: "FAQ",
    privacy: "गोपनीयता नीति",
    contact: "संपर्क"
  },
  de: {
    downloads: "DOWNLOADS",
    rankings: "Wochen-Ranking",
    latest: "Neueste",
    language: "SPRACHE",
    more: "MEHR",
    twitter: "Twitter Downloader",
    tiktok: "TikTok Downloader",
    telegram: "Telegram Downloader",
    instagram: "Instagram Downloader",
    about: "Über uns",
    faq: "FAQ",
    privacy: "Datenschutz",
    contact: "Kontakt"
  },
  tr: {
    downloads: "İNDİRMELER",
    rankings: "Haftalık Sıralama",
    latest: "Son Aramalar",
    language: "DİL",
    more: "DAHA FAZLA",
    twitter: "Twitter İndirici",
    tiktok: "TikTok İndirici",
    telegram: "Telegram İndirici",
    instagram: "Instagram İndirici",
    about: "Hakkında",
    faq: "SSS",
    privacy: "Gizlilik",
    contact: "İletişim"
  }
};

export const galleryPages: Record<Locale, Record<string, GalleryPageDict>> = {
  en: {
    trendingTwitter: {
      title: "Trending Twitter (X) Videos",
      subtitle: "Watch the most popular videos on Twitter today.",
      description: "Discover viral clips, trending news media, and popular Twitter (X) videos. Download them instantly for offline viewing.",
      seoContent: "## Why Twitter videos go viral\nTwitter (X) is the global town square where news breaks and viral moments happen in real-time. Our Trending Twitter Videos page curates the most accessed and engaged content shared across the platform. From breaking news clips to viral memes and high-impact sports highlights, stay up to date with what the world is watching.\n\n## How to download Twitter videos\nClipKeep provides a seamless way not only to discover this content but also to extraction and save it directly to your device. Whether you are a content creator looking for inspiration, a journalist tracking a story, or just looking for entertainment, our real-time ranking ensures you never miss a beat.\n\n## Why use ClipKeep\nOur service is built for speed and reliability. If you want to save these trending videos for offline use or safe keeping, try our [Twitter (X) Downloader](/download-twitter-video?locale=en) directly."
    },
    trendingTiktok: {
      title: "Trending TikTok Videos",
      subtitle: "Viral clips and trending TikToks from around the world.",
      description: "Stay in the loop with the most popular TikTok videos. High-speed extraction for your favorite viral moments.",
      seoContent: "## The Pulse of Modern Culture\nTikTok is the epicenter of modern internet culture, where trends are born and go viral in seconds. Our Trending TikTok Videos section identifies the most popular short-form media currently being extracted by our global user base. Discover high-energy dance challenges and hilarious comedy skits capturing everyone's attention.\n\n## Secure and Fast Archiving\nClipKeep allows you to archive these trending moments in high quality, ensuring that the best of TikTok is always available at your fingertips. For specific video saves, use our [TikTok Downloader](/download-tiktok-video?locale=en) for the most direct media extraction."
    },
    trendingTelegram: {
      title: "Trending Telegram Media",
      subtitle: "Popular videos and files from Telegram channels.",
      description: "Explore the most downloaded media from Telegram's global channels and groups.",
      seoContent: "## Content Discovery in Communities\nTelegram has become a major hub for news, documentaries, and niche community content. The Trending Telegram Media page showcases the most sought-after files and videos being processed from public Telegram channels. Because Telegram content can sometimes be difficult to find directly, ClipKeep acts as a powerful bridge.\n\n## Reliable Telegram Extraction\nOur real-time rankings help you discover valuable digital assets shared by communities across the globe. To save any specific Telegram media you find interesting, head over to our [Telegram Downloader](/download-telegram-video?locale=en)."
    },
    latestTwitter: {
      title: "Latest Twitter (X) Downloads",
      subtitle: "Recently extracted videos from Twitter (X).",
      description: "See what others are downloading from Twitter right now. Explore the latest media being archived on ClipKeep.",
      seoContent: "## The Live Stream of Discovery\nClipKeep's Latest Twitter Downloads gallery shows a real-time feed of public media being processed by our community. This live stream offers a unique window into the diverse range of content currently trending or being discovered across the X (Twitter) ecosystem.\n\n## Build Your Media Archive\nBy seeing what other users are archiving, you can find niche content, new creators, and trending topics you might have otherwise missed. Ready to archive your own found clips? Our [Twitter Video Downloader](/download-twitter-video?locale=en) is ready to help."
    },
    latestTiktok: {
      title: "Latest TikTok Downloads",
      subtitle: "Fresh TikTok content processed by ClipKeep users.",
      description: "A real-time look at the newest TikTok videos being saved for offline use.",
      seoContent: "## Catching the Newest Trends\nThe Latest TikTok Downloads section provides an up-to-the-minute perspective on the videos our community is finding most valuable. As TikTok moves at a lightning pace, our latest feed helps you track new trends as they emerge.\n\n## Efficient Extraction with ClipKeep\nThis gallery acts as a discovery engine, helping you find fresh content from global creators. Once you find a video you need to keep, [ClipKeep's TikTok Extractor](/download-tiktok-video?locale=en) ensures it's indexed and ready for your next viewing session."
    },
    latestTelegram: {
      title: "Latest Telegram Downloads",
      subtitle: "Recent media extracted from Telegram channels.",
      description: "Discover the newest videos and files being archived by Telegram users on ClipKeep.",
      seoContent: "## Live Telegram Media Discovery\nExplore the most recent media files being processed from public Telegram channels. Our real-time gallery provides insights into what information and entertainment is being archived globally.\n\n## High-Quality Archiving\nClipKeep makes it easy to save media that matters. Browse the latest downloads and use our [Telegram Downloader](/download-telegram-video?locale=en) to secure your own copies of viral Telegram content."
    }
  },
  ja: {
    trendingTwitter: {
      title: "Twitter (X) トレンド動画",
      subtitle: "現在、Twitterで最も人気のある動画をチェック。",
      description: "バズっている動画、話題のニュース、人気のTwitter (X) 動画を今すぐ発見。オフライン視聴用に瞬時に保存できます。",
      seoContent: "## Twitterの動画がバズる理由\nTwitter (X) は世界中のニュースやバイラルな瞬間がリアルタイムで発生する場所です。ClipKeepのトレンドTwitter動画ページでは、プラットフォーム上で最もアクセスされ、注目を集めているコンテンツを厳選しています。最新のニュースクリップからトレンドのミーム、迫力あるスポーツのハイライトまで、世界が今何を見ているかを常に把握できます。\n\n## Twitter動画の保存方法\nClipKeepはこれらのコンテンツを発見するだけでなく、直接デバイスに保存するためのシームレスな手段を提供します。インスピレーションを探しているクリエイター、ニュースを追っているジャーナリスト、あるいは単にエンターテインメントを探している方にとって、当サイトのリアルタイムランキングは欠かせないツールとなります。\n\n## ClipKeepを利用するメリット\n高速で安定した抽出を提供します。気に入った動画をオフラインで楽しみたい、あるいは個人の記録として残したい場合は、当サイトの [Twitter動画ダウンローダー](/download-twitter-video?locale=ja) を直接ご利用ください。"
    },
    trendingTiktok: {
      title: "TikTok トレンド動画",
      subtitle: "世界中でバズっている最新のTikTok動画。",
      description: "人気のTikTok動画を今すぐチェック。話題の瞬間を高品質でダウンロードできます。",
      seoContent: "## 現代文化の鼓動をキャッチ\nTikTokは現代のインターネット文化の中心地であり、トレンドが秒単位で生まれ、拡散される場所です。トレンドTikTok動画セクションでは、ClipKeepのユーザーベースによって現在最も多く抽出されているショート動画を特定しています。今みんなが注目しているビデオを発見してください。\n\n## 安全かつ高速なアーカイブ\nClipKeepを使用すれば、これらのトレンドの瞬間を高品質でアーカイブでき、インターネット接続がなくても常に最高のTikTokコンテンツを楽しむことができます。特定の動画を保存するには、[TikTokダウンローダー](/download-tiktok-video?locale=ja) を使用するのが最も確実です。"
    },
    trendingTelegram: {
      title: "Telegram トレンドメディア",
      subtitle: "Telegramチャンネルで人気の動画やファイル。",
      description: "Telegramのグローバルなチャンネルやグループで、最もダウンロードされているメディアを探索しましょう。",
      seoContent: "## コミュニティ内のコンテンツ発見\nTelegramは、ニュース、ドキュメンタリー、そしてニッチなコミュニティコンテンツの主要な拠点となっています。トレンドTelegramメディアページでは、公開チャネルから処理されている最も人気の高いファイルや動画を紹介しています。ClipKeepは、見つけにくいメディアへの強力なブリッジとして機能します。\n\n## 信頼できる抽出機能\nリアルタイムランキングを通じて、世界中のコミュニティで共有されている価値あるデジタル資産を発見してください。気になるメディアがあれば、[Telegramダウンローダー](/download-telegram-video?locale=ja) で保存できます。"
    },
    latestTwitter: {
      title: "Twitter (X) 最近のダウンロード",
      subtitle: "ClipKeepで最近抽出されたTwitter (X) 動画。",
      description: "他のユーザーが今何をダウンロードしているかを確認。ClipKeepでアーカイブされている最新メディアを探索しましょう。",
      seoContent: "## リアルタイムの発見フィード\n最新のTwitterダウンロードギャラリーは、ClipKeepのコミュニティによって処理されている公開メディアのリアルタイムフィードを表示します。このライブストリームは、X (Twitter) のエコシステム全体で新たに発見されている多様なコンテンツへの窓口となります。\n\n## 自分だけのメディアアーカイブを構築\n他のユーザーが何をアーカイブしているかを見ることで、新しいトレンドトピックを見つけることができます。自分で見つけた動画を保存する準備はいいですか？当サイトの [Twitter動画ダウンローダー](/download-twitter-video?locale=ja) がお手伝いします。"
    },
    latestTiktok: {
      title: "TikTok 最近のダウンロード",
      subtitle: "ClipKeepユーザーによって抽出された最新のTikTokコンテンツ。",
      description: "オフライン保存用に新しく保存されたTikTok動画をリアルタイムで表示。",
      seoContent: "## 最新トレンドを逃さない\n最新のTikTokダウンロードセクションは、コミュニティが今最も価値を感じている動画をリアルタイムで提供します。TikTokの変化は速いため、このフィードは新しいトレンドを捉えるのに役立ちます。\n\n## ClipKeepによる効率的な抽出\nこのギャラリーは、新鮮なコンテンツやクリエイティブなアイデアを見つける発見エンジンです。保存したい動画が見つかったら、[TikTok抽出ツール](/download-tiktok-video?locale=ja) で保存してください。"
    },
    latestTelegram: {
      title: "Telegram 最近のダウンロード",
      subtitle: "最近抽出されたTelegramメディア。",
      description: "ClipKeepユーザーがTelegramチャンネルから新しく保存した動画やファイルを探索しましょう。",
      seoContent: "## Telegramメディアの最新発見\n公開チャネルから処理されている最新のメディアファイルを探索。世界中でどのような情報やエンターテインメントがアーカイブされているかをリアルタイムで把握できます。\n\n## 高品質なメディア保存\nClipKeepは重要なメディアの保存を容易にします。最新のダウンロードをチェックし、[Telegramダウンローダー](/download-telegram-video?locale=ja) を使用して話題のTelegramコンテンツを自分のものにしましょう。"
    }
  },
  ar: {
    trendingTwitter: { title: "فيديوهات تويتر (X) الرائجة", subtitle: "شاهد أشهر فيديوهات تويتر اليوم.", description: "اكتشف المقاطع المنتشرة وأخبار تويتر." },
    trendingTiktok: { title: "فيديوهات تيك توك الرائجة", subtitle: "أشهر مقاطع تيك توك من حول العالم.", description: "تابع أحدث صيحات تيك توك." },
    trendingTelegram: { title: "وسائط تيليجرام الرائجة", subtitle: "الفيديوهات والملفات الشهيرة من قنوات تيليجرام.", description: "استكشف الوسائط الأكثر تحميلاً." },
    latestTwitter: { title: "آخر تنزيلات تويتر (X)", subtitle: "فيديوهات تويتر التي تم استخراجها مؤخراً.", description: "شاهد ما يتم تحميله الآن." },
    latestTiktok: { title: "آخر تنزيلات تيك توك", subtitle: "أحدث مقاطع تيك توك المعالجة.", description: "اكتشف المحتوى الجديد." },
    latestTelegram: { title: "آخر تنزيلات تيليجرام", subtitle: "وسائط تيليجرام التي تم استخراجها مؤخراً.", description: "أحدث ملفات قنوات تيليجرام." }
  },
  es: {
    trendingTwitter: { title: "Tendencias de Twitter (X)", subtitle: "Mira los videos más populares de Twitter hoy.", description: "Descubre clips virales y noticias de Twitter (X)." },
    trendingTiktok: { title: "Tendencias de TikTok", subtitle: "Clips virales de TikTok de todo el mundo.", description: "Mantente al día con lo más popular." },
    trendingTelegram: { title: "Tendencias de Telegram", subtitle: "Videos y archivos populares de canales de Telegram.", description: "Explora los archivos más descargados." },
    latestTwitter: { title: "Últimas descargas de Twitter (X)", subtitle: "Videos de Twitter extraídos recientemente.", description: "Mira lo que otros están descargando." },
    latestTiktok: { title: "Últimas descargas de TikTok", subtitle: "Video de TikTok procesados recientemente.", description: "Mira el contenido más nuevo." },
    latestTelegram: { title: "Últimas descargas de Telegram", subtitle: "Media de Telegram extraída recientemente.", description: "Descubre los archivos más nuevos." }
  },
  pt: {
    trendingTwitter: { title: "Tendências do Twitter (X)", subtitle: "Veja os vídeos mais populares do Twitter hoje.", description: "Descubra clipes virais e notícias do Twitter (X)." },
    trendingTiktok: { title: "Tendências do TikTok", subtitle: "Clipes virais do TikTok de todo o mundo.", description: "Fique por dentro do que é popular." },
    trendingTelegram: { title: "Tendências do Telegram", subtitle: "Vídeos e arquivos populares de canais do Telegram.", description: "Explore as mídias mais baixadas." },
    latestTwitter: { title: "Últimos downloads do Twitter (X)", subtitle: "Vídeos do Twitter extraídos recentemente.", description: "Veja o que outros estão baixando." },
    latestTiktok: { title: "Últimos downloads do TikTok", subtitle: "Conteúdo do TikTok processado recentemente.", description: "Veja o conteúdo mais novo." },
    latestTelegram: { title: "Últimos downloads do Telegram", subtitle: "Mídia do Telegram extraída recentemente.", description: "Descubra os arquivos novos." }
  },
  fr: {
    trendingTwitter: { title: "Tendances Twitter (X)", subtitle: "Regardez les vidéos Twitter les plus populaires.", description: "Découvrez les clips viraux et l'actualité de Twitter (X)." },
    trendingTiktok: { title: "Tendances TikTok", subtitle: "Clips viraux TikTok du monde entier.", description: "Restez au courant des nouveautés." },
    trendingTelegram: { title: "Tendances Telegram", subtitle: "Vidéos et fichiers populaires des canaux Telegram.", description: "Explorez les médias les plus téléchargés." },
    latestTwitter: { title: "Derniers téléchargements Twitter (X)", subtitle: "Vidéos Twitter extraites récemment.", description: "Voyez ce que les autres téléchargent." },
    latestTiktok: { title: "Derniers téléchargements TikTok", subtitle: "Contenu TikTok traité récemment.", description: "Regardez les nouveaux contenus." },
    latestTelegram: { title: "Derniers téléchargements Telegram", subtitle: "Médias Telegram extraits récemment.", description: "Découvrez les fichiers récents." }
  },
  id: {
    trendingTwitter: { title: "Tren Video Twitter (X)", subtitle: "Tonton video Twitter paling populer hari ini.", description: "Temukan klip viral dan berita Twitter (X)." },
    trendingTiktok: { title: "Tren Video TikTok", subtitle: "Klip viral TikTok dari seluruh dunia.", description: "Tetap update dengan tren terbaru." },
    trendingTelegram: { title: "Tren Media Telegram", subtitle: "Video dan file populer dari saluran Telegram.", description: "Jelajahi media yang paling banyak diunduh." },
    latestTwitter: { title: "Unduhan Twitter (X) Terbaru", subtitle: "Video Twitter yang baru saja diekstrak.", description: "Lihat apa yang diunduh orang lain." },
    latestTiktok: { title: "Unduhan TikTok Terbaru", subtitle: "Konten TikTok yang baru saja diproses.", description: "Lihat konten TikTok terbaru." },
    latestTelegram: { title: "Unduhan Telegram Terbaru", subtitle: "Media Telegram yang baru saja diekstrak.", description: "Temukan file Telegram terbaru." }
  },
  hi: {
    trendingTwitter: { title: "ट्रेंडिंग ट्विटर (X) वीडियो", subtitle: "आज ट्विटर पर सबसे लोकप्रिय वीडियो देखें।", description: "वायरल क्लिप और ट्विटर समाचार खोजें।" },
    trendingTiktok: { title: "ट्रेंडिंग टिकटॉक वीडियो", subtitle: "दुनिया भर के वायरल टिकटॉक क्लिप।", description: "नवीनतम टिकटॉक ट्रेंड्स के साथ बने रहें।" },
    trendingTelegram: { title: "ट्रेंडिंग टेलीग्राम मीडिया", subtitle: "टेलीग्राम चैनलों से लोकप्रिय वीडियो और फाइलें।", description: "सबसे अधिक डाउनलोड किए गए मीडिया को एक्सप्लोर करें।" },
    latestTwitter: { title: "नवीनतम ट्विटर (X) डाउनलोड", subtitle: "हाल ही में ट्विटर से एक्सट्रैक्ट किए गए वीडियो।", description: "देखें कि दूसरे क्या डाउनलोड कर रहे हैं।" },
    latestTiktok: { title: "नवीनतम टिकटॉक डाउनलोड", subtitle: "अभी संसाधित किए गए नए टिकटॉक वीडियो।", description: "नवीनतम टिकटॉक कंटेंट देखें।" },
    latestTelegram: { title: "नवीनतम टेलीग्राम डाउनलोड", subtitle: "हाल ही में टेलीग्राम से निकाले गए मीडिया।", description: "नई टेलीग्राम फाइलें खोजें।" }
  },
  de: {
    trendingTwitter: { title: "Trending Twitter (X) Videos", subtitle: "Die beliebtesten Twitter-Videos von heute.", description: "Entdecke virale Clips und Twitter-News." },
    trendingTiktok: { title: "Trending TikTok Videos", subtitle: "Virale TikTok-Clips aus aller Welt.", description: "Bleib über aktuelle Trends informiert." },
    trendingTelegram: { title: "Trending Telegram Medien", subtitle: "Beliebte Videos von Telegram-Kanälen.", description: "Entdecke die meistgeladenen Dateien." },
    latestTwitter: { title: "Neueste Twitter (X) Downloads", subtitle: "Kürzlich extrahierte Twitter-Videos.", description: "Sieh dir an, was andere gerade laden." },
    latestTiktok: { title: "Neueste TikTok Downloads", subtitle: "Frisch verarbeitete TikTok-Clips.", description: "Entdecke den neuesten Content." },
    latestTelegram: { title: "Neueste Telegram Downloads", subtitle: "Kürzlich extrahierte Telegram-Medien.", description: "Finde neue Telegram-Dateien." }
  },
  tr: {
    trendingTwitter: { title: "Popüler Twitter (X) Videoları", subtitle: "Bugün Twitter'daki en popüler videolar.", description: "Viral klipleri ve popüler Twitter haberlerini keşfedin." },
    trendingTiktok: { title: "Popüler TikTok Videoları", subtitle: "Dünyanın her yerinden viral TikTok videoları.", description: "En son trendlerden haberdar olun." },
    trendingTelegram: { title: "Popüler Telegram Medyaları", subtitle: "Telegram kanallarındaki popüler dosyalar.", description: "En çok indirilen medyaları keşfedin." },
    latestTwitter: { title: "Son Twitter (X) İndirmeleri", subtitle: "Yeni ayıklanan Twitter videoları.", description: "Diğerlerinin ne indirdiğine bakın." },
    latestTiktok: { title: "Son TikTok İndirmeleri", subtitle: "Yeni işlenen TikTok içerikleri.", description: "En yeni TikTok videolarına göz atın." },
    latestTelegram: { title: "Son Telegram İndirmeleri", subtitle: "Yeni ayıklanan Telegram medyaları.", description: "En yeni Telegram dosyalarını bulun." }
  }
};
