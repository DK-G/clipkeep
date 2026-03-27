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

export const localeNativeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ja: "日本語",
  es: "Español",
  pt: "Português",
  fr: "Français",
  id: "Bahasa Indonesia",
  hi: "हिंदी",
  de: "Deutsch",
  tr: "Türkçe",
};

type HomeDict = {
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

export const homeText: Record<Locale, HomeDict> = {
  en: {
    title: "Video Downloader & Extractor",
    subtitle: "Discover downloader tools for major social platforms in one place.",
    platformLabel: "Platform",
    sourceUrlLabel: "Source URL",
    localeLabel: "Locale",
    submit: "Start Extract",
    submitting: "Submitting...",
    status: "Status",
    initialMessage: "Paste a supported post URL and start extraction.",
    creatingJob: "Creating extraction job...",
    degradedMessage: "Extractor is temporarily limited. Please check solution guidance.",
    invalidRequest: "Extraction failed. Check URL/platform.",
    demoButton: "Try Demo",
    successRateTikTok: "100% Success",
    successRateX: "95% Success",
    instagramMaintenanceAlternative: "Instagram is under maintenance. Try TikTok!",
    networkError: "Network error while creating job.",
    helpPage: "Help page",
    supportedTools: "Supported Tools",
    telegramTitle: "Telegram Downloader",
    telegramDesc: "Save videos and media from Telegram channels and groups.",
    twitterTitle: "Twitter (X) Downloader",
    twitterDesc: "Archive videos and GIFs from X/Twitter posts instantly.",
    tiktokTitle: "TikTok Downloader",
    tiktokDesc: "Download TikTok videos and images for offline archiving.",
    globalTrending: "Global Trending Hub",
    globalTrendingSubtitle: "Discover popular clips across all platforms.",
    redditTitle: "Reddit Downloader",
    redditDesc: "Download videos and media from Reddit communities.",
    pinterestTitle: "Pinterest Downloader",
    pinterestDesc: "Download high-quality video pins and images.",
    threadsTitle: "Threads Downloader",
    threadsDesc: "Archive videos and media from Threads posts.",
    blueskyTitle: "Bluesky Downloader",
    blueskyDesc: "Save videos and images from the Bluesky social network.",
    lemon8Title: "Lemon8 Downloader",
    lemon8Desc: "Download aesthetic videos and photos from Lemon8.",
    bilibiliTitle: "Bilibili Downloader",
    bilibiliDesc: "Extract clips and animations from Bilibili.",
    discordTitle: "Discord Media Saver",
    discordDesc: "Save videos and images shared via Discord CDN links.",
    facebookTitle: "Facebook Downloader",
    facebookDesc: "Save Facebook videos and stories.",
    historyTitle: "Your Recent Downloads",
    clearHistory: "Clear History"
  },
  ar: {
    title: "أداة ClipKeep",
    subtitle: "اكتشف أدوات التنزيل لأهم المنصات الاجتماعية من مكان واحد.",
    platformLabel: "المنصة",
    sourceUrlLabel: "رابط المصدر",
    localeLabel: "اللغة",
    submit: "ابدأ الاستخراج",
    submitting: "جارٍ الإرسال...",
    status: "الحالة",
    initialMessage: "ألصق رابط منشور مدعوم وابدأ الاستخراج.",
    creatingJob: "جارٍ إنشاء مهمة الاستخراج...",
    degradedMessage: "الخدمة محدودة مؤقتًا. راجع صفحة الحلول.",
    invalidRequest: "فشل الطلب. تحقق من الرابط/المنصة ثم أعد المحاولة.",
    instagramMaintenanceAlternative: "إنستغرام تحت الصيانة. جرب تيك توك بدلاً من ذلك!",
    successRateX: "نجاح %95",
    successRateTikTok: "نجاح %100",
    demoButton: "تجربة ديمو",
    networkError: "خطأ شبكة أثناء إنشاء المهمة.",
    helpPage: "صفحة المساعدة",
    supportedTools: "الأدوات المدعومة",
    telegramTitle: "محمل فيديوهات تيليجرام",
    telegramDesc: "احفظ الفيديوهات والوسائط من قنوات ومجموعات تيليجرام.",
    twitterTitle: "محمل فيديوهات تويتر (X)",
    twitterDesc: "أرشف الفيديوهات والصور المتحركة من منشورات X/تويتر فوراً.",
    tiktokTitle: "محمل فيديوهات تيك توك",
    tiktokDesc: "استخراج فيديو وصوت عالي الجودة من TikTok.",
    globalTrending: "مركز الترند العالمي",
    globalTrendingSubtitle: "اكتشف المقاطع الشائعة عبر جميع المنصات.",
    redditTitle: "محمل فيديوهات Reddit",
    redditDesc: "قم بتنزيل مقاطع الفيديو والوسائط من مجتمعات Reddit.",
    pinterestTitle: "محمل فيديوهات Pinterest",
    pinterestDesc: "قم بتنزيل دبابيس الفيديو والصور عالية الجودة.",
    threadsTitle: "محمل فيديوهات Threads",
    threadsDesc: "أرشف فيديوهات ووسائط من منشورات Threads.",
    blueskyTitle: "محمل فيديوهات Bluesky",
    blueskyDesc: "احفظ الفيديوهات والصور من شبكة Bluesky الاجتماعية.",
    lemon8Title: "محمل فيديوهات Lemon8",
    lemon8Desc: "قم بتنزيل الفيديوهات والصور الجمالية من Lemon8.",
    bilibiliTitle: "محمل فيديوهات Bilibili",
    bilibiliDesc: "استخرج المقاطع والرسوم المتحركة من Bilibili.",
    discordTitle: "حافظ وسائط Discord",
    discordDesc: "احفظ الفيديوهات والصور المشاركة عبر روابط Discord CDN.",
    facebookTitle: "محمل فيسبوك",
    facebookDesc: "حفظ فيديوهات وقصص فيسبوك.",
    historyTitle: "سجل التنزيلات الأخير",
    clearHistory: "مسح السجل"
  },
  ja: {
    title: "SNS動画ダウンローダー",
    subtitle: "主要SNS向けの保存ツールをひとつのハブにまとめています。",
    platformLabel: "プラットフォーム",
    sourceUrlLabel: "動画URL",
    localeLabel: "言語",
    submit: "抽出を開始",
    submitting: "送信中...",
    status: "ステータス",
    initialMessage: "対応している投稿URLを貼り付けて抽出を開始してください。",
    creatingJob: "抽出ジョブを作成中...",
    degradedMessage: "現在抽出機能が制限されています。解決ガイドを確認してください。",
    invalidRequest: "リクエストに失敗しました。URLとプラットフォームを確認してください。",
    instagramMaintenanceAlternative: "Instagramは現在メンテナンス中です。代わりにTikTokをお試しください！",
    successRateX: "成功率95%",
    successRateTikTok: "成功率100%",
    demoButton: "デモを試す",
    networkError: "ネットワークエラーが発生しました。",
    helpPage: "ヘルプページ",
    supportedTools: "対応ツール",
    telegramTitle: "Telegram ダウンローダー",
    telegramDesc: "Telegramのチャンネルやグループから動画やメディアを保存します。",
    twitterTitle: "Twitter (X) ダウンローダー",
    twitterDesc: "X/Twitterの投稿から動画やGIFを瞬時にアーカイブします。",
    tiktokTitle: "TikTok ダウンローダー",
    tiktokDesc: "TikTokから高品質な動画と音声を抽出します。",
    globalTrending: "グローバルトレンドハブ",
    globalTrendingSubtitle: "すべてのプラットフォームから人気のクリップを公開。",
    redditTitle: "Reddit ダウンローダー",
    redditDesc: "Redditのコミュニティから動画やメディアを保存します。",
    pinterestTitle: "Pinterest ダウンローダー",
    pinterestDesc: "高画質な動画ピンや画像をダウンロードします。",
    threadsTitle: "Threads ダウンローダー",
    threadsDesc: "Threads の投稿から動画やメディアをアーカイブします。",
    blueskyTitle: "Bluesky ダウンローダー",
    blueskyDesc: "Bluesky SNSから動画や画像を保存します。",
    lemon8Title: "Lemon8 ダウンローダー",
    lemon8Desc: "Lemon8からおしゃれな動画や写真をダウンロードします。",
    bilibiliTitle: "Bilibili ダウンローダー",
    bilibiliDesc: "Bilibiliから動画クリップやアニメーションを抽出します。",
    discordTitle: "Discord メディア保存",
    discordDesc: "Discord CDN経由で共有された動画や画像を保存します。",
    facebookTitle: "Facebook 保存",
    facebookDesc: "Facebookの動画やストーリーを保存します。",
    historyTitle: "最近のダウンロード履歴",
    clearHistory: "履歴を削除"
  },
  es: {
    title: "ClipKeep Extractor",
    subtitle: "Descubre herramientas de descarga para las principales plataformas sociales en un solo lugar.",
    platformLabel: "Plataforma",
    sourceUrlLabel: "URL de origen",
    localeLabel: "Idioma",
    submit: "Iniciar extracción",
    submitting: "Enviando...",
    status: "Estado",
    initialMessage: "Pega una URL compatible y empieza la extracción.",
    creatingJob: "Creando tarea de extracción...",
    degradedMessage: "El extractor está limitado temporalmente. Consulte la guía.",
    invalidRequest: "Error. Verifique la URL/plataforma e intente de nuevo.",
    instagramMaintenanceAlternative: "Instagram en mantenimiento. ¡Prueba TikTok en su lugar!",
    successRateX: "95% Éxito",
    successRateTikTok: "100% Éxito",
    demoButton: "Probar Demo",
    networkError: "Error de red al crear la tarea.",
    helpPage: "Ayuda",
    supportedTools: "Herramientas soportadas",
    telegramTitle: "Descargador de Telegram",
    telegramDesc: "Guarde videos y archivos de canales y grupos de Telegram.",
    twitterTitle: "Descargador de Twitter (X)",
    twitterDesc: "Archive videos y GIFs de X/Twitter al instante.",
    tiktokTitle: "Descargador de TikTok",
    tiktokDesc: "Descargue videos de TikTok para verlos sin conexión.",
    globalTrending: "Hub de tendencias globales",
    globalTrendingSubtitle: "Descubre clips populares en todas las plataformas.",
    redditTitle: "Descargador de Reddit",
    redditDesc: "Descarga videos y medios de comunidades de Reddit.",
    pinterestTitle: "Descargador de Pinterest",
    pinterestDesc: "Descarga pines de video e imágenes de alta calidad.",
    threadsTitle: "Descargador de Threads",
    threadsDesc: "Archiva videos y medios de publicaciones de Threads.",
    blueskyTitle: "Descargador de Bluesky",
    blueskyDesc: "Guarda videos e imágenes de la red social Bluesky.",
    lemon8Title: "Descargador de Lemon8",
    lemon8Desc: "Descarga videos y fotos estéticas de Lemon8.",
    bilibiliTitle: "Descargador de Bilibili",
    bilibiliDesc: "Extrae clips y animaciones de Bilibili.",
    discordTitle: "Guardador de medios de Discord",
    discordDesc: "Guarda videos e imágenes compartidos vía enlaces CDN de Discord.",
    facebookTitle: "Descargador de Facebook",
    facebookDesc: "Guarda videos y reels de Facebook.",
    historyTitle: "Tus descargas recientes",
    clearHistory: "Borrar historial"
  },
  pt: {
    title: "ClipKeep Extractor",
    subtitle: "Descubra ferramentas de download para as principais plataformas sociais em um só lugar.",
    platformLabel: "Plataforma",
    sourceUrlLabel: "URL de origem",
    localeLabel: "Idioma",
    submit: "Iniciar extração",
    submitting: "Enviando...",
    status: "Status",
    initialMessage: "Cole uma URL compatível e inicie a extração.",
    creatingJob: "Criando tarefa de extração...",
    degradedMessage: "Extrator temporariamente limitado. Verifique a solução.",
    invalidRequest: "Falha na solicitação. Verifique URL/plataforma.",
    instagramMaintenanceAlternative: "Instagram em manutenção. Tente o TikTok!",
    successRateX: "95% Sucesso",
    successRateTikTok: "100% Sucesso",
    demoButton: "Testar Demo",
    networkError: "Erro de rede ao criar tarefa.",
    helpPage: "Ajuda",
    supportedTools: "Ferramentas suportadas",
    telegramTitle: "Downloader do Telegram",
    telegramDesc: "Salve vídeos e mídia de canais e grupos do Telegram.",
    twitterTitle: "Downloader do Twitter (X)",
    twitterDesc: "Arquive vídeos e GIFs do X/Twitter instantaneamente.",
    tiktokTitle: "Downloader do TikTok",
    tiktokDesc: "Baixe vídeos do TikTok para visualização offline.",
    globalTrending: "Hub de tendências globais",
    globalTrendingSubtitle: "Descubra clipes populares em todas as plataformas.",
    redditTitle: "Downloader do Reddit",
    redditDesc: "Baixe vídeos e mídia de comunidades do Reddit.",
    pinterestTitle: "Downloader do Pinterest",
    pinterestDesc: "Baixe pins de vídeo e imagens de alta qualidade.",
    threadsTitle: "Downloader do Threads",
    threadsDesc: "Arquive vídeos e mídias de postagens do Threads.",
    blueskyTitle: "Downloader do Bluesky",
    blueskyDesc: "Salve vídeos e imagens da rede social Bluesky.",
    lemon8Title: "Downloader do Lemon8",
    lemon8Desc: "Baixe vídeos e fotos estéticas do Lemon8.",
    bilibiliTitle: "Downloader do Bilibili",
    bilibiliDesc: "Extraia clipes e animações do Bilibili.",
    discordTitle: "Protetor de mídia do Discord",
    discordDesc: "Salve vídeos e imagens compartilhados via links CDN do Discord.",
    facebookTitle: "Downloader do Facebook",
    facebookDesc: "Salve vídeos e stories do Facebook.",
    historyTitle: "Seus downloads recentes",
    clearHistory: "Limpar histórico"
  },
  fr: {
    title: "ClipKeep Extractor",
    subtitle: "Retrouvez au même endroit les outils de téléchargement pour les principales plateformes sociales.",
    platformLabel: "Plateforme",
    sourceUrlLabel: "URL source",
    localeLabel: "Langue",
    submit: "Démarrer l'extraction",
    submitting: "Envoi...",
    status: "État",
    initialMessage: "Collez une URL prise en charge et lancez l'extraction.",
    creatingJob: "Création de la tâche d'extraction...",
    degradedMessage: "L'extracteur est temporairement limité. Consultez l'aide.",
    invalidRequest: "Échec. Vérifiez l'URL/plateforme et réessayez.",
    instagramMaintenanceAlternative: "Instagram en maintenance. Essayez TikTok à la place !",
    successRateX: "95% Succès",
    successRateTikTok: "100% Succès",
    demoButton: "Essayer la démo",
    networkError: "Erreur réseau lors de la création de la tâche.",
    helpPage: "Aide",
    supportedTools: "Outils pris en charge",
    telegramTitle: "Téléchargeur Telegram",
    telegramDesc: "Enregistrez des vidéos de canaux et groupes Telegram.",
    twitterTitle: "Téléchargeur Twitter (X)",
    twitterDesc: "Archivez instantanément des vidéos et GIFs de X/Twitter.",
    tiktokTitle: "Téléchargeur TikTok",
    tiktokDesc: "Téléchargez des vidéos TikTok pour une lecture hors ligne.",
    globalTrending: "Hub des tendances mondiales",
    globalTrendingSubtitle: "Découvrez les clips populaires sur toutes les plateformes.",
    redditTitle: "Téléchargeur Reddit",
    redditDesc: "Téléchargez des vidéos et des médias des communautés Reddit.",
    pinterestTitle: "Téléchargeur Pinterest",
    pinterestDesc: "Téléchargez des épingles vidéo et des images de haute qualité.",
    threadsTitle: "Téléchargeur Threads",
    threadsDesc: "Archivez des vidéos et des médias des publications Threads.",
    blueskyTitle: "Téléchargeur Bluesky",
    blueskyDesc: "Enregistrez des vidéos et des images du réseau social Bluesky.",
    lemon8Title: "Téléchargeur Lemon8",
    lemon8Desc: "Téléchargez des vidéos et des photos esthétiques de Lemon8.",
    bilibiliTitle: "Téléchargeur Bilibili",
    bilibiliDesc: "Extrayez des clips et des animations de Bilibili.",
    discordTitle: "Sauveur de médias Discord",
    discordDesc: "Enregistrez les vidéos et les images partagées via les liens Discord CDN.",
    facebookTitle: "Téléchargeur Facebook",
    facebookDesc: "Enregistrez des vidéos et stories Facebook.",
    historyTitle: "Vos téléchargements récents",
    clearHistory: "Effacer l'historique"
  },
  id: {
    title: "ClipKeep Extractor",
    subtitle: "Temukan alat unduh untuk berbagai platform sosial utama di satu tempat.",
    platformLabel: "Platform",
    sourceUrlLabel: "URL Sumber",
    localeLabel: "Bahasa",
    submit: "Mulai Ekstrak",
    submitting: "Mengirim...",
    status: "Status",
    initialMessage: "Tempel URL posting yang didukung lalu mulai ekstraksi.",
    creatingJob: "Membuat tugas ekstraksi...",
    degradedMessage: "Ekstraktor terbatas sementara. Periksa panduan solusi.",
    invalidRequest: "Permintaan gagal. Periksa URL/platform.",
    instagramMaintenanceAlternative: "Instagram sedang dalam pemeliharaan. Coba TikTok saja!",
    successRateX: "95% Berhasil",
    successRateTikTok: "100% Berhasil",
    demoButton: "Coba Demo",
    networkError: "Kesalahan jaringan saat membuat tugas.",
    helpPage: "Bantuan",
    supportedTools: "Alat yang didukung",
    telegramTitle: "Pengunduh Telegram",
    telegramDesc: "Simpan video dan media dari saluran dan grup Telegram.",
    twitterTitle: "Pengunduh Twitter (X)",
    twitterDesc: "Arsip video dan GIF dari postingan X/Twitter secara instan.",
    tiktokTitle: "Pengunduh TikTok",
    tiktokDesc: "Unduh video TikTok untuk arsip offline.",
    globalTrending: "Pusat Tren Global",
    globalTrendingSubtitle: "Temukan klip populer di semua platform.",
    redditTitle: "Pengunduh Reddit",
    redditDesc: "Unduh video dan media dari komunitas Reddit.",
    pinterestTitle: "Pengunduh Pinterest",
    pinterestDesc: "Unduh pin video dan gambar berkualitas tinggi.",
    threadsTitle: "Pengunduh Threads",
    threadsDesc: "Arsipkan video dan media dari postingan Threads.",
    blueskyTitle: "Pengunduh Bluesky",
    blueskyDesc: "Simpan video dan gambar dari jaringan sosial Bluesky.",
    lemon8Title: "Pengunduh Lemon8",
    lemon8Desc: "Unduh video dan foto estetika dari Lemon8.",
    bilibiliTitle: "Pengunduh Bilibili",
    bilibiliDesc: "Ekstrak klip dan animasi dari Bilibili.",
    discordTitle: "Penyimpan Media Discord",
    discordDesc: "Simpan video dan gambar yang dibagikan melalui tautan Discord CDN.",
    facebookTitle: "Pengunduh Facebook",
    facebookDesc: "Simpan video dan cerita Facebook.",
    historyTitle: "Unduhan Terakhir Anda",
    clearHistory: "Hapus Riwayat"
  },
  hi: {
    title: "ClipKeep एक्सट्रैक्टर",
    subtitle: "मुख्य सोशल प्लेटफॉर्म के डाउनलोड टूल एक ही जगह पर पाएं।",
    platformLabel: "प्लेटफॉर्म",
    sourceUrlLabel: "स्रोत URL",
    localeLabel: "भाषा",
    submit: "एक्सट्रैक्शन शुरू करें",
    submitting: "सबमिट हो रहा है...",
    status: "स्थिति",
    initialMessage: "समर्थित पोस्ट URL पेस्ट करें और एक्सट्रैक्शन शुरू करें।",
    creatingJob: "एक्सट्रैक्शन कार्य बनाया जा रहा है...",
    degradedMessage: "एक्सट्रैक्टर अस्थायी रूप से सीमित है। समाधान मार्गदर्शिका देखें।",
    invalidRequest: "अनुरोध विफल। URL/प्लेटफॉर्म की जांच करें।",
    instagramMaintenanceAlternative: "इंस्टाग्राम रखरखाव में है। इसके बजाय टिकटॉक आज़माएं!",
    successRateX: "95% सफलता",
    successRateTikTok: "100% सफलता",
    demoButton: "डेमो आज़माएं",
    networkError: "कार्य बनाते समय नेटवर्क त्रुटि।",
    helpPage: "सहायता",
    supportedTools: "समर्थित उपकरण",
    telegramTitle: "टेलीग्राम डाउनलोडर",
    telegramDesc: "टेलीग्राम चैनलों और समूहों से वीडियो और मीडिया सहेजें।",
    twitterTitle: "ट्विटर (X) डाउनलोडर",
    twitterDesc: "X/ट्विटर पोस्ट से वीडियो और GIF तुरंत आर्काइव करें।",
    tiktokTitle: "टिकटॉक डाउनलोडर",
    tiktokDesc: "ऑफलाइन आर्काइविंग के लिए टिकटॉक वीडियो डाउनलोड करें।",
    globalTrending: "वैश्विक ट्रेंडिंग हब",
    globalTrendingSubtitle: "सभी प्लेटफार्मों पर लोकप्रिय क्लिप खोजें।",
    redditTitle: "Reddit डाउनलोडर",
    redditDesc: "Reddit समुदायों से वीडियो और मीडिया डाउनलोड करें।",
    pinterestTitle: "Pinterest डाउनलोडर",
    pinterestDesc: "उच्च गुणवत्ता वाले वीडियो पिन और चित्र डाउनलोड करें।",
    threadsTitle: "Threads डाउनलोडर",
    threadsDesc: "Threads पोस्ट से वीडियो और मीडिया आर्काइव करें।",
    blueskyTitle: "Bluesky डाउनलोडर",
    blueskyDesc: "Bluesky सोशल नेटवर्क से वीडियो और इमेज सहेजें।",
    lemon8Title: "Lemon8 डाउनलोडर",
    lemon8Desc: "Lemon8 से सुंदर वीडियो और फ़ोटो डाउनलोड करें।",
    bilibiliTitle: "Bilibili डाउनलोडर",
    bilibiliDesc: "Bilibili से क्लिप और एनिमेशन निकालें।",
    discordTitle: "Discord मीडिया सेवर",
    discordDesc: "Discord CDN लिंक के माध्यम से साझा किए गए वीडियो और चित्र सहेजें।",
    facebookTitle: "फेसबुक डाउनलोडर",
    facebookDesc: "फेसबुक वीडियो और कहानियां सहेजें।",
    historyTitle: "आपके हालिया डाउनलोड",
    clearHistory: "इतिहास साफ़ करें"
  },
  de: {
    title: "ClipKeep Extractor",
    subtitle: "Entdecken Sie Downloader-Tools für die wichtigsten Social-Plattformen an einem Ort.",
    platformLabel: "Plattform",
    sourceUrlLabel: "Quell-URL",
    localeLabel: "Sprache",
    submit: "Extraktion starten",
    submitting: "Senden...",
    status: "Status",
    initialMessage: "Fügen Sie eine unterstützte Beitrags-URL ein und starten Sie die Extraktion.",
    creatingJob: "Aufgabe wird erstellt...",
    degradedMessage: "Eingeschränkt. Bitte Lösungshinweise prüfen.",
    invalidRequest: "Fehlgeschlagen. URL/Plattform prüfen.",
    instagramMaintenanceAlternative: "Instagram wird gewartet. Probiere stattdessen TikTok!",
    successRateX: "95% Erfolg",
    successRateTikTok: "100% Erfolg",
    demoButton: "Demo testen",
    networkError: "Netzwerkfehler beim Erstellen der Aufgabe.",
    helpPage: "Hilfe",
    supportedTools: "Unterstützte Tools",
    telegramTitle: "Telegram Downloader",
    telegramDesc: "Speichern Sie Videos von Telegram-Kanälen.",
    twitterTitle: "Twitter (X) Downloader",
    twitterDesc: "Archivieren Sie Videos von X/Twitter sofort.",
    tiktokTitle: "TikTok Downloader",
    tiktokDesc: "Videos für die Offline-Ansicht herunterladen.",
    globalTrending: "Globaler Trend-Hub",
    globalTrendingSubtitle: "Entdecken Sie beliebte Clips auf allen Plattformen.",
    redditTitle: "Reddit Downloader",
    redditDesc: "Laden Sie Videos und Medien aus Reddit-Communities herunter.",
    pinterestTitle: "Pinterest Downloader",
    pinterestDesc: "Laden Sie hochwertige Video-Pins und Bilder herunter.",
    threadsTitle: "Threads Downloader",
    threadsDesc: "Archivieren Sie Videos und Medien aus Threads-Posts.",
    blueskyTitle: "Bluesky Downloader",
    blueskyDesc: "Speichern Sie Videos und Bilder aus dem sozialen Netzwerk Bluesky.",
    lemon8Title: "Lemon8 Downloader",
    lemon8Desc: "Laden Sie ästhetische Videos und Fotos von Lemon8 herunter.",
    bilibiliTitle: "Bilibili Downloader",
    bilibiliDesc: "Extrahiere Clips und Animationen von Bilibili.",
    discordTitle: "Discord Media Saver",
    discordDesc: "Speichern Sie Videos und Bilder, die über Discord CDN-Links geteilt werden.",
    facebookTitle: "Facebook Downloader",
    facebookDesc: "Facebook-Videos und Stories speichern.",
    historyTitle: "Ihre letzten Downloads",
    clearHistory: "Verlauf löschen"
  },
  tr: {
    title: "ClipKeep Ayıklayıcı",
    subtitle: "Başlıca sosyal platformlar için indirici araçlarını tek bir merkezde keşfedin.",
    platformLabel: "Platform",
    sourceUrlLabel: "Kaynak URL",
    localeLabel: "Dil",
    submit: "Ayıklamayı Başlat",
    submitting: "Gönderiliyor...",
    status: "Durum",
    initialMessage: "Desteklenen bir gönderi URL'si yapıştırın ve ayıklamayı başlatın.",
    creatingJob: "Ayıklama görevi oluşturuluyor...",
    degradedMessage: "Ayıklayıcı geçici olarak sınırlı. Kılavuza bakın.",
    invalidRequest: "İstek başarısız. URL/platformu kontrol edin.",
    instagramMaintenanceAlternative: "Instagram bakımda. Bunun yerine TikTok'u deneyin!",
    successRateX: "%95 Başarı",
    successRateTikTok: "%100 Başarı",
    demoButton: "Demoyu dene",
    networkError: "Görev oluşturulurken ağ hatası oluştu.",
    helpPage: "Yardım",
    supportedTools: "Desteklenen Araçlar",
    telegramTitle: "Telegram İndirici",
    telegramDesc: "Telegram kanallarından videoları kaydedin.",
    twitterTitle: "Twitter (X) İndirici",
    twitterDesc: "Postlardan videoları anında arşivleyin.",
    tiktokTitle: "TikTok İndirici",
    tiktokDesc: "TikTok videolarını çevrimdışı arşivleyin.",
    globalTrending: "Küresel Trend Merkezi",
    globalTrendingSubtitle: "Tüm platformlardaki popüler klipleri keşfedin.",
    redditTitle: "Reddit İndirici",
    redditDesc: "Reddit topluluklarından videoları ve medyayı indirin.",
    pinterestTitle: "Pinterest İndirici",
    pinterestDesc: "Yüksek kaliteli video pinlerini ve resimleri indirin.",
    threadsTitle: "Threads İndirici",
    threadsDesc: "Threads gönderilerinden videoları ve medyayı arşivleyin.",
    blueskyTitle: "Bluesky İndirici",
    blueskyDesc: "Bluesky sosyal ağından videoları ve resimleri kaydedin.",
    lemon8Title: "Lemon8 İndirici",
    lemon8Desc: "Lemon8'den estetik videoları ve fotoğrafları indirin.",
    bilibiliTitle: "Bilibili İndirici",
    bilibiliDesc: "Bilibili'den klipleri ve animasyonları ayıklayın.",
    discordTitle: "Discord Medya Kaydedici",
    discordDesc: "Discord CDN bağlantıları aracılığıyla paylaşılan videoları ve resimleri kaydedin.",
    facebookTitle: "Facebook İndirici",
    facebookDesc: "Facebook videolarını ve hikayelerini kaydedin.",
    historyTitle: "Son İndirmeleriniz",
    clearHistory: "Geçmişi Temizle"
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
    cookies: "ملفات تعريف الارتباط",
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
    about: "Acerca de",
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
    about: "Tentang",
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
    about: "Hakkimizda",
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
      nextUpdate: "अगला अपडेट: 15 मिनट के भीतर."
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

export const resultText: Record<Locale, ResultDict> = {  en: {
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
    loadingTitle: "Extracting Media",
    loadingSubtitle: "This usually takes 5-15 seconds depending on content size.",
    backToDownloader: "Back to Downloader",
    successSubtitle: "Ready for Download",
    downloadDescription: "Select your preferred quality from the list below.",
    unknownAuthor: "Unknown Author",
    warningsTitle: "Extraction Warnings",
    recommendedClips: "Recommended Clips",    sourcePost: "Post",
    readyToDownload: "Ready to Download",
    preparingDownload: "Preparing your download...",
    nextActionAnother: "Sıradaki videoyu kaydet 👇",
    nextActionPaste: "Bağlantıyı buraya yapıştır",
  },  ar: {
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
    mediaTitle: "الوسائط جاهزة",
    download: "تنزيل",
    loadingTitle: "جاري استخراج الوسائط",
    loadingSubtitle: "يستغرق هذا عادةً من 5 إلى 15 ثانية حسب حجم المحتوى.",
    backToDownloader: "العودة إلى أداة التنزيل",
    successSubtitle: "جاهز للتنزيل",
    downloadDescription: "حدد الجودة المفضلة لديك من القائمة أدناه.",
    unknownAuthor: "مؤلف غير معروف",
    warningsTitle: "تحذيرات الاستخراج",
    recommendedClips: "مقاطع مقترحة",    sourcePost: "منشور",
    readyToDownload: "جاهز للتنزيل",
    preparingDownload: "جاري تحضير التنزيل...",
    nextActionAnother: "Guardar el siguiente video 👇",
    nextActionPaste: "Pegar enlace aquí",
  },  ja: {
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
    loadingTitle: "メディアを抽出中",
    loadingSubtitle: "通常5〜15秒ほどで完了します。少々お待ちください。",
    backToDownloader: "ダウンローダーに戻る",
    successSubtitle: "保存準備が整いました",
    downloadDescription: "以下のリストからご希望の品質を選択してください。",
    unknownAuthor: "不明な投稿者",
    warningsTitle: "抽出に関する警告",
    recommendedClips: "おすすめクリップ",    sourcePost: "ポスト",
    readyToDownload: "保存準備完了",
    preparingDownload: "ダウンロードを準備中...",
    nextActionAnother: "Guardar el siguiente video 👇",
    nextActionPaste: "Pegar enlace aquí",
  },  es: {
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
    statusTitle: "Status",
    states: {
      queued: "En cola",
      processing: "Procesando",
      completed: "Completado",
      failed: "Error",
    },
    mediaTitle: "Media Lista",
    download: "Descargar",
    loadingTitle: "Extrayendo medios",
    loadingSubtitle: "Esto suele tardar de 5 a 15 segundos.",
    backToDownloader: "Volver al descargador",
    successSubtitle: "Listo para descargar",
    downloadDescription: "Seleccione la calidad preferida de la lista.",
    unknownAuthor: "Autor desconocido",
    warningsTitle: "Advertencias de extracción",
    recommendedClips: "Clips recomendados",    sourcePost: "Post",
    readyToDownload: "Listo para descargar",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Guardar el siguiente video 👇",
    nextActionPaste: "Pegar enlace aquí",
  },  pt: {
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
    download: "Baixar",
    loadingTitle: "Extraindo mídia",
    loadingSubtitle: "Isso geralmente leva de 5 a 15 segundos.",
    backToDownloader: "Voltar ao downloader",
    successSubtitle: "Pronto para baixar",
    downloadDescription: "Selecione a qualidade preferida na lista.",
    unknownAuthor: "Autor desconhecido",
    warningsTitle: "Avisos de extração",
    recommendedClips: "Clips recomendados",    sourcePost: "Post",
    readyToDownload: "Pronto para baixar",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Salvar o próximo vídeo 👇",
    nextActionPaste: "Colar link aqui",
  },  fr: {
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
    download: "Télécharger",
    loadingTitle: "Extraction des médias",
    loadingSubtitle: "Cela prend généralement 5 à 15 secondes.",
    backToDownloader: "Retour au téléchargeur",
    successSubtitle: "Prêt pour le téléchargement",
    downloadDescription: "Sélectionnez la qualité préférée dans la liste.",
    unknownAuthor: "Auteur inconnu",
    warningsTitle: "Avertissements d'extraction",
    recommendedClips: "Clips recommandés",    sourcePost: "Post",
    readyToDownload: "Prêt pour le téléchargement",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Enregistrez la vidéo suivante 👇",
    nextActionPaste: "Coller le lien ici",
  },  id: {
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
    download: "Unduh",
    loadingTitle: "Mengekstrak Media",
    loadingSubtitle: "Ini biasanya memakan waktu 5-15 detik.",
    backToDownloader: "Kembali ke Pengunduh",
    successSubtitle: "Siap diunduh",
    downloadDescription: "Pilih kualitas yang Anda inginkan dari daftar di bawah.",
    unknownAuthor: "Penulis Tidak Dikenal",
    warningsTitle: "Peringatan Ekstraksi",
    recommendedClips: "Klip yang Direkomendasikan",    sourcePost: "Post",
    readyToDownload: "Siap diunduh",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Simpan video berikutnya 👇",
    nextActionPaste: "Tempel tautan di sini",
  },  hi: {
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
    mediaTitle: "मीडिया तैयार है",
    download: "डाउनलोड",
    loadingTitle: "मीडिया निकाला जा रहा है",
    loadingSubtitle: "इसमें आमतौर पर 5-15 सेकंड लगते हैं।",
    backToDownloader: "डाउनलोडर पर वापस जाएं",
    successSubtitle: "डाउनलोड के लिए तैयार",
    downloadDescription: "नीचे दी गई सूची से अपनी पसंदीदा गुणवत्ता चुनें।",
    unknownAuthor: "अज्ञात लेखक",
    warningsTitle: "निष्कर्षण चेतावनियाँ",
    recommendedClips: "अनुशंसित क्लिप",    sourcePost: "पोस्ट",
    readyToDownload: "डाउनलोड के तैयार",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "अगला वीडियो सहेजें 👇",
    nextActionPaste: "यहाँ लिंक पेस्ट करें",
  },  de: {
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
    download: "Download",
    loadingTitle: "Medien werden extrahiert",
    loadingSubtitle: "Dies dauert normalerweise 5-15 Sekunden.",
    backToDownloader: "Zurück zum Downloader",
    successSubtitle: "Bereit zum Download",
    downloadDescription: "Wählen Sie die gewünschte Qualität aus der Liste aus.",
    unknownAuthor: "Unbekannter Autor",
    warningsTitle: "Extraktionswarnungen",
    recommendedClips: "Empfohlene Clips",    sourcePost: "Post",
    readyToDownload: "Bereit zum Download",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Nächstes Video speichern 👇",
    nextActionPaste: "Link hier einfügen",
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
    download: "İndir",
    loadingTitle: "Medya Ayıklanıyor",
    loadingSubtitle: "Bu işlem genellikle 5-15 saniye sürer.",
    backToDownloader: "İndiriciye Dön",
    successSubtitle: "İndirmeye Hazır",
    downloadDescription: "Aşağıdaki listeden tercih ettiğiniz kaliteyi seçin.",
    unknownAuthor: "Bilinmeyen Yazar",
    warningsTitle: "Ayıklama Uyarıları",
    recommendedClips: "Önerilen Klipler",
    sourcePost: "Gönderi",
    readyToDownload: "İndirmeye hazır",
    preparingDownload: "Preparando tu descarga...",
    nextActionAnother: "Sıradaki videoyu kaydet 👇",
    nextActionPaste: "Bağlantıyı buraya yapıştır",
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

export const redditText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Reddit Media",
    howToSteps: ["Open Reddit: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Reddit?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Reddit content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Reddit FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Reddit downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Reddit Saves",
    trendingTitle: "Trending on Reddit"
  },
  ar: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Reddit",
    howToSteps: ["افتح Reddit: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Reddit؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Reddit.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Reddit",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Reddit",
    trendingTitle: "رائج على Reddit"
  },
  ja: {
    title: "Reddit ダウンローダー",
    subtitle: "Redditのコミュニティから動画やメディアを保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Reddit動画の保存方法",
    howToSteps: ["Redditを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Redditのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のReddit保存",
    trendingTitle: "Redditトレンド"
  },
  es: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Reddit",
    howToSteps: ["Abre Reddit: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Reddit.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Reddit",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Reddit",
    trendingTitle: "Tendencias en Reddit"
  },
  pt: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Reddit",
    howToSteps: ["Abra o Reddit: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Reddit.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Reddit",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Reddit",
    trendingTitle: "Tendências no Reddit"
  },
  fr: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Reddit",
    howToSteps: ["Ouvrez Reddit : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Reddit.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Reddit",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Reddit",
    trendingTitle: "Tendances Reddit"
  },
  id: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Reddit",
    howToSteps: ["Buka Reddit: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Reddit.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Reddit",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Reddit Terkini",
    trendingTitle: "Tren di Reddit"
  },
  hi: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Reddit मीडिया कैसे सहेजें",
    howToSteps: ["Reddit खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Reddit सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Reddit FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Reddit सेव",
    trendingTitle: "Reddit पर ट्रेंडिंग"
  },
  de: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Reddit Medien speichern",
    howToSteps: ["Reddit öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Reddit-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Reddit FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Reddit gespeichert",
    trendingTitle: "Trends auf Reddit"
  },
  tr: {
    title: "Reddit Downloader",
    subtitle: "Download videos and media from Reddit communities.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Reddit Medyası Nasıl Kaydedilir",
    howToSteps: ["Reddit'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Reddit içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Reddit SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Reddit Kayıtları",
    trendingTitle: "Reddit Trendleri"
  },
};

export const pinterestText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Pinterest Media",
    howToSteps: ["Open Pinterest: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Pinterest?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Pinterest content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Pinterest FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Pinterest downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Pinterest Saves",
    trendingTitle: "Trending on Pinterest"
  },
  ar: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Pinterest",
    howToSteps: ["افتح Pinterest: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Pinterest؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Pinterest.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Pinterest",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Pinterest",
    trendingTitle: "رائج على Pinterest"
  },
  ja: {
    title: "Pinterest ダウンローダー",
    subtitle: "高画質な動画ピンや画像をダウンロードします。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Pinterest動画の保存方法",
    howToSteps: ["Pinterestを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Pinterestのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のPinterest保存",
    trendingTitle: "Pinterestトレンド"
  },
  es: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Pinterest",
    howToSteps: ["Abre Pinterest: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Pinterest.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Pinterest",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Pinterest",
    trendingTitle: "Tendencias en Pinterest"
  },
  pt: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Pinterest",
    howToSteps: ["Abra o Pinterest: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Pinterest.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Pinterest",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Pinterest",
    trendingTitle: "Tendências no Pinterest"
  },
  fr: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Pinterest",
    howToSteps: ["Ouvrez Pinterest : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Pinterest.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Pinterest",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Pinterest",
    trendingTitle: "Tendances Pinterest"
  },
  id: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Pinterest",
    howToSteps: ["Buka Pinterest: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Pinterest.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Pinterest",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Pinterest Terkini",
    trendingTitle: "Tren di Pinterest"
  },
  hi: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Pinterest मीडिया कैसे सहेजें",
    howToSteps: ["Pinterest खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Pinterest सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Pinterest FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Pinterest सेव",
    trendingTitle: "Pinterest पर ट्रेंडिंग"
  },
  de: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Pinterest Medien speichern",
    howToSteps: ["Pinterest öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Pinterest-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Pinterest FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Pinterest gespeichert",
    trendingTitle: "Trends auf Pinterest"
  },
  tr: {
    title: "Pinterest Downloader",
    subtitle: "Download high-quality video pins and images.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Pinterest Medyası Nasıl Kaydedilir",
    howToSteps: ["Pinterest'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Pinterest içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Pinterest SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Pinterest Kayıtları",
    trendingTitle: "Pinterest Trendleri"
  },
};

export const threadsText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Threads Media",
    howToSteps: ["Open Threads: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Threads?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Threads content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Threads FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Threads downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Threads Saves",
    trendingTitle: "Trending on Threads"
  },
  ar: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Threads",
    howToSteps: ["افتح Threads: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Threads؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Threads.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Threads",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Threads",
    trendingTitle: "رائج على Threads"
  },
  ja: {
    title: "Threads ダウンローダー",
    subtitle: "Threads の投稿から動画やメディアをアーカイブします。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Threads動画の保存方法",
    howToSteps: ["Threadsを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Threadsのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のThreads保存",
    trendingTitle: "Threadsトレンド"
  },
  es: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Threads",
    howToSteps: ["Abre Threads: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Threads.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Threads",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Threads",
    trendingTitle: "Tendencias en Threads"
  },
  pt: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Threads",
    howToSteps: ["Abra o Threads: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Threads.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Threads",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Threads",
    trendingTitle: "Tendências no Threads"
  },
  fr: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Threads",
    howToSteps: ["Ouvrez Threads : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Threads.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Threads",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Threads",
    trendingTitle: "Tendances Threads"
  },
  id: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Threads",
    howToSteps: ["Buka Threads: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Threads.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Threads",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Threads Terkini",
    trendingTitle: "Tren di Threads"
  },
  hi: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Threads मीडिया कैसे सहेजें",
    howToSteps: ["Threads खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Threads सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Threads FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Threads सेव",
    trendingTitle: "Threads पर ट्रेंडिंग"
  },
  de: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Threads Medien speichern",
    howToSteps: ["Threads öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Threads-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Threads FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Threads gespeichert",
    trendingTitle: "Trends auf Threads"
  },
  tr: {
    title: "Threads Downloader",
    subtitle: "Archive videos and media from Threads posts.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Threads Medyası Nasıl Kaydedilir",
    howToSteps: ["Threads'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Threads içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Threads SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Threads Kayıtları",
    trendingTitle: "Threads Trendleri"
  },
};

export const blueskyText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Bluesky Media",
    howToSteps: ["Open Bluesky: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Bluesky?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Bluesky content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Bluesky FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Bluesky downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Bluesky Saves",
    trendingTitle: "Trending on Bluesky"
  },
  ar: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Bluesky",
    howToSteps: ["افتح Bluesky: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Bluesky؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Bluesky.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Bluesky",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Bluesky",
    trendingTitle: "رائج على Bluesky"
  },
  ja: {
    title: "Bluesky ダウンローダー",
    subtitle: "Bluesky SNSから動画や画像を保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Bluesky動画の保存方法",
    howToSteps: ["Blueskyを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Blueskyのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のBluesky保存",
    trendingTitle: "Blueskyトレンド"
  },
  es: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Bluesky",
    howToSteps: ["Abre Bluesky: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Bluesky.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Bluesky",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Bluesky",
    trendingTitle: "Tendencias en Bluesky"
  },
  pt: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Bluesky",
    howToSteps: ["Abra o Bluesky: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Bluesky.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Bluesky",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Bluesky",
    trendingTitle: "Tendências no Bluesky"
  },
  fr: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Bluesky",
    howToSteps: ["Ouvrez Bluesky : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Bluesky.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Bluesky",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Bluesky",
    trendingTitle: "Tendances Bluesky"
  },
  id: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Bluesky",
    howToSteps: ["Buka Bluesky: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Bluesky.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Bluesky",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Bluesky Terkini",
    trendingTitle: "Tren di Bluesky"
  },
  hi: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Bluesky मीडिया कैसे सहेजें",
    howToSteps: ["Bluesky खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Bluesky सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Bluesky FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Bluesky सेव",
    trendingTitle: "Bluesky पर ट्रेंडिंग"
  },
  de: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Bluesky Medien speichern",
    howToSteps: ["Bluesky öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Bluesky-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Bluesky FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Bluesky gespeichert",
    trendingTitle: "Trends auf Bluesky"
  },
  tr: {
    title: "Bluesky Downloader",
    subtitle: "Save videos and images from the Bluesky social network.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Bluesky Medyası Nasıl Kaydedilir",
    howToSteps: ["Bluesky'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Bluesky içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Bluesky SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Bluesky Kayıtları",
    trendingTitle: "Bluesky Trendleri"
  },
};

export const lemon8Text: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Lemon8 Media",
    howToSteps: ["Open Lemon8: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Lemon8?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Lemon8 content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Lemon8 FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Lemon8 downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Lemon8 Saves",
    trendingTitle: "Trending on Lemon8"
  },
  ar: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Lemon8",
    howToSteps: ["افتح Lemon8: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Lemon8؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Lemon8.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Lemon8",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Lemon8",
    trendingTitle: "رائج على Lemon8"
  },
  ja: {
    title: "Lemon8 ダウンローダー",
    subtitle: "Lemon8からおしゃれな動画や写真をダウンロードします。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Lemon8動画の保存方法",
    howToSteps: ["Lemon8を開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Lemon8のコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のLemon8保存",
    trendingTitle: "Lemon8トレンド"
  },
  es: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Lemon8",
    howToSteps: ["Abre Lemon8: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Lemon8.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Lemon8",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Lemon8",
    trendingTitle: "Tendencias en Lemon8"
  },
  pt: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Lemon8",
    howToSteps: ["Abra o Lemon8: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Lemon8.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Lemon8",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Lemon8",
    trendingTitle: "Tendências no Lemon8"
  },
  fr: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Lemon8",
    howToSteps: ["Ouvrez Lemon8 : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Lemon8.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Lemon8",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Lemon8",
    trendingTitle: "Tendances Lemon8"
  },
  id: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Lemon8",
    howToSteps: ["Buka Lemon8: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Lemon8.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Lemon8",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Lemon8 Terkini",
    trendingTitle: "Tren di Lemon8"
  },
  hi: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Lemon8 मीडिया कैसे सहेजें",
    howToSteps: ["Lemon8 खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Lemon8 सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Lemon8 FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Lemon8 सेव",
    trendingTitle: "Lemon8 पर ट्रेंडिंग"
  },
  de: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Lemon8 Medien speichern",
    howToSteps: ["Lemon8 öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Lemon8-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Lemon8 FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Lemon8 gespeichert",
    trendingTitle: "Trends auf Lemon8"
  },
  tr: {
    title: "Lemon8 Downloader",
    subtitle: "Download aesthetic videos and photos from Lemon8.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Lemon8 Medyası Nasıl Kaydedilir",
    howToSteps: ["Lemon8'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Lemon8 içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Lemon8 SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Lemon8 Kayıtları",
    trendingTitle: "Lemon8 Trendleri"
  },
};

export const bilibiliText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Bilibili Media",
    howToSteps: ["Open Bilibili: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Bilibili?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Bilibili content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Bilibili FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Bilibili downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Bilibili Saves",
    trendingTitle: "Trending on Bilibili"
  },
  ar: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Bilibili",
    howToSteps: ["افتح Bilibili: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Bilibili؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Bilibili.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Bilibili",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Bilibili",
    trendingTitle: "رائج على Bilibili"
  },
  ja: {
    title: "Bilibili ダウンローダー",
    subtitle: "Bilibiliから動画クリップやアニメーションを抽出します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Bilibili動画の保存方法",
    howToSteps: ["Bilibiliを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Bilibiliのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のBilibili保存",
    trendingTitle: "Bilibiliトレンド"
  },
  es: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Bilibili",
    howToSteps: ["Abre Bilibili: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Bilibili.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Bilibili",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Bilibili",
    trendingTitle: "Tendencias en Bilibili"
  },
  pt: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Bilibili",
    howToSteps: ["Abra o Bilibili: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Bilibili.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Bilibili",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Bilibili",
    trendingTitle: "Tendências no Bilibili"
  },
  fr: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Bilibili",
    howToSteps: ["Ouvrez Bilibili : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Bilibili.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Bilibili",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Bilibili",
    trendingTitle: "Tendances Bilibili"
  },
  id: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Bilibili",
    howToSteps: ["Buka Bilibili: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Bilibili.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Bilibili",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Bilibili Terkini",
    trendingTitle: "Tren di Bilibili"
  },
  hi: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Bilibili मीडिया कैसे सहेजें",
    howToSteps: ["Bilibili खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Bilibili सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Bilibili FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Bilibili सेव",
    trendingTitle: "Bilibili पर ट्रेंडिंग"
  },
  de: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Bilibili Medien speichern",
    howToSteps: ["Bilibili öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Bilibili-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Bilibili FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Bilibili gespeichert",
    trendingTitle: "Trends auf Bilibili"
  },
  tr: {
    title: "Bilibili Downloader",
    subtitle: "Extract video clips and animations from Bilibili.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Bilibili Medyası Nasıl Kaydedilir",
    howToSteps: ["Bilibili'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Bilibili içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Bilibili SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Bilibili Kayıtları",
    trendingTitle: "Bilibili Trendleri"
  },
};

export const discordText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Discord Media",
    howToSteps: ["Open Discord: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Discord?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Discord content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Discord FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Discord downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Discord Saves",
    trendingTitle: "Trending on Discord"
  },
  ar: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Discord",
    howToSteps: ["افتح Discord: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Discord؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Discord.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Discord",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Discord",
    trendingTitle: "رائج على Discord"
  },
  ja: {
    title: "Discord メディア保存",
    subtitle: "Discord CDN経由で共有された動画や画像を保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Discord動画の保存方法",
    howToSteps: ["Discordを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Discordのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のDiscord保存",
    trendingTitle: "Discordトレンド"
  },
  es: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Discord",
    howToSteps: ["Abre Discord: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Discord.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Discord",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Discord",
    trendingTitle: "Tendencias en Discord"
  },
  pt: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Discord",
    howToSteps: ["Abra o Discord: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Discord.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Discord",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Discord",
    trendingTitle: "Tendências no Discord"
  },
  fr: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Discord",
    howToSteps: ["Ouvrez Discord : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Discord.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Discord",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Discord",
    trendingTitle: "Tendances Discord"
  },
  id: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Discord",
    howToSteps: ["Buka Discord: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Discord.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Discord",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Discord Terkini",
    trendingTitle: "Tren di Discord"
  },
  hi: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Discord मीडिया कैसे सहेजें",
    howToSteps: ["Discord खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Discord सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Discord FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Discord सेव",
    trendingTitle: "Discord पर ट्रेंडिंग"
  },
  de: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Discord Medien speichern",
    howToSteps: ["Discord öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Discord-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Discord FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Discord gespeichert",
    trendingTitle: "Trends auf Discord"
  },
  tr: {
    title: "Discord Media Saver",
    subtitle: "Save videos and images shared via Discord CDN links.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Discord Medyası Nasıl Kaydedilir",
    howToSteps: ["Discord'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Discord içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Discord SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Discord Kayıtları",
    trendingTitle: "Discord Trendleri"
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
    rankings: "Trend",
    latest: "Latest",
    viewAllTrending: "View All Trending",
    language: "LANGUAGE",
    more: "MORE",
    bilibili: "Bilibili Downloader",
    bluesky: "Bluesky Downloader",
    discord: "Discord Media Saver",
    lemon8: "Lemon8 Downloader",
    pinterest: "Pinterest Downloader",
    reddit: "Reddit Downloader",
    telegram: "Telegram Downloader",
    threads: "Threads Downloader",
    tiktok: "TikTok Downloader",
    twitter: "Twitter (X) Downloader",
    facebook: "Facebook Downloader",
    about: "About",
    faq: "FAQ",
    privacy: "Privacy Policy",
    contact: "Contact Support",
    globalHub: "GLOBAL HUB",
    globalTrend: "Global Trend",
  },
  ar: {
    downloads: "تنزيل",
    rankings: "الرائج",
    latest: "الأحدث",
    viewAllTrending: "عرض كل الترند",
    language: "اللغة",
    more: "المزيد",
    bilibili: "بليبلي",
    bluesky: "بلوسكاي",
    discord: "ديسكورد",
    lemon8: "ليمون 8",
    pinterest: "بينتيريست",
    reddit: "ريديت",
    telegram: "تيليجرام",
    threads: "ثريدز",
    tiktok: "تيك توك",
    twitter: "تويتر",
    facebook: "فيسبوك",
    about: "من نحن",
    faq: "الأسئلة الشائعة",
    privacy: "سياسة الخصوصية",
    contact: "اتصل بنا",
    globalHub: "المركز العالمي",
    globalTrend: "الترند العالمي",
  },
  ja: {
    downloads: "ダウンロード",
    rankings: "トレンド",
    latest: "最新",
    viewAllTrending: "トレンド一覧を見る",
    language: "言語切り替え",
    more: "その他",
    bilibili: "Bilibili 保存",
    bluesky: "Bluesky 保存",
    discord: "Discord 保存",
    lemon8: "Lemon8 保存",
    pinterest: "Pinterest 保存",
    reddit: "Reddit 保存",
    telegram: "Telegram 保存",
    threads: "Threads 保存",
    tiktok: "TikTok 保存",
    twitter: "Twitter 保存",
    facebook: "Facebook 保存",
    about: "サイトについて",
    faq: "よくある質問",
    privacy: "プライバシーポリシー",
    contact: "お問い合わせ",
    globalHub: "グローバルハブ",
    globalTrend: "グローバルトレンド",
  },
  es: {
    downloads: "DESCARGAS",
    rankings: "Tendencias",
    latest: "Últimos",
    viewAllTrending: "Ver todas las tendencias",
    language: "IDIOMA",
    more: "MÁS",
    bilibili: "Descargador de Bilibili",
    bluesky: "Descargador de Bluesky",
    discord: "Guardador de Discord",
    lemon8: "Descargador de Lemon8",
    pinterest: "Descargador de Pinterest",
    reddit: "Descargador de Reddit",
    telegram: "Descargador de Telegram",
    threads: "Descargador de Threads",
    tiktok: "Descargador de TikTok",
    twitter: "Descargador de Twitter (X)",
    facebook: "Descargador de Facebook",
    about: "Sobre nosotros",
    faq: "FAQ",
    privacy: "Privacidad",
    contact: "Contacto",
    globalHub: "HUB GLOBAL",
    globalTrend: "Tendencia global"
  },
  pt: {
    downloads: "DOWNLOADS",
    rankings: "Tendências",
    latest: "Últimos",
    viewAllTrending: "Ver todas as tendências",
    language: "IDIOMA",
    more: "MAIS",
    bilibili: "Downloader do Bilibili",
    bluesky: "Downloader do Bluesky",
    discord: "Protetor do Discord",
    lemon8: "Downloader do Lemon8",
    pinterest: "Downloader do Pinterest",
    reddit: "Downloader do Reddit",
    telegram: "Downloader do Telegram",
    threads: "Downloader do Threads",
    tiktok: "Downloader do TikTok",
    twitter: "Baixador do Twitter (X)",
    facebook: "Downloader do Facebook",
    about: "Sobre",
    faq: "FAQ",
    privacy: "Privacidade",
    contact: "Contato",
    globalHub: "HUB GLOBAL",
    globalTrend: "Tendência global"
  },
  fr: {
    downloads: "TÉLÉCHARGEMENTS",
    rankings: "Tendances",
    latest: "Récents",
    viewAllTrending: "Voir toutes les tendances",
    language: "LANGUE",
    more: "PLUS",
    bilibili: "Téléchargeur Bilibili",
    bluesky: "Téléchargeur Bluesky",
    discord: "Sauveur Discord",
    lemon8: "Téléchargeur Lemon8",
    pinterest: "Téléchargeur Pinterest",
    reddit: "Téléchargeur Reddit",
    telegram: "Téléchargeur Telegram",
    threads: "Téléchargeur Threads",
    tiktok: "Téléchargeur TikTok",
    twitter: "Téléchargeur Twitter (X)",
    facebook: "Téléchargeur Facebook",
    about: "À propos",
    faq: "FAQ",
    privacy: "Confidentialité",
    contact: "Contact",
    globalHub: "HUB MONDIAL",
    globalTrend: "Tendance mondiale"
  },
  id: {
    downloads: "UNDUHAN",
    rankings: "Tren",
    latest: "Terbaru",
    viewAllTrending: "Lihat semua tren",
    language: "BAHASA",
    more: "LAINNYA",
    bilibili: "Pengunduh Bilibili",
    bluesky: "Pengunduh Bluesky",
    discord: "Penyimpan Discord",
    lemon8: "Pengunduh Lemon8",
    pinterest: "Pengunduh Pinterest",
    reddit: "Pengunduh Reddit",
    telegram: "Pengunduh Telegram",
    threads: "Pengunduh Threads",
    tiktok: "Pengunduh TikTok",
    twitter: "Pengunduh Twitter (X)",
    facebook: "Pengunduh Facebook",
    about: "Tentang",
    faq: "FAQ",
    privacy: "Privasi",
    contact: "Kontak",
    globalHub: "HUB GLOBAL",
    globalTrend: "Tren Global"
  },
  hi: {
    downloads: "डाउनलोड",
    rankings: "ट्रेंडिंग",
    latest: "नवीनतम",
    viewAllTrending: "सभी ट्रेंड देखें",
    language: "भाषा",
    more: "अधिक",
    bilibili: "Bilibili डाउनलोडर",
    bluesky: "Bluesky डाउनलोडर",
    discord: "Discord सेवर",
    lemon8: "Lemon8 डाउनलोडर",
    pinterest: "Pinterest डाउनलोडer",
    reddit: "Reddit डाउनलोडर",
    telegram: "टेलीग्राम डाउनलोडर",
    threads: "Threads डाउनलोडर",
    tiktok: "टिकटॉक डाउनलोडर",
    twitter: "ट्विटर डाउनलोडर",
    facebook: "फेसबुक डाउनलोडर",
    about: "बारे में",
    faq: "FAQ",
    privacy: "गोपनीयता नीति",
    contact: "सहायता केंद्र",
    globalHub: "ग्लोबल हब",
    globalTrend: "ग्लोबल ट्रेंड"
  },
  de: {
    downloads: "DOWNLOADS",
    rankings: "Trends",
    latest: "Neueste",
    viewAllTrending: "Alle Trends ansehen",
    language: "SPRACHE",
    more: "MEHR",
    bilibili: "Bilibili Downloader",
    bluesky: "Bluesky Downloader",
    discord: "Discord Saver",
    lemon8: "Lemon8 Downloader",
    pinterest: "Pinterest Downloader",
    reddit: "Reddit Downloader",
    telegram: "Telegram Downloader",
    threads: "Threads Downloader",
    tiktok: "TikTok Downloader",
    twitter: "Twitter Downloader",
    facebook: "Facebook Downloader",
    about: "Über uns",
    faq: "FAQ",
    privacy: "Datenschutz",
    contact: "Support kontaktieren",
    globalHub: "GLOBAL HUB",
    globalTrend: "Globaler Trend"
  },
  tr: {
    downloads: "İNDİRMELER",
    rankings: "Trend",
    latest: "En Son",
    viewAllTrending: "Tüm trendleri gör",
    language: "DİL",
    more: "DAHA FAZLA",
    bilibili: "Bilibili İndirici",
    bluesky: "Bluesky İndirici",
    discord: "Discord Kaydedici",
    lemon8: "Lemon8 İndirici",
    pinterest: "Pinterest İndirici",
    reddit: "Reddit İndirici",
    telegram: "Telegram İndirici",
    threads: "Threads İndirici",
    tiktok: "TikTok İndirici",
    twitter: "Twitter İndirici",
    facebook: "Facebook İndirici",
    about: "Hakkımızda",
    faq: "SSS",
    privacy: "Gizlilik Politikası",
    contact: "Destekle İletişime Geç",
    globalHub: "KÜRESEL HUB",
    globalTrend: "Küresel Trend"
  }
};

export const galleryPages: Record<Locale, Record<string, GalleryPageDict>> = {
  en: {
    trendingAll: {
      title: "Global Trending Videos",
      subtitle: "Discover the most popular clips across all platforms.",
      description: "Watch trending videos from TikTok, Twitter, Reddit, and more in one place.",
    },
    latestAll: {
      title: "Latest Global Downloads",
      subtitle: "See what people are extracting right now.",
      description: "A real-time feed of the latest media being archived on ClipKeep.",
    },
    trendingTwitter: {
      title: "Trending Twitter (X) Videos",
      subtitle: "Watch the most popular videos on Twitter today.",
      description: "Discover viral clips, trending news media, and popular Twitter (X) videos. Download them instantly for offline viewing.",
      seoContent: "## Why Twitter videos go viral\nTwitter (X) is the global town square where news breaks and viral moments happen in real-time. Our Trending Twitter Videos page curates the most accessed and engaged content shared across the platform. From breaking news clips to viral memes and high-impact sports highlights, stay up to date with what the world is watching.\n\n## How to download Twitter videos\nClipKeep provides a seamless way not only to discover this content but also to save it directly to your device. Whether you are a content creator looking for inspiration, a journalist tracking a story, or just looking for entertainment, our real-time ranking ensures you never miss a beat.\n\n## Why use ClipKeep\nOur service is built for speed and reliability. If you want to save these trending videos for offline use or safe keeping, try our [Twitter (X) Downloader](/download-twitter-video?locale=en) directly."
    },
    trendingTiktok: {
      title: "Trending TikTok Videos",
      subtitle: "Viral clips and trending TikToks from around the world.",
      description: "Stay in the loop with the most popular TikTok videos. Fast saving for your favorite viral moments.",
      seoContent: "## The Pulse of Modern Culture\nTikTok is the epicenter of modern internet culture, where trends are born and go viral in seconds. Our Trending TikTok Videos section identifies the most popular short-form media currently being extracted by our global user base. Discover high-energy dance challenges and hilarious comedy skits capturing everyone's attention.\n\n## Secure and Fast Archiving\nClipKeep allows you to archive these trending moments in high quality, ensuring that the best of TikTok is always available at your fingertips. For specific video saves, use our [TikTok Downloader](/download-tiktok-video?locale=en) for the most direct way to save media."
    },
    trendingTelegram: {
      title: "Trending Telegram Media",
      subtitle: "Popular videos and files from Telegram channels.",
      description: "Explore the most downloaded media from Telegram's global channels and groups.",
      seoContent: "## Content Discovery in Communities\nTelegram has become a major hub for news, documentaries, and niche community content. The Trending Telegram Media page showcases the most sought-after files and videos being processed from public Telegram channels. Because Telegram content can sometimes be difficult to find directly, ClipKeep acts as a powerful bridge.\n\n## Reliable Telegram Extraction\nOur real-time rankings help you discover valuable digital assets shared by communities across the globe. To save any specific Telegram media you find interesting, head over to our [Telegram Downloader](/download-telegram-video?locale=en)."
    },
    latestTwitter: {
      title: "Latest Twitter (X) Downloads",
      subtitle: "Recently saved videos from Twitter (X).",
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
    },
    latestReddit: {
      title: "Latest Reddit Downloads",
      subtitle: "Recently extracted videos from Reddit.",
      description: "See what the world is saving from Reddit right now. Explore the latest Reddit media on ClipKeep.",
    },
    trendingReddit: {
      title: "Trending Reddit Videos",
      subtitle: "The most popular clips from Reddit today.",
      description: "Discover viral gems and top-rated media from Reddit's global communities.",
    },
    latestPinterest: {
      title: "Latest Pinterest Downloads",
      subtitle: "New video pins processed by ClipKeep.",
      description: "A real-time look at aesthetic videos and pins being saved on our platform.",
    },
    trendingPinterest: {
      title: "Trending Pinterest Pins",
      subtitle: "Viral video pins and aesthetic content.",
      description: "Explore what's inspiring the world on Pinterest right now.",
    },
    latestThreads: {
      title: "Latest Threads Downloads",
      subtitle: "Recently saved clips from Threads.",
      description: "Stay updated with the newest media being archived from the Threads social network.",
    },
    trendingThreads: {
      title: "Trending Threads Videos",
      subtitle: "Viral moments and top media from Threads.",
      description: "Discover the most talked-about videos on Threads today.",
    },
    latestBluesky: {
      title: "Latest Bluesky Downloads",
      subtitle: "Fresh media being saved from Bluesky.",
      description: "The newest videos and images from the decentralized social network.",
    },
    trendingBluesky: {
      title: "Trending Bluesky Clips",
      subtitle: "Most popular posts on Bluesky right now.",
      description: "Discover viral media from the Bluesky community.",
    },
    latestLemon8: {
      title: "Latest Lemon8 Downloads",
      subtitle: "Aesthetic videos recently saved from Lemon8.",
      description: "Explore the newest lifestyle and fashion clips on ClipKeep.",
    },
    trendingLemon8: {
      title: "Trending Lemon8 Videos",
      subtitle: "Viral lifestyle and aesthetic clips.",
      description: "Stay in the loop with what's trending on Lemon8 today.",
    },
    latestBilibili: {
      title: "Latest Bilibili Downloads",
      subtitle: "Recently extracted animations and clips from Bilibili.",
      description: "See what's new in the world of ACG and Bilibili content.",
    },
    trendingBilibili: {
      title: "Trending Bilibili Clips",
      subtitle: "The most popular animations on Bilibili today.",
      description: "Discover trending clips and fan-favorites from Bilibili.",
    },
    latestDiscord: {
      title: "Latest Discord Downloads",
      subtitle: "Recently saved media from Discord CDN.",
      description: "Explore the latest videos and images shared via Discord links.",
    },
    trendingDiscord: {
      title: "Trending Discord Media",
      subtitle: "Popular clips being archived from Discord.",
      description: "Stay updated with the most shared media from Discord servers.",
    },
    latestFacebook: {
      title: "Latest Facebook Downloads",
      subtitle: "Recent videos and stories saved from Facebook.",
      description: "Explore the newest media being archived from Facebook on ClipKeep.",
    },
    trendingFacebook: {
      title: "Trending Facebook Videos",
      subtitle: "Viral reels and stories from Facebook.",
      description: "Discover what's trending across Facebook communities today.",
    }
  },
  ja: {
    trendingAll: {
      title: "グローバルトレンド動画",
      subtitle: "すべてのプラットフォームで人気のクリップを発見しましょう。",
      description: "TikTok、Twitter、Redditなどからトレンド動画を1つの場所でチェックできます。",
    },
    latestAll: {
      title: "最新のグローバル抽出",
      subtitle: "今まさに保存されているコンテンツを確認しましょう。",
      description: "ClipKeepでアーカイブされている最新メディアをリアルタイムフィードで表示します。",
    },
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
    },
    latestReddit: {
      title: "Reddit 最近のダウンロード",
      description: "Redditのコミュニティから抽出された最新の動画やメディアをチェックしましょう。",
      subtitle: "直近に作成されたRedditのアーカイブ"
    },
    trendingReddit: {
      title: "Reddit トレンド動画",
      description: "Redditで現在話題になっている人気の動画クリップを探索しましょう。",
      subtitle: "今Redditで最も注目されているメディア"
    },
    latestPinterest: {
      title: "Pinterest 最近のダウンロード",
      description: "Pinterestから新しく保存されたビデオピンや画像をリアルタイムで表示。",
      subtitle: "直近のPinterestアーカイブ"
    },
    trendingPinterest: {
      title: "Pinterest トレンドピン",
      description: "Pinterestで現在人気のビデオピンやおしゃれなコンテンツを発見しましょう。",
      subtitle: "今Pinterestで話題のビジュアル"
    },
    latestThreads: {
      title: "Threads 最近のダウンロード",
      description: "Threadsから抽出された最新の動画やメディアをチェックしましょう。",
      subtitle: "直近のThreadsアーカイブ"
    },
    trendingThreads: {
      title: "Threads トレンド動画",
      description: "Threads で現在話題のバイラル動画を探索しましょう。",
      subtitle: "今Threadsで最も注目されているメディア"
    },
    latestBluesky: {
      title: "Bluesky 最近のダウンロード",
      description: "Bluesky SNSから新しく保存された動画や画像をリアルタイムでチェック。",
      subtitle: "直近のBlueskyアーカイブ"
    },
    trendingBluesky: {
      title: "Bluesky トレンドクリップ",
      description: "Blueskyコミュニティで現在人気のバイラルメディアを発見しましょう。",
      subtitle: "今Blueskyで話題のコンテンツ"
    },
    latestLemon8: {
      title: "Lemon8 最近のダウンロード",
      description: "Lemon8から新しく抽出されたおしゃれなライフスタイル動画を紹介。",
      subtitle: "直近のLemon8アーカイブ"
    },
    trendingLemon8: {
      title: "Lemon8 トレンド動画",
      description: "Lemon8で現在人気のファッションやライフスタイルクリップをチェック。",
      subtitle: "今Lemon8で話題のメディア"
    },
    latestBilibili: {
      title: "Bilibili 最近のダウンロード",
      description: "Bilibiliから新しく抽出されたアニメや動画クリップをチェックしましょう。",
      subtitle: "直近のBilibiliアーカイブ"
    },
    trendingBilibili: {
      title: "Bilibili トレンドクリップ",
      description: "Bilibiliで現在最も人気のあるアニメやクリップを探索しましょう。",
      subtitle: "今Bilibiliで話題のコンテンツ"
    },
    latestDiscord: {
      title: "Discord 最近のダウンロード",
      description: "Discord CDN経由で新しく保存された動画や画像を探索しましょう。",
      subtitle: "直近のDiscordアーカイブ"
    },
    trendingDiscord: {
      title: "Discord トレンドメディア",
      description: "Discordサーバーで頻繁に共有されている人気のクリップをチェック。",
      subtitle: "今Discordで話題のコンテンツ"
    },
    latestFacebook: {
      title: "Facebook 最近のダウンロード",
      description: "Facebookから新しく保存された動画やストーリーをリアルタイムで表示。",
      subtitle: "直近のFacebookアーカイブ"
    },
    trendingFacebook: {
      title: "Facebook トレンド動画",
      description: "Facebookのコミュニティで現在人気のバイラルリールやストーリーをチェック。",
      subtitle: "今Facebookで話題のメディア"
    }
  },
  ar: {
    trendingAll: {
      title: "فيديوهات رائجة عالمياً",
      subtitle: "اكتشف المقاطع الأكثر شعبية عبر جميع المنصات.",
      description: "شاهد فيديوهات تيك توك وتويتر وريديت وغيرها الرائجة في مكان واحد.",
    },
    latestAll: {
      title: "أحدث التنزيلات العالمية",
      subtitle: "شاهد ما استخرجه المستخدمون للتو.",
      description: "خلاصة حية لأحدث الوسائط التي تمت أرشفتها على كليبي كيب.",
    },
    trendingTwitter: { title: "فيديوهات تويتر (X) الرائجة", subtitle: "شاهد أشهر فيديوهات تويتر اليوم.", description: "اكتشف المقاطع المنتشرة وأخبار تويتر." },
    trendingTiktok: { title: "فيديوهات تيك توك الرائجة", subtitle: "أشهر مقاطع تيك توك من حول العالم.", description: "تابع أحدث صيحات تيك توك." },
    trendingTelegram: { title: "وسائط تيليجرام الرائجة", subtitle: "الفيديوهات والملفات الشهيرة من قنوات تيليجرام.", description: "استكشف الوسائط الأكثر تحميلاً." },
    latestTwitter: { title: "آخر تنزيلات تويتر (X)", subtitle: "فيديوهات تويتر التي تم استخراجها مؤخراً.", description: "شاهد ما يتم تحميله الآن." },
    latestTiktok: { title: "آخر تنزيلات تيك توك", subtitle: "أحدث مقاطع تيك توك المعالجة.", description: "اكتشف المحتوى الجديد." },
    latestTelegram: { title: "آخر تنزيلات تيليجرام", subtitle: "وسائط تيليجرام التي تم استخراجها مؤخراً.", description: "أحدث ملفات قنوات تيليجرام." },
    latestReddit: { title: "آخر تنزيلات Reddit", subtitle: "فيديوهات Reddit التي تم استخراجها مؤخراً.", description: "شاهد ما يتم حفظه من Reddit الآن." },
    trendingReddit: { title: "فيديوهات Reddit الرائجة", subtitle: "أشهر مقاطع Reddit اليوم.", description: "اكتشف المحتوى الشائع في مجتمعات Reddit." },
    latestPinterest: { title: "آخر تنزيلات Pinterest", subtitle: "دبابيس فيديو جديدة تمت معالجتها.", description: "نظرة مباشرة على الفيديوهات الجمالية المحفوظة." },
    trendingPinterest: { title: "دبابيس Pinterest الرائجة", subtitle: "أشهر دبابيس الفيديو والمحتوى الجمالي.", description: "اكتشف ما يلهم العالم على Pinterest." },
    latestThreads: { title: "آخر تنزيلات Threads", subtitle: "مقاطع Threads التي تم حفظها مؤخراً.", description: "تابع أحدث الوسائط المؤرشفة من شبكة Threads." },
    trendingThreads: { title: "فيديوهات Threads الرائجة", subtitle: "أشهر اللحظات والوسائط على Threads.", description: "اكتشف الفيديوهات الأكثر تداولاً على Threads." },
    latestBluesky: { title: "آخر تنزيلات Bluesky", subtitle: "وسائط جديدة من شبكة Bluesky.", description: "أحدث الفيديوهات والصور من Bluesky." },
    trendingBluesky: { title: "مقاطع Bluesky الرائجة", subtitle: "أشهر منشورات Bluesky الآن.", description: "اكتشف الوسائط المنتشرة في مجتمع Bluesky." },
    latestLemon8: { title: "آخر تنزيلات Lemon8", subtitle: "فيديوهات جمالية من Lemon8.", description: "اكتشف أحدث مقاطع الموضة وأسلوب الحياة." },
    trendingLemon8: { title: "فيديوهات Lemon8 الرائجة", subtitle: "أشهر مقاطع أسلوب الحياة والجمال.", description: "تابع الترند على Lemon8 اليوم." },
    latestBilibili: { title: "آخر تنزيلات Bilibili", subtitle: "مقاطع وأنمي من Bilibili.", description: "شاهد الجديد في عالم Bilibili." },
    trendingBilibili: { title: "مقاطع Bilibili الرائجة", subtitle: "أشهر فيديوهات الأنمي على Bilibili.", description: "اكتشف المقاطع الرائجة على Bilibili." },
    latestDiscord: { title: "آخر تنزيلات Discord", subtitle: "وسائط محفوظة من روابط Discord.", description: "استكشف أحدث الفيديوهات والصور المشاركة." },
    trendingDiscord: { title: "وسائط Discord الرائجة", subtitle: "أشهر المقاطع المؤرشفة من Discord.", description: "تابع الوسائط الأكثر مشاركة في سيرفرات Discord." },
    latestFacebook: { title: "آخر تنزيلات فيسبوك", subtitle: "فيديوهات وقصص فيسبوك المحفوظة مؤخراً.", description: "استكشف أحدث الوسائط المؤرشفة من فيسبوك." },
    trendingFacebook: { title: "فيديوهات فيسبوك الرائجة", subtitle: "أشهر الريلز والقصص على فيسبوك.", description: "اكتشف الرائج في مجتمعات فيسبوك اليوم." }
  },
  es: {
    trendingAll: {
      title: "Videos de Tendencia Global",
      subtitle: "Descubre los clips más populares en todas las plataformas.",
      description: "Mira videos de tendencia de TikTok, Twitter, Reddit y más en un solo lugar.",
    },
    latestAll: {
      title: "Últimas Descargas Globales",
      subtitle: "Mira lo que la gente está extrayendo ahora mismo.",
      description: "Un feed en tiempo real de los últimos medios archivados en ClipKeep.",
    },
    trendingTwitter: { title: "Tendencias de Twitter (X)", subtitle: "Mira los videos más populares de Twitter hoy.", description: "Descubre clips virales y noticias de Twitter (X)." },
    trendingTiktok: { title: "Tendencias de TikTok", subtitle: "Clips virales de TikTok de todo el mundo.", description: "Mantente al día con lo más popular." },
    trendingTelegram: { title: "Tendencias de Telegram", subtitle: "Videos y archivos populares de canales de Telegram.", description: "Explora los archivos más descargados." },
    latestTwitter: { title: "Últimas descargas de Twitter (X)", subtitle: "Videos de Twitter extraídos recientemente.", description: "Mira lo que otros están descargando." },
    latestTiktok: { title: "Últimas descargas de TikTok", subtitle: "Video de TikTok procesados recientemente.", description: "Mira el contenido más nuevo." },
    latestTelegram: { title: "Últimas descargas de Telegram", subtitle: "Media de Telegram extraída recientemente.", description: "Descubre los archivos más nuevos." },
    latestReddit: { title: "Últimas descargas de Reddit", subtitle: "Videos de Reddit extraídos recientemente.", description: "Mira lo que el mundo está guardando de Reddit ahora mismo." },
    trendingReddit: { title: "Tendencias de Reddit", subtitle: "Los clips más populares de Reddit hoy.", description: "Descubre gemas virales en las comunidades de Reddit." },
    latestPinterest: { title: "Últimas descargas de Pinterest", subtitle: "Nuevos pines de video procesados.", description: "Mirada en tiempo real a videos estéticos guardados." },
    trendingPinterest: { title: "Pines de tendencia en Pinterest", subtitle: "Pines de video virales y contenido estético.", description: "Explora lo que inspira al mundo en Pinterest." },
    latestThreads: { title: "Últimas descargas de Threads", subtitle: "Clips de Threads guardados recientemente.", description: "Mantente al día con los nuevos medios de Threads." },
    trendingThreads: { title: "Tendencias de Threads", subtitle: "Momentos virales y medios populares en Threads.", description: "Descubre los videos más comentados en Threads." },
    latestBluesky: { title: "Últimas descargas de Bluesky", subtitle: "Nuevos medios guardados de Bluesky.", description: "Los videos e imágenes más recientes de Bluesky." },
    trendingBluesky: { title: "Clips de tendencia en Bluesky", subtitle: "Posts más populares en Bluesky ahora.", description: "Descubre medios virales en la comunidad Bluesky." },
    latestLemon8: { title: "Últimas descargas de Lemon8", subtitle: "Videos estéticos guardados de Lemon8.", description: "Explora los clips de estilo de vida y moda." },
    trendingLemon8: { title: "Tendencias de Lemon8", subtitle: "Clips virales de estilo de vida y estética.", description: "Mira lo que es tendencia en Lemon8 hoy." },
    latestBilibili: { title: "Últimas descargas de Bilibili", subtitle: "Clips y animaciones de Bilibili.", description: "Mira lo nuevo en el mundo de Bilibili." },
    trendingBilibili: { title: "Clips de tendencia en Bilibili", subtitle: "Las animaciones más populares de Bilibili hoy.", description: "Descubre clips populares y favoritos de Bilibili." },
    latestDiscord: { title: "Últimas descargas de Discord", subtitle: "Medios guardados de Discord CDN.", description: "Explora los videos e imágenes compartidos en Discord." },
    trendingDiscord: { title: "Tendencias de medios en Discord", subtitle: "Clips populares archivados de Discord.", description: "Mantente al día con los medios más compartidos de Discord." },
    latestFacebook: { title: "Últimas descargas de Facebook", subtitle: "Videos y historias recientes de Facebook.", description: "Explora los medios más nuevos archivados de Facebook." },
    trendingFacebook: { title: "Tendencias de Facebook", subtitle: "Reels e historias virales de Facebook.", description: "Descubre lo que es tendencia en Facebook hoy." }
  },
  pt: {
    trendingAll: {
      title: "Vídeos de Tendência Global",
      subtitle: "Descubra os clipes mais populares em todas as plataformas.",
      description: "Assista a vídeos de tendência do TikTok, Twitter, Reddit e muito mais em um só lugar.",
    },
    latestAll: {
      title: "Últimos Downloads Globais",
      subtitle: "Veja o que as pessoas estão extraindo agora.",
      description: "Um feed em tempo real das últimas mídias arquivadas no ClipKeep.",
    },
    trendingTwitter: { title: "Tendências do Twitter (X)", subtitle: "Veja os vídeos mais populares do Twitter hoje.", description: "Descubra clipes virais e notícias do Twitter (X)." },
    trendingTiktok: { title: "Tendências do TikTok", subtitle: "Clipes virais do TikTok de todo o mundo.", description: "Fique por dentro do que é popular." },
    trendingTelegram: { title: "Tendências do Telegram", subtitle: "Vídeos e arquivos populares de canais do Telegram.", description: "Explore as mídias mais baixadas." },
    latestTwitter: { title: "Últimos downloads do Twitter (X)", subtitle: "Vídeos do Twitter extraídos recentemente.", description: "Veja o que outros estão baixando." },
    latestTiktok: { title: "Últimos downloads do TikTok", subtitle: "Conteúdo do TikTok processado recentemente.", description: "Veja o conteúdo mais novo." },
    latestTelegram: { title: "Últimos downloads do Telegram", subtitle: "Mídia do Telegram extraída recentemente.", description: "Descubra os arquivos novos." },
    latestReddit: { title: "Últimos downloads do Reddit", subtitle: "Vídeos do Reddit extraídos recentemente.", description: "Veja o que o mundo está salvando do Reddit agora." },
    trendingReddit: { title: "Tendências do Reddit", subtitle: "Os clipes mais populares do Reddit hoje.", description: "Descubra joias virais nas comunidades do Reddit." },
    latestPinterest: { title: "Últimos downloads do Pinterest", subtitle: "Novos pins de vídeo processados.", description: "Olhar em tempo real para vídeos estéticos salvos." },
    trendingPinterest: { title: "Pins de tendência no Pinterest", subtitle: "Pins de vídeo virais e conteúdo estético.", description: "Explore o que inspira o mundo no Pinterest." },
    latestThreads: { title: "Últimos downloads do Threads", subtitle: "Clips do Threads salvos recentemente.", description: "Mantenha-se atualizado com as novas mídias do Threads." },
    trendingThreads: { title: "Tendências do Threads", subtitle: "Momentos virais e mídias populares no Threads.", description: "Descubra os vídeos mais comentados no Threads." },
    latestBluesky: { title: "Últimos downloads do Bluesky", subtitle: "Novas mídias salvas do Bluesky.", description: "Os vídeos e imagens mais recentes do Bluesky." },
    trendingBluesky: { title: "Clips de tendência no Bluesky", subtitle: "Posts mais populares no Bluesky agora.", description: "Descubra mídias virais na comunidade Bluesky." },
    latestLemon8: { title: "Últimos downloads do Lemon8", subtitle: "Vídeos estéticos salvos do Lemon8.", description: "Explore os clipes de estilo de vida e moda." },
    trendingLemon8: { title: "Tendências do Lemon8", subtitle: "Clips virais de estilo de vida e estética.", description: "Veja o que é tendência no Lemon8 hoje." },
    latestBilibili: { title: "Últimos downloads do Bilibili", subtitle: "Clips e animações do Bilibili.", description: "Veja o que há de novo no mundo do Bilibili." },
    trendingBilibili: { title: "Clips de tendência no Bilibili", subtitle: "As animações mais populares do Bilibili hoje.", description: "Descubra clipes populares e favoritos do Bilibili." },
    latestDiscord: { title: "Últimos downloads do Discord", subtitle: "Mídias salvas do Discord CDN.", description: "Explore os vídeos e imagens compartilhados no Discord." },
    trendingDiscord: { title: "Tendências de mídia no Discord", subtitle: "Clips populares arquivados do Discord.", description: "Mantenha-se atualizado com as mídias mais compartilhadas do Discord." },
    latestFacebook: { title: "Últimos downloads do Facebook", subtitle: "Vídeos e stories recentes do Facebook.", description: "Explore as mídias mais novas arquivadas do Facebook." },
    trendingFacebook: { title: "Tendências do Facebook", subtitle: "Reels e stories virais do Facebook.", description: "Descubra o que é tendência no Facebook hoje." }
  },
  fr: {
    trendingAll: {
      title: "Vidéos Tendances Mondiales",
      subtitle: "Découvrez les clips les plus populaires sur toutes les plateformes.",
      description: "Regardez les vidéos tendances de TikTok, Twitter, Reddit et plus en un seul endroit.",
    },
    latestAll: {
      title: "Derniers Téléchargements Mondiaux",
      subtitle: "Voyez ce que les gens extraient en ce moment.",
      description: "Un flux en temps réel des derniers médias archivés sur ClipKeep.",
    },
    trendingTwitter: { title: "Tendances Twitter (X)", subtitle: "Regardez les vidéos Twitter les plus populaires.", description: "Découvrez les clips viraux et l'actualité de Twitter (X)." },
    trendingTiktok: { title: "Tendances TikTok", subtitle: "Clips viraux TikTok du monde entier.", description: "Restez au courant des nouveautés." },
    trendingTelegram: { title: "Tendances Telegram", subtitle: "Vidéos et fichiers populaires des canaux Telegram.", description: "Explorez les médias les plus téléchargés." },
    latestTwitter: { title: "Derniers téléchargements Twitter (X)", subtitle: "Vidéos Twitter extraites récemment.", description: "Voyez ce que les autres téléchargent." },
    latestTiktok: { title: "Derniers téléchargements TikTok", subtitle: "Contenu TikTok traité récemment.", description: "Regardez les nouveaux contenus." },
    latestTelegram: { title: "Derniers téléchargements Telegram", subtitle: "Médias Telegram extraits récemment.", description: "Découvrez les fichiers récents." },
    latestReddit: { title: "Derniers téléchargements Reddit", subtitle: "Vidéos Reddit extraites récemment.", description: "Découvrez ce que le monde sauvegarde de Reddit en ce moment." },
    trendingReddit: { title: "Tendances Reddit", subtitle: "Les clips les plus populaires de Reddit aujourd'hui.", description: "Découvrez des pépites virales dans les communautés Reddit." },
    latestPinterest: { title: "Derniers téléchargements Pinterest", subtitle: "Nouvelles épingles vidéo traitées.", description: "Regardez en temps réel les vidéos esthétiques sauvegardées." },
    trendingPinterest: { title: "Épingles tendance sur Pinterest", subtitle: "Épingles vidéo virales et contenu esthétique.", description: "Explorez ce qui inspire le monde sur Pinterest." },
    latestThreads: { title: "Derniers téléchargements Threads", subtitle: "Clips Threads sauvegardés récemment.", description: "Restez à jour avec les nouveaux médias de Threads." },
    trendingThreads: { title: "Tendances Threads", subtitle: "Moments viraux et médias populaires sur Threads.", description: "Découvrez les vidéos les plus commentées sur Threads." },
    latestBluesky: { title: "Derniers téléchargements Bluesky", subtitle: "Nouveaux médias sauvegardés de Bluesky.", description: "Les vidéos et images les plus récentes de Bluesky." },
    trendingBluesky: { title: "Clips tendance sur Bluesky", subtitle: "Posts les plus populaires sur Bluesky en ce moment.", description: "Découvrez des médias viraux dans la communauté Bluesky." },
    latestLemon8: { title: "Derniers téléchargements Lemon8", subtitle: "Vidéos esthétiques sauvegardées de Lemon8.", description: "Explorez les clips lifestyle et mode." },
    trendingLemon8: { title: "Tendances Lemon8", subtitle: "Clips viraux lifestyle et esthétiques.", description: "Regardez ce qui est tendance sur Lemon8 aujourd'hui." },
    latestBilibili: { title: "Derniers téléchargements Bilibili", subtitle: "Clips et animations de Bilibili.", description: "Découvrez les nouveautés du monde Bilibili." },
    trendingBilibili: { title: "Clips tendance sur Bilibili", subtitle: "Les animations les plus populaires de Bilibili aujourd'hui.", description: "Découvrez des clips populaires et favoris sur Bilibili." },
    latestDiscord: { title: "Derniers téléchargements Discord", subtitle: "Médias sauvegardés depuis Discord CDN.", description: "Explorez les vidéos et images partagées sur Discord." },
    trendingDiscord: { title: "Tendances médias sur Discord", subtitle: "Clips populaires archivés depuis Discord.", description: "Restez à jour avec les médias les plus partagés sur Discord." },
    latestFacebook: { title: "Derniers téléchargements Facebook", subtitle: "Vidéos et stories récentes de Facebook.", description: "Explorez les nouveaux médias archivés de Facebook." },
    trendingFacebook: { title: "Tendances Facebook", subtitle: "Reels et stories virals de Facebook.", description: "Découvrez ce qui est tendance sur Facebook aujourd'hui." }
  },
  id: {
    trendingAll: {
      title: "Video Tren Global",
      subtitle: "Temukan klip paling populer di semua platform.",
      description: "Tonton video tren dari TikTok, Twitter, Reddit, dan lainnya di satu tempat.",
    },
    latestAll: {
      title: "Unduhan Global Terbaru",
      subtitle: "Lihat apa yang sedang diekstrak orang saat ini.",
      description: "Umpan waktu nyata dari media terbaru yang diarsipkan di ClipKeep.",
    },
    trendingTwitter: { title: "Tren Video Twitter (X)", subtitle: "Tonton video Twitter paling populer hari ini.", description: "Temukan klip viral dan berita Twitter (X)." },
    trendingTiktok: { title: "Tren Video TikTok", subtitle: "Klip viral TikTok dari seluruh dunia.", description: "Tetap update dengan tren terbaru." },
    trendingTelegram: { title: "Tren Media Telegram", subtitle: "Video dan file populer dari saluran Telegram.", description: "Jelajahi media yang paling banyak diunduh." },
    latestTwitter: { title: "Unduhan Twitter (X) Terbaru", subtitle: "Video Twitter yang baru saja diekstrak.", description: "Lihat apa yang diunduh orang lain." },
    latestTiktok: { title: "Unduhan TikTok Terbaru", subtitle: "Konten TikTok yang baru saja diproses.", description: "Lihat konten TikTok terbaru." },
    latestTelegram: { title: "Unduhan Telegram Terbaru", subtitle: "Media Telegram yang baru saja diekstrak.", description: "Temukan file Telegram terbaru." },
    latestReddit: { title: "Unduhan Reddit Terbaru", subtitle: "Video Reddit yang baru saja diekstrak.", description: "Lihat apa yang disimpan dunia dari Reddit sekarang." },
    trendingReddit: { title: "Tren Reddit", subtitle: "Klip Reddit paling populer hari ini.", description: "Temukan permata viral di komunitas Reddit." },
    latestPinterest: { title: "Unduhan Pinterest Terbaru", subtitle: "Pin video baru yang diproses.", description: "Melihat video estetika yang disimpan secara real-time." },
    trendingPinterest: { title: "Pin Tren di Pinterest", subtitle: "Pin video viral dan konten estetika.", description: "Jelajahi apa yang menginspirasi dunia di Pinterest." },
    latestThreads: { title: "Unduhan Threads Terbaru", subtitle: "Klip Threads yang baru saja disimpan.", description: "Tetap update dengan media baru dari Threads." },
    trendingThreads: { title: "Tren Threads", subtitle: "Momen viral dan media populer di Threads.", description: "Temukan video yang paling banyak dibicarakan di Threads." },
    latestBluesky: { title: "Unduhan Bluesky Terbaru", subtitle: "Media baru yang disimpan dari Bluesky.", description: "Video dan gambar terbaru dari Bluesky." },
    trendingBluesky: { title: "Klip Tren di Bluesky", subtitle: "Postingan paling populer di Bluesky sekarang.", description: "Temukan media viral di komunitas Bluesky." },
    latestLemon8: { title: "Unduhan Lemon8 Terbaru", subtitle: "Video estetika yang baru saja disimpan dari Lemon8.", description: "Jelajahi klip gaya hidup dan fashion." },
    trendingLemon8: { title: "Tren Lemon8", subtitle: "Klip gaya hidup dan estetika viral.", description: "Lihat apa yang tren di Lemon8 hari ini." },
    latestBilibili: { title: "Unduhan Bilibili Terbaru", subtitle: "Klip dan animasi dari Bilibili.", description: "Lihat apa yang baru di dunia Bilibili." },
    trendingBilibili: { title: "Klip Tren di Bilibili", subtitle: "Animasi Bilibili paling populer hari ini.", description: "Temukan klip populer dan favorit dari Bilibili." },
    latestDiscord: { title: "Unduhan Discord Terbaru", subtitle: "Media yang disimpan dari Discord CDN.", description: "Jelajahi video dan gambar yang dibagikan di Discord." },
    trendingDiscord: { title: "Tren Media di Discord", subtitle: "Klip populer yang diarsipkan dari Discord.", description: "Tetap update dengan media yang paling banyak dibagikan di Discord." },
    latestFacebook: { title: "Unduhan Facebook Terbaru", subtitle: "Video dan cerita Facebook terbaru.", description: "Jelajahi media terbaru yang diarsipkan dari Facebook." },
    trendingFacebook: { title: "Tren Facebook", subtitle: "Reels dan cerita viral Facebook.", description: "Lihat apa yang tren di Facebook hari ini." }
  },
  hi: {
    trendingTwitter: { title: "ट्रेंडिंग ट्विटर (X) वीडियो", subtitle: "आज ट्विटर पर सबसे लोकप्रिय वीडियो देखें।", description: "वायरल क्लिप और ट्विटर समाचार खोजें।" },
    trendingTiktok: { title: "ट्रेंडिंग टिकटॉक वीडियो", subtitle: "दुनिया भर के वायरल टिकटॉक क्लिप।", description: "नवीनतम टिकटॉक ट्रेंड्स के साथ बने रहें।" },
    trendingTelegram: { title: "ट्रेंडिंग टेलीग्राम मीडिया", subtitle: "टेलीग्राम चैनलों से लोकप्रिय वीडियो और फाइलें।", description: "सबसे अधिक डाउनलोड किए गए मीडिया को एक्सप्लोर करें।" },
    latestTwitter: { title: "नवीनतम ट्विटर (X) डाउनलोड", subtitle: "हाल ही में ट्विटर से एक्सट्रैक्ट किए गए वीडियो।", description: "देखें कि दूसरे क्या डाउनलोड कर रहे हैं।" },
    latestTiktok: { title: "नवीनतम टिकटॉक डाउनलोड", subtitle: "अभी संसाधित किए गए नए टिकटॉक वीडियो।", description: "नवीनतम टिकटॉक कंटेंट देखें।" },
    latestTelegram: { title: "नवीनतम टेलीग्राम डाउनलोड", subtitle: "हाल ही में टेलीग्राम से निकाले गए मीडिया।", description: "नई टेलीग्राम फाइलें खोजें।" },
    latestReddit: { title: "नवीनतम Reddit डाउनलोड", subtitle: "हाल ही में Reddit से निकाले गए वीडियो।", description: "देखें कि दुनिया Reddit से क्या सहेज रही है।" },
    trendingReddit: { title: "ट्रेंडिंग Reddit वीडियो", subtitle: "आज Reddit पर सबसे लोकप्रिय क्लिप।", description: "Reddit समुदायों में वायरल रत्न खोजें।" },
    latestPinterest: { title: "नवीनतम Pinterest डाउनलोड", subtitle: "संसाधित नए वीडियो पिन।", description: "सहेजे गए सौंदर्य वीडियो पर रीयल-टाइम नज़र।" },
    trendingPinterest: { title: "Pinterest पर ट्रेंडिंग पिन", subtitle: "वायरल वीडियो पिन और सौंदर्य सामग्री।", description: "खोजें कि क्या दुनिया को Pinterest पर प्रेरित कर रहा है।" },
    latestThreads: { title: "नवीनतम Threads डाउनलोड", subtitle: "हाल ही में सहेजे गए Threads क्लिप।", description: "Threads नेटवर्क से नए मीडिया के साथ अपडेट रहें।" },
    trendingThreads: { title: "ट्रेंडिंग Threads वीडियो", subtitle: "Threads पर वायरल क्षण और लोकप्रिय मीडिया।", description: "Threads पर सबसे अधिक चर्चा वाले वीडियो खोजें।" },
    latestBluesky: { title: "नवीनतम Bluesky डाउनलोड", subtitle: "Bluesky से सहेजे गए नए मीडिया।", description: "Bluesky से नवीनतम वीडियो और छवियां।" },
    trendingBluesky: { title: "Bluesky पर ट्रेंडिंग क्लिप", subtitle: "Bluesky पर अभी सबसे लोकप्रिय पोस्ट।", description: "Bluesky समुदाय में वायरल मीडिया खोजें।" },
    latestLemon8: { title: "नवीनतम Lemon8 डाउनलोड", subtitle: "हाल ही में Lemon8 से सहेजे गए सौंदर्य वीडियो।", description: "नवीनतम जीवनशैली और फैशन क्लिप देखें।" },
    trendingLemon8: { title: "ट्रेंडिंग Lemon8 वीडियो", subtitle: "वायरल जीवनशैली और सौंदर्य क्लिप।", description: "देखें कि आज Lemon8 पर क्या ट्रेंड कर रहा है।" },
    latestBilibili: { title: "नवीनतम Bilibili डाउनलोड", subtitle: "Bilibili से निकाले गए क्लिप और एनिमेशन।", description: "Bilibili की दुनिया में नया क्या है देखें।" },
    trendingBilibili: { title: "Bilibili पर ट्रेंडिंग क्लिप", subtitle: "आज Bilibili पर सबसे लोकप्रिय एनिमेशन।", description: "Bilibili पर ट्रेंडिंग क्लिप और पसंदीदा खोजें।" },
    latestDiscord: { title: "नवीनतम Discord डाउनलोड", subtitle: "Discord CDN से सहेजे गए मीडिया।", description: "Discord लिंक के माध्यम से साझा किए गए नवीनतम वीडियो देखें।" },
    trendingDiscord: { title: "Discord पर ट्रेंडिंग मीडिया", subtitle: "Discord से सहेजे गए लोकप्रिय क्लिप।", description: "Discord सर्वर से सबसे अधिक साझा किए गए मीडिया के साथ अपडेट रहें।" },
    latestFacebook: { title: "नवीनतम Facebook डाउनलोड", subtitle: "Facebook से सहेजे गए हालिया वीडियो और कहानियां।", description: "Facebook से ClipKeep पर सहेजे गए नवीनतम मीडिया देखें।" },
    trendingFacebook: { title: "ट्रेंडिंग Facebook वीडियो", subtitle: "Facebook पर वायरल रील और कहानियां।", description: "देखें कि आज Facebook समुदायों में क्या ट्रेंड कर रहा है।" }
  },
  de: {
    trendingAll: {
      title: "Globale Trend-Videos",
      subtitle: "Entdecke die beliebtesten Clips auf allen Plattformen.",
      description: "Sieh dir Trend-Videos von TikTok, Twitter, Reddit und mehr an einem Ort an.",
    },
    latestAll: {
      title: "Neueste globale Downloads",
      subtitle: "Sieh dir an, was die Leute gerade extrahieren.",
      description: "Ein Echtzeit-Feed der neuesten auf ClipKeep archivierten Medien.",
    },
    trendingTwitter: { title: "Trending Twitter (X) Videos", subtitle: "Die beliebtesten Twitter-Videos von heute.", description: "Entdecke virale Clips und Twitter-News." },
    trendingTiktok: { title: "Trending TikTok Videos", subtitle: "Virale TikTok-Clips aus aller Welt.", description: "Bleib über aktuelle Trends informiert." },
    trendingTelegram: { title: "Trending Telegram Medien", subtitle: "Beliebte Videos von Telegram-Kanälen.", description: "Entdecke die meistgeladenen Dateien." },
    latestTwitter: { title: "Neueste Twitter (X) Downloads", subtitle: "Kürzlich extrahierte Twitter-Videos.", description: "Sieh dir an, was andere gerade laden." },
    latestTiktok: { title: "Neueste TikTok Downloads", subtitle: "Frisch verarbeitete TikTok-Clips.", description: "Entdecke den neuesten Content." },
    latestTelegram: { title: "Neueste Telegram Downloads", subtitle: "Kürzlich extrahierte Telegram-Medien.", description: "Finde neue Telegram-Dateien." },
    latestReddit: { title: "Neueste Reddit Downloads", subtitle: "Kürzlich extrahierte Reddit-Videos.", description: "Sieh dir an, was die Welt gerade von Reddit speichert." },
    trendingReddit: { title: "Trending Reddit Videos", subtitle: "Die beliebtesten Reddit-Clips von heute.", description: "Entdecke virale Highlights in den Reddit-Communities." },
    latestPinterest: { title: "Neueste Pinterest Downloads", subtitle: "Neu verarbeitete Video-Pins.", description: "Echtzeit-Einblick in gespeicherte ästhetische Videos." },
    trendingPinterest: { title: "Trending Pinterest Pins", subtitle: "Virale Video-Pins und ästhetischer Content.", description: "Entdecke, was die Welt auf Pinterest inspiriert." },
    latestThreads: { title: "Neueste Threads Downloads", subtitle: "Kürzlich gespeicherte Threads-Clips.", description: "Bleib auf dem Laufenden mit neuen Threads-Medien." },
    trendingThreads: { title: "Trending Threads Videos", subtitle: "Virale Momente und beliebte Medien auf Threads.", description: "Entdecke die meistdiskutierten Videos auf Threads." },
    latestBluesky: { title: "Neueste Bluesky Downloads", subtitle: "Neue gespeicherte Medien von Bluesky.", description: "Die neuesten Videos und Bilder von Bluesky." },
    trendingBluesky: { title: "Trending Bluesky Clips", subtitle: "Beliebteste Posts auf Bluesky aktuell.", description: "Entdecke virale Medien in der Bluesky-Community." },
    latestLemon8: { title: "Neueste Lemon8 Downloads", subtitle: "Gespeicherte ästhetische Lemon8-Videos.", description: "Entdecke Lifestyle- und Mode-Clips." },
    trendingLemon8: { title: "Trending Lemon8 Videos", subtitle: "Virale Lifestyle- und Ästhetik-Clips.", description: "Sieh dir an, was heute auf Lemon8 trendet." },
    latestBilibili: { title: "Neueste Bilibili Downloads", subtitle: "Clips und Animationen von Bilibili.", description: "Sieh dir die Neuheiten in der Bilibili-Welt an." },
    trendingBilibili: { title: "Trending Bilibili Clips", subtitle: "Die beliebtesten Animationen auf Bilibili heute.", description: "Entdecke trendige Clips und Favoriten auf Bilibili." },
    latestDiscord: { title: "Neueste Discord Downloads", subtitle: "Gespeicherte Medien vom Discord CDN.", description: "Entdecke die neuesten via Discord geteilten Medien." },
    trendingDiscord: { title: "Trending Discord Medien", subtitle: "Beliebte archivierte Clips von Discord.", description: "Bleib informiert über die meistgeteilten Discord-Medien." },
    latestFacebook: { title: "Neueste Facebook Downloads", subtitle: "Aktuelle Facebook-Videos und Storys.", description: "Entdecke die neuesten archivierten Facebook-Medien." },
    trendingFacebook: { title: "Trending Facebook Videos", subtitle: "Virale Reels und Storys auf Facebook.", description: "Sieh dir an, was in den Facebook-Communities trendet." }
  },
  tr: {
    trendingAll: {
      title: "Küresel Trend Videolar",
      subtitle: "Tüm platformlardaki en popüler klipleri keşfedin.",
      description: "TikTok, Twitter, Reddit ve daha fazlasındaki trend videoları tek bir yerden izleyin.",
    },
    latestAll: {
      title: "En Son Küresel İndirmeler",
      subtitle: "İnsanların şu anda ne ayıkladığını görün.",
      description: "ClipKeep'te arşivlenen en son medyaların gerçek zamanlı akışı.",
    },
    trendingTwitter: { title: "Popüler Twitter (X) Videoları", subtitle: "Bugün Twitter'daki en popüler videolar.", description: "Viral klipleri ve popüler Twitter haberlerini keşfedin." },
    trendingTiktok: { title: "Popüler TikTok Videoları", subtitle: "Dünyanın her yerinden viral TikTok videoları.", description: "En son trendlerden haberdar olun." },
    trendingTelegram: { title: "Popüler Telegram Medyaları", subtitle: "Telegram kanallarındaki popüler dosyalar.", description: "En çok indirilen medyaları keşfedin." },
    latestTwitter: { title: "Son Twitter (X) İndirmeleri", subtitle: "Yeni ayıklanan Twitter videoları.", description: "Diğerlerinin ne indirdiğine bakın." },
    latestTiktok: { title: "Son TikTok İndirmeleri", subtitle: "Yeni işlenen TikTok içerikleri.", description: "En yeni TikTok videolarına göz atın." },
    latestTelegram: { title: "Son Telegram İndirmeleri", subtitle: "Yeni ayıklanan Telegram medyaları.", description: "En yeni Telegram dosyalarını bulun." },
    latestReddit: { title: "Son Reddit İndirmeleri", subtitle: "Yeni ayıklanan Reddit videoları.", description: "Dünyanın Reddit'ten neler kaydettiğine bakın." },
    trendingReddit: { title: "Popüler Reddit Videoları", subtitle: "Reddit'teki en popüler klipler.", description: "Reddit topluluklarındaki viral içerikleri keşfedin." },
    latestPinterest: { title: "Son Pinterest İndirmeleri", subtitle: "İşlenen yeni video pinleri.", description: "Kaydedilen estetik videolara gerçek zamanlı bakış." },
    trendingPinterest: { title: "Popüler Pinterest Pinleri", subtitle: "Viral video pinleri ve estetik içerikler.", description: "Dünyanın Pinterest'te nelerden ilham aldığını görün." },
    latestThreads: { title: "Son Threads İndirmeleri", subtitle: "Yeni kaydedilen Threads klipleri.", description: "Threads ağından gelen yeni medyalarla güncel kalın." },
    trendingThreads: { title: "Popüler Threads Videoları", subtitle: "Threads'teki viral anlar ve popüler medya.", description: "Threads'te en çok konuşulan videoları keşfedin." },
    latestBluesky: { title: "Son Bluesky İndirmeleri", subtitle: "Bluesky'dan kaydedilen yeni medyalar.", description: "Bluesky'daki en yeni video ve görseller." },
    trendingBluesky: { title: "Popüler Bluesky Klipleri", subtitle: "Şu an Bluesky'daki en popüler içerikler.", description: "Bluesky topluluğundaki viral medyaları bulun." },
    latestLemon8: { title: "Son Lemon8 İndirmeleri", subtitle: "Limon8'den kaydedilen estetik videolar.", description: "En yeni yaşam tarzı ve moda kliplerini keşfedin." },
    trendingLemon8: { title: "Popüler Lemon8 Videoları", subtitle: "Viral yaşam tarzı ve estetik klipler.", description: "Lemon8'de bugün nelerin trend olduğunu görün." },
    latestBilibili: { title: "Son Bilibili İndirmeleri", subtitle: "Bilibili'den ayıklanan klipler ve animasyonlar.", description: "Bilibili dünyasındaki yeniliklere göz atın." },
    trendingBilibili: { title: "Popüler Bilibili Klipleri", subtitle: "Bilibili'deki en popüler animasyonlar.", description: "Bilibili'deki trend klipleri ve favorileri keşfedin." },
    latestDiscord: { title: "Son Discord İndirmeleri", subtitle: "Discord CDN'den kaydedilen medyalar.", description: "Discord üzerinden paylaşılan en yeni videoları görün." },
    trendingDiscord: { title: "Popüler Discord Medyaları", subtitle: "Discord'dan arşivlenen popüler klipler.", description: "Discord sunucularında en çok paylaşılan medyaları takip edin." },
    latestFacebook: { title: "Son Facebook İndirmeleri", subtitle: "Facebook'tan kaydedilen yeni videolar.", description: "Facebook'tan arşivlenen en yeni medyaları keşfedin." },
    trendingFacebook: { title: "Popüler Facebook Videoları", subtitle: "Facebook'taki viral Reels ve hikayeler.", description: "Facebook topluluklarında bugün nelerin trend olduğunu görün." }
  }
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

const faqBaseEn: FAQDict = {
  title: 'Frequently Asked Questions',
  lastUpdated: 'Last updated: 2026-03-19',
  items: [
    {
      question: 'What is ClipKeep?',
      answer: 'ClipKeep is a web tool for extracting media links from supported SNS pages for personal archiving workflows.',
    },
    {
      question: 'Which platforms are supported now?',
      answer: 'Current active support covers Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili, and Discord. Instagram remains maintenance-only.',
    },
    {
      question: 'Do I need an account?',
      answer: 'No. You can use the extraction flow without creating an account.',
    },
  ],
  stillQuestions: 'Still have questions?',
  contactSupport: 'Contact Support',
  contactText: 'If your question is not covered here, please contact us via the contact page.',
};

const legalBaseEn = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: 2026-03-19',
    sections: [
      { title: 'Data Handling', content: 'We process minimal request metadata required for operation, abuse prevention, and service reliability.' },
      { title: 'Cookies and Analytics', content: 'We may use cookies and analytics tags for measurement and operational improvement.' },
      { title: 'Contact', content: 'For privacy-related requests, contact us through the contact page.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: 2026-03-19',
    sections: [
      { title: 'Acceptable Use', content: 'Users must comply with applicable laws and source platform terms.' },
      { title: 'Service Scope', content: 'The service is provided as-is and may change based on upstream platform behavior.' },
      { title: 'User Responsibility', content: 'Users are responsible for their handling and reuse of extracted media.' },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    lastUpdated: 'Last updated: 2026-03-19',
    sections: [
      { title: 'Cookie Use', content: 'Cookies may be used for session continuity, analytics, and reliability controls.' },
      { title: 'Control', content: 'You can control cookies through your browser settings.' },
    ],
  },
  dmca: {
    title: 'DMCA / Copyright',
    lastUpdated: 'Last updated: 2026-03-19',
    sections: [
      { title: 'Copyright Notice', content: 'All media rights belong to their respective owners.' },
      { title: 'Report Process', content: 'If you believe content infringes rights, contact us with sufficient detail for review.' },
    ],
  },
};

export const faqText: Record<Locale, FAQDict> = {
  en: faqBaseEn,
  ar: {
    ...faqBaseEn,
    title: 'الأسئلة الشائعة',
    lastUpdated: 'آخر تحديث: 2026-03-19',
    stillQuestions: 'هل ما زالت لديك أسئلة؟',
    contactSupport: 'تواصل مع الدعم',
    contactText: 'إذا لم تجد إجابتك هنا، يرجى التواصل عبر صفحة الاتصال.',
  },
  ja: {
    ...faqBaseEn,
    title: 'よくある質問',
    lastUpdated: '最終更新: 2026-03-19',
    stillQuestions: 'まだ質問がありますか？',
    contactSupport: 'サポートに連絡',
    contactText: 'ここで解決しない場合は、お問い合わせページからご連絡ください。',
  },
  es: {
    ...faqBaseEn,
    title: 'Preguntas Frecuentes',
    lastUpdated: 'Última actualización: 2026-03-19',
    items: [
      {
        question: '¿Qué es ClipKeep?',
        answer: 'ClipKeep es una herramienta web para extraer enlaces de medios desde páginas SNS compatibles para flujos de archivado personal.',
      },
      {
        question: '¿Qué plataformas están soportadas ahora?',
        answer: 'El soporte activo actual cubre Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili y Discord. Instagram permanece solo en mantenimiento.',
      },
      {
        question: '¿Necesito una cuenta?',
        answer: 'No. Puedes usar el flujo de extracción sin crear una cuenta.',
      },
    ],
    stillQuestions: '¿Aún tienes preguntas?',
    contactSupport: 'Contactar soporte',
    contactText: 'Si tu pregunta no aparece aquí, contáctanos desde la página de contacto.',
  },
  pt: {
    ...faqBaseEn,
    title: 'Perguntas Frequentes',
    lastUpdated: 'Última atualização: 2026-03-19',
    items: [
      {
        question: 'O que é o ClipKeep?',
        answer: 'O ClipKeep é uma ferramenta web para extrair links de mídia de páginas SNS suportadas para fluxos de arquivamento pessoal.',
      },
      {
        question: 'Quais plataformas são suportadas agora?',
        answer: 'O suporte ativo atual cobre Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili e Discord. O Instagram permanece apenas em manutenção.',
      },
      {
        question: 'Preciso de uma conta?',
        answer: 'Não. Você pode usar o fluxo de extração sem criar uma conta.',
      },
    ],
    stillQuestions: 'Ainda tem dúvidas?',
    contactSupport: 'Contatar Suporte',
    contactText: 'Se a sua pergunta não estiver coberta aqui, entre em contato conosco através da página de contato.',
  },
  fr: {
    ...faqBaseEn,
    title: 'Questions Fréquentes',
    lastUpdated: 'Dernière mise à jour: 2026-03-19',
    items: [
      {
        question: 'Qu\'est-ce que ClipKeep ?',
        answer: 'ClipKeep est un outil web permettant d\'extraire des liens multimédias à partir de pages SNS prises en charge pour des flux d\'archivage personnels.',
      },
      {
        question: 'Quelles plateformes sont prises en charge actuellement ?',
        answer: 'Le support actif actuel couvre Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili et Discord. Instagram reste en mode maintenance uniquement.',
      },
      {
        question: 'Ai-je besoin d\'un compte ?',
        answer: 'Non. Vous pouvez utiliser le flux d\'extraction sans créer de compte.',
      },
    ],
    stillQuestions: 'Vous avez encore des questions ?',
    contactSupport: 'Contacter le Support',
    contactText: 'Si votre question n\'est pas traitée ici, veuillez nous contacter via la page de contact.',
  },
  id: {
    ...faqBaseEn,
    title: 'Pertanyaan Umum',
    lastUpdated: 'Pembaruan terakhir: 2026-03-19',
    items: [
      {
        question: 'Apa itu ClipKeep?',
        answer: 'ClipKeep adalah alat web untuk mengekstrak tautan media dari halaman SNS yang didukung untuk alur kerja pengarsipan pribadi.',
      },
      {
        question: 'Platform mana saja yang didukung sekarang?',
        answer: 'Dukungan aktif saat ini mencakup Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili, dan Discord. Instagram tetap hanya untuk pemeliharaan.',
      },
      {
        question: 'Apakah saya memerlukan akun?',
        answer: 'Tidak. Anda dapat menggunakan alur ekstraksi tanpa membuat akun.',
      },
    ],
    stillQuestions: 'Masih punya pertanyaan?',
    contactSupport: 'Hubungi Dukungan',
    contactText: 'Jika pertanyaan Anda tidak tercakup di sini, silakan hubungi kami melalui halaman kontak.',
  },
  hi: {
    ...faqBaseEn,
    title: 'सामान्य प्रश्न',
    lastUpdated: 'अंतिम अपडेट: 2026-03-19',
    items: [
      {
        question: 'ClipKeep क्या है?',
        answer: 'ClipKeep व्यक्तिगत आर्काइविंग वर्कफ़्लो के लिए समर्थित SNS पेजों से मीडिया लिंक निकालने का एक वेब टूल है।',
      },
      {
        question: 'अभी कौन से प्लेटफॉर्म समर्थित हैं?',
        answer: 'वर्तमान सक्रिय समर्थन में टेलीग्राम, X (ट्विटर), टिकटॉक, Reddit, Pinterest, फेसबुक, Threads, Bluesky, Lemon8, Bilibili और Discord शामिल हैं। इंस्टाग्राम केवल रखरखाव मोड में है।',
      },
      {
        question: 'क्या मुझे एक खाते की आवश्यकता है?',
        answer: 'नहीं। आप खाता बनाए बिना निष्कर्षण प्रवाह का उपयोग कर सकते हैं।',
      },
    ],
    stillQuestions: 'अभी भी प्रश्न हैं?',
    contactSupport: 'सहायता से संपर्क करें',
    contactText: 'यदि आपका प्रश्न यहाँ शामिल नहीं है, तो कृपया संपर्क पृष्ठ के माध्यम से हमसे संपर्क करें।',
  },
  de: {
    ...faqBaseEn,
    title: 'Häufige Fragen',
    lastUpdated: 'Zuletzt aktualisiert: 2026-03-19',
    items: [
      {
        question: 'Was ist ClipKeep?',
        answer: 'ClipKeep ist ein Webtool zum Extrahieren von Medienlinks von unterstützten SNS-Seiten für persönliche Archivierungs-Workflows.',
      },
      {
        question: 'Welche Plattformen werden derzeit unterstützt?',
        answer: 'Derzeit werden Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili und Discord aktiv unterstützt. Instagram befindet sich im Wartungsmodus.',
      },
      {
        question: 'Benötige ich ein Konto?',
        answer: 'Nein. Sie können den Extraktionsflow nutzen, ohne ein Konto zu erstellen.',
      },
    ],
    stillQuestions: 'Haben Sie noch Fragen?',
    contactSupport: 'Support kontaktieren',
    contactText: 'Wenn Ihre Frage hier nicht beantwortet wird, kontaktieren Sie uns bitte über die Kontaktseite.',
  },
  tr: {
    ...faqBaseEn,
    title: 'Sık Sorulan Sorular',
    lastUpdated: 'Son güncelleme: 2026-03-19',
    items: [
      {
        question: 'ClipKeep nedir?',
        answer: 'ClipKeep, kişisel arşivleme iş akışları için desteklenen SNS sayfalarından medya bağlantılarını ayıklamaya yarayan bir web aracıdır.',
      },
      {
        question: 'Şu an hangi platformlar destekleniyor?',
        answer: 'Şu anki aktif destek Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili ve Discord\'u kapsamaktadır. Instagram yalnızca bakım modundadır.',
      },
      {
        question: 'Bir hesaba ihtiyacım var mı?',
        answer: 'Hayır. Herhangi bir hesap oluşturmadan ayıklama akışını kullanabilirsiniz.',
      },
    ],
    stillQuestions: 'Hâlâ sorularınız mı var?',
    contactSupport: 'Destekle İletişime Geç',
    contactText: 'Eğer sorunuz burada yer almıyorsa, lütfen iletişim sayfası üzerinden bizimle iletişime geçin.',
  },
};

function localizeLegalTitle(locale: Locale, key: 'privacy' | 'terms' | 'cookies' | 'dmca'): string {
  const map: Record<Locale, Record<typeof key, string>> = {
    en: { privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy', dmca: 'DMCA / Copyright' },
    ar: { privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', cookies: 'سياسة ملفات تعريف الارتباط', dmca: 'DMCA / حقوق النشر' },
    ja: { privacy: 'プライバシーポリシー', terms: '利用規約', cookies: 'クッキーポリシー', dmca: 'DMCA / 著作権' },
    es: { privacy: 'Política de Privacidad', terms: 'Términos del Servicio', cookies: 'Política de Cookies', dmca: 'DMCA / Copyright' },
    pt: { privacy: 'Política de Privacidade', terms: 'Termos de Serviço', cookies: 'Política de Cookies', dmca: 'DMCA / Copyright' },
    fr: { privacy: 'Politique de Confidentialité', terms: 'Conditions d\'utilisation', cookies: 'Politique de Cookies', dmca: 'DMCA / Copyright' },
    id: { privacy: 'Kebijakan Privasi', terms: 'Ketentuan Layanan', cookies: 'Kebijakan Cookie', dmca: 'DMCA / Hak Cipta' },
    hi: { privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', cookies: 'कुकी नीति', dmca: 'DMCA / कॉपीराइट' },
    de: { privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen', cookies: 'Cookie-Richtlinie', dmca: 'DMCA / Urheberrecht' },
    tr: { privacy: 'Gizlilik Politikası', terms: 'Hizmet Şartları', cookies: 'Çerez Politikası', dmca: 'DMCA / Telif Hakkı' },
  };
  return map[locale][key];
}

function legalByLocale(locale: Locale) {
  const localizedSections: Partial<Record<Locale, { privacy: LegalSection[]; terms: LegalSection[]; cookies: LegalSection[]; dmca: LegalSection[] }>> = {
    ar: {
      privacy: [
        { title: 'معالجة البيانات', content: 'نعالج الحد الأدنى من بيانات الطلب اللازمة للتشغيل ومنع الإساءة والحفاظ على موثوقية الخدمة.' },
        { title: 'ملفات تعريف الارتباط والتحليلات', content: 'قد نستخدم ملفات تعريف الارتباط وعلامات التحليلات لأغراض القياس وتحسين التشغيل.' },
        { title: 'التواصل', content: 'للطلبات المتعلقة بالخصوصية، يرجى التواصل معنا عبر صفحة الاتصال.' },
      ],
      terms: [
        { title: 'الاستخدام المقبول', content: 'يجب على المستخدمين الالتزام بالقوانين المعمول بها وشروط المنصة الأصلية.' },
        { title: 'نطاق الخدمة', content: 'تُقدَّم الخدمة كما هي، وقد تتغير وفقًا لتغيرات المنصات المصدر.' },
        { title: 'مسؤولية المستخدم', content: 'المستخدم مسؤول عن كيفية التعامل مع الوسائط المستخرجة وإعادة استخدامها.' },
      ],
      cookies: [
        { title: 'استخدام ملفات تعريف الارتباط', content: 'قد تُستخدم ملفات تعريف الارتباط لاستمرارية الجلسة والتحليلات وضبط الموثوقية.' },
        { title: 'التحكم', content: 'يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.' },
      ],
      dmca: [
        { title: 'إشعار حقوق النشر', content: 'جميع حقوق الوسائط تعود إلى مالكيها الأصليين.' },
        { title: 'آلية الإبلاغ', content: 'إذا كنت تعتقد بوجود انتهاك للحقوق، تواصل معنا مع تفاصيل كافية لمراجعة البلاغ.' },
      ],
    },
    es: {
      privacy: [
        { title: 'Tratamiento de datos', content: 'Procesamos el mínimo de metadatos de solicitud necesarios para operación, prevención de abuso y fiabilidad del servicio.' },
        { title: 'Cookies y analítica', content: 'Podemos usar cookies y etiquetas de analítica para medición y mejora operativa.' },
        { title: 'Contacto', content: 'Para solicitudes relacionadas con privacidad, contáctanos mediante la página de contacto.' },
      ],
      terms: [
        { title: 'Uso aceptable', content: 'Los usuarios deben cumplir las leyes aplicables y los términos de la plataforma de origen.' },
        { title: 'Alcance del servicio', content: 'El servicio se proporciona tal cual y puede cambiar según el comportamiento de plataformas externas.' },
        { title: 'Responsabilidad del usuario', content: 'El usuario es responsable del manejo y la reutilización de los medios extraídos.' },
      ],
      cookies: [
        { title: 'Uso de cookies', content: 'Las cookies pueden usarse para continuidad de sesión, analítica y controles de fiabilidad.' },
        { title: 'Control', content: 'Puedes controlar las cookies desde la configuración de tu navegador.' },
      ],
      dmca: [
        { title: 'Aviso de copyright', content: 'Todos los derechos de los medios pertenecen a sus respectivos propietarios.' },
        { title: 'Proceso de reporte', content: 'Si crees que un contenido infringe derechos, contáctanos con detalles suficientes para revisarlo.' },
      ],
    },
  };

  const fallback = legalBaseEn;
  const current = localizedSections[locale];

  const lastUpdatedMap: Record<Locale, string> = {
    en: 'Last updated: 2026-03-19',
    ar: 'آخر تحديث: 2026-03-19',
    ja: '最終更新: 2026-03-19',
    es: 'Última actualización: 2026-03-19',
    pt: 'Última atualização: 2026-03-19',
    fr: 'Dernière mise à jour: 2026-03-19',
    id: 'Pembaruan terakhir: 2026-03-19',
    hi: 'अंतिम अपडेट: 2026-03-19',
    de: 'Zuletzt aktualisiert: 2026-03-19',
    tr: 'Son güncelleme: 2026-03-19',
  };

  return {
    privacy: {
      ...fallback.privacy,
      title: localizeLegalTitle(locale, 'privacy'),
      lastUpdated: lastUpdatedMap[locale],
      sections: current?.privacy ?? fallback.privacy.sections,
    },
    terms: {
      ...fallback.terms,
      title: localizeLegalTitle(locale, 'terms'),
      lastUpdated: lastUpdatedMap[locale],
      sections: current?.terms ?? fallback.terms.sections,
    },
    cookies: {
      ...fallback.cookies,
      title: localizeLegalTitle(locale, 'cookies'),
      lastUpdated: lastUpdatedMap[locale],
      sections: current?.cookies ?? fallback.cookies.sections,
    },
    dmca: {
      ...fallback.dmca,
      title: localizeLegalTitle(locale, 'dmca'),
      lastUpdated: lastUpdatedMap[locale],
      sections: current?.dmca ?? fallback.dmca.sections,
    },
  };
}
export const legalText: Record<Locale, { privacy: LegalPageDict; terms: LegalPageDict; cookies: LegalPageDict; dmca: LegalPageDict }> = {
  en: legalByLocale('en'),
  ar: legalByLocale('ar'),
  ja: legalByLocale('ja'),
  es: legalByLocale('es'),
  pt: legalByLocale('pt'),
  fr: legalByLocale('fr'),
  id: legalByLocale('id'),
  hi: legalByLocale('hi'),
  de: legalByLocale('de'),
  tr: legalByLocale('tr'),
};


type AboutDict = {
  title: string;
  body: string;
  visionTitle: string;
  visionBody: string;
  whyUsTitle: string;
  whyUsBody: string;
  projectNote: string;
};

type ContactDict = {
  title: string;
  subtitle: string;
  emailLabel: string;
  dmcaTitle: string;
  dmcaBody: string;
  socialTitle: string;
  socialBody: string;
  comingSoon: string;
};

const aboutBaseEn: AboutDict = {
  title: 'About ClipKeep',
  body: 'ClipKeep helps you organize and preserve publicly shared media from supported social platforms. We focus on practical workflows for personal archiving, research, and reference use.',
  visionTitle: 'What We Aim For',
  visionBody: 'We design ClipKeep so users can keep important online media accessible over time, even when platform interfaces or content availability change.',
  whyUsTitle: 'How ClipKeep Works',
  whyUsBody: 'ClipKeep processes public links and focuses on clear extraction flows. The service is built for reliability and consistent response performance.',
  projectNote: 'ClipKeep is built around utility, transparency, and stable SNS archiving workflows.',
};

export const aboutText: Record<Locale, AboutDict> = {
  en: aboutBaseEn,
  ja: {
    title: 'ClipKeep について',
    body: 'ClipKeep は、対応するSNS上で公開されているメディアを整理・保存するためのサービスです。個人アーカイブや調査用途で使いやすい、実務的な導線を重視しています。',
    visionTitle: '目指していること',
    visionBody: 'プラットフォームの仕様変更や公開状況の変化があっても、必要な記録に継続してアクセスできる状態を保つことを目標にしています。',
    whyUsTitle: 'ClipKeep の仕組み',
    whyUsBody: '公開リンクを起点に処理し、分かりやすい抽出フローを提供します。安定性と応答性を重視した構成で運用しています。',
    projectNote: 'ClipKeep は、実用性・透明性・安定したSNSアーカイブ運用を重視して開発しています。',
  },
  ar: {
    title: 'حول ClipKeep',
    body: 'يساعدك ClipKeep على تنظيم وحفظ الوسائط المنشورة علنًا من المنصات الاجتماعية المدعومة. نركز على سير عمل عملي يناسب الأرشفة الشخصية والبحث والاستخدام المرجعي.',
    visionTitle: 'ما الذي نسعى إليه',
    visionBody: 'نطوّر ClipKeep بحيث تظل الوسائط المهمة متاحة مع مرور الوقت، حتى عند تغيّر واجهات المنصات أو سياسات النشر.',
    whyUsTitle: 'كيف يعمل ClipKeep',
    whyUsBody: 'يعتمد ClipKeep على الروابط العامة ويوفر مسار استخراج واضحًا. تم بناء الخدمة لتحقيق الاستقرار وسرعة الاستجابة بشكل متسق.',
    projectNote: 'تم تطوير ClipKeep مع التركيز على الفائدة العملية والشفافية واستقرار تدفقات أرشفة محتوى SNS.',
  },
  es: {
    title: 'Acerca de ClipKeep',
    body: 'ClipKeep te ayuda a organizar y conservar medios publicados en plataformas sociales compatibles. Priorizamos flujos prácticos para archivo personal, investigación y consulta.',
    visionTitle: 'Nuestro enfoque',
    visionBody: 'Queremos que el acceso a medios importantes se mantenga estable, incluso cuando cambien las interfaces o las políticas de las plataformas.',
    whyUsTitle: 'Cómo funciona ClipKeep',
    whyUsBody: 'ClipKeep procesa enlaces públicos con un flujo de extracción claro. El servicio está orientado a la estabilidad y a una respuesta consistente.',
    projectNote: 'ClipKeep se construye con foco en utilidad, transparencia y un flujo de archivado SNS estable.',
  },
  pt: {
    title: 'Sobre o ClipKeep',
    body: 'O ClipKeep ajuda voce a organizar e preservar midias publicas de plataformas sociais compativeis. Priorizamos fluxos praticos para arquivo pessoal, pesquisa e referencia.',
    visionTitle: 'Nosso objetivo',
    visionBody: 'Queremos manter o acesso a midias importantes de forma continua, mesmo quando as plataformas mudam interfaces ou politicas.',
    whyUsTitle: 'Como o ClipKeep funciona',
    whyUsBody: 'O ClipKeep processa links publicos com um fluxo de extracao claro. O servico e focado em estabilidade e resposta consistente.',
    projectNote: 'O ClipKeep e desenvolvido com foco em utilidade, transparencia e arquivamento SNS estavel.',
  },
  fr: {
    title: 'A propos de ClipKeep',
    body: 'ClipKeep vous aide a organiser et conserver des medias publics issus de plateformes sociales compatibles. Nous privilegions des flux pratiques pour l archivage personnel, la recherche et la reference.',
    visionTitle: 'Notre objectif',
    visionBody: 'Nous visons un acces durable aux medias importants, meme lorsque les plateformes changent d interface ou de politique.',
    whyUsTitle: 'Comment fonctionne ClipKeep',
    whyUsBody: 'ClipKeep traite les liens publics avec un flux d extraction clair. Le service est concu pour la stabilite et une reponse coherente.',
    projectNote: 'ClipKeep est concu autour de l utilite, de la transparence et d un archivage SNS stable.',
  },
  id: {
    title: 'Tentang ClipKeep',
    body: 'ClipKeep membantu Anda mengatur dan menyimpan media publik dari platform sosial yang didukung. Kami memprioritaskan alur praktis untuk arsip pribadi, riset, dan referensi.',
    visionTitle: 'Tujuan kami',
    visionBody: 'Kami ingin akses ke media penting tetap terjaga dalam jangka panjang, meski antarmuka atau kebijakan platform berubah.',
    whyUsTitle: 'Cara kerja ClipKeep',
    whyUsBody: 'ClipKeep memproses tautan publik dengan alur ekstraksi yang jelas. Layanan ini dirancang untuk stabilitas dan respons yang konsisten.',
    projectNote: 'ClipKeep dibangun dengan fokus pada utilitas, transparansi, dan alur arsip SNS yang stabil.',
  },
  hi: {
    title: 'ClipKeep के बारे में',
    body: 'ClipKeep supported social platforms के public media ko organize aur preserve karne mein madad karta hai. Hum personal archive, research aur reference ke liye practical workflow par focus karte hain.',
    visionTitle: 'हमारा उद्देश्य',
    visionBody: 'Platform interface ya policy badalne par bhi important media tak long-term access bana rahe, isi par hamara focus hai.',
    whyUsTitle: 'ClipKeep कैसे काम करता है',
    whyUsBody: 'ClipKeep public links ko clear extraction flow ke saath process karta hai. Service stability aur consistent response ke liye design ki gayi hai.',
    projectNote: 'ClipKeep utility, transparency aur stable SNS archiving workflow par bana hai.',
  },
  de: {
    title: 'Uber ClipKeep',
    body: 'ClipKeep hilft Ihnen, offentlich verfugbare Medien aus unterstutzten sozialen Plattformen zu organisieren und zu archivieren. Wir setzen auf praxisnahe Ablaufe fur personliches Archiv, Recherche und Referenz.',
    visionTitle: 'Unser Ziel',
    visionBody: 'Wichtige Medien sollen langfristig erreichbar bleiben, auch wenn Plattformen ihre Oberflachen oder Richtlinien andern.',
    whyUsTitle: 'So arbeitet ClipKeep',
    whyUsBody: 'ClipKeep verarbeitet offentliche Links mit einem klaren Extraction-Flow. Der Dienst ist auf Stabilitat und konsistente Antwortzeiten ausgelegt.',
    projectNote: 'ClipKeep steht fur Nutzen, Transparenz und stabile SNS-Archivierungsablaufe.',
  },
  tr: {
    title: 'ClipKeep Hakkinda',
    body: 'ClipKeep, desteklenen sosyal platformlardaki herkese acik medyayi duzenlemenize ve arsivlemenize yardim eder. Kisisel arsiv, arastirma ve referans icin pratik akislar sunar.',
    visionTitle: 'Hedefimiz',
    visionBody: 'Platform arayuzu veya politikasi degisse bile onemli medyaya uzun vadeli erisim saglamak istiyoruz.',
    whyUsTitle: 'ClipKeep nasil calisir',
    whyUsBody: 'ClipKeep herkese acik baglantilari net bir extraction akisi ile isler. Hizmet stabilite ve tutarli yanit performansina odaklanir.',
    projectNote: 'ClipKeep, fayda, seffaflik ve stabil SNS arsivleme akislarina odaklanir.',
  },
};

const contactBaseEn: ContactDict = {
  title: 'Contact Us',
  subtitle: 'Questions, feedback, or operational inquiries are welcome.',
  emailLabel: 'Support Email',
  dmcaTitle: 'DMCA / Copyright',
  dmcaBody: 'For copyright claims or DMCA requests, send the target URL and supporting details by email.',
  socialTitle: 'Service Updates',
  socialBody: 'Operational updates and announcements will be published through official channels.',
  comingSoon: 'Channel links will be added soon.',
};

export const contactText: Record<Locale, ContactDict> = {
  en: contactBaseEn,
  ja: {
    title: 'お問い合わせ',
    subtitle: 'ご質問・ご意見・運用に関するご連絡はこちらから受け付けています。',
    emailLabel: 'サポートメール',
    dmcaTitle: 'DMCA / 著作権',
    dmcaBody: '著作権申立てやDMCA対応の依頼は、対象URLと根拠情報を添えてメールでご連絡ください。',
    socialTitle: '運用アップデート',
    socialBody: '障害情報や重要なお知らせは、公式チャネルで順次公開します。',
    comingSoon: 'チャネル情報は順次追加予定です。',
  },
  ar: {
    title: 'اتصل بنا',
    subtitle: 'نرحب بالاستفسارات والملاحظات وطلبات الدعم التشغيلي.',
    emailLabel: 'بريد الدعم',
    dmcaTitle: 'DMCA / حقوق النشر',
    dmcaBody: 'لطلبات DMCA أو بلاغات حقوق النشر، أرسل رابط المحتوى والمعلومات الداعمة عبر البريد الإلكتروني.',
    socialTitle: 'تحديثات الخدمة',
    socialBody: 'سيتم نشر تحديثات التشغيل والإعلانات الرسمية عبر القنوات المعتمدة.',
    comingSoon: 'سيتم إضافة روابط القنوات قريبًا.',
  },
  es: {
    title: 'Contacto',
    subtitle: 'Recibimos consultas, comentarios y solicitudes operativas.',
    emailLabel: 'Correo de soporte',
    dmcaTitle: 'DMCA / Copyright',
    dmcaBody: 'Para solicitudes de DMCA o reclamos de derechos de autor, envía por correo la URL objetivo y los detalles de respaldo.',
    socialTitle: 'Actualizaciones del servicio',
    socialBody: 'Publicaremos anuncios y el estado operativo a través de canales oficiales.',
    comingSoon: 'Los enlaces de canales se agregarán pronto.',
  },
  pt: {
    title: 'Contato',
    subtitle: 'Recebemos duvidas, feedback e solicitacoes operacionais.',
    emailLabel: 'Email de suporte',
    dmcaTitle: 'DMCA / Direitos autorais',
    dmcaBody: 'Para pedidos de DMCA ou reclamacoes de direitos autorais, envie por email a URL alvo e os detalhes de suporte.',
    socialTitle: 'Atualizacoes do servico',
    socialBody: 'Anuncios e status operacional serao publicados nos canais oficiais.',
    comingSoon: 'Os links dos canais serao adicionados em breve.',
  },
  fr: {
    title: 'Contact',
    subtitle: 'Nous recevons vos questions, retours et demandes operationnelles.',
    emailLabel: 'Email support',
    dmcaTitle: 'DMCA / Droit d auteur',
    dmcaBody: 'Pour une demande DMCA ou un signalement de droits d auteur, envoyez l URL concernee et les informations de support par email.',
    socialTitle: 'Mises a jour du service',
    socialBody: 'Les annonces et etats operationnels seront publies via les canaux officiels.',
    comingSoon: 'Les liens des canaux seront ajoutes prochainement.',
  },
  id: {
    title: 'Kontak',
    subtitle: 'Kami menerima pertanyaan, masukan, dan permintaan operasional.',
    emailLabel: 'Email dukungan',
    dmcaTitle: 'DMCA / Hak Cipta',
    dmcaBody: 'Untuk permintaan DMCA atau klaim hak cipta, kirim URL target dan detail pendukung melalui email.',
    socialTitle: 'Pembaruan layanan',
    socialBody: 'Pengumuman dan status operasional akan dipublikasikan melalui kanal resmi.',
    comingSoon: 'Tautan kanal akan ditambahkan segera.',
  },
  hi: {
    title: 'संपर्क',
    subtitle: 'Sawal, feedback aur operational requests ka swagat hai.',
    emailLabel: 'Support email',
    dmcaTitle: 'DMCA / कॉपीराइट',
    dmcaBody: 'DMCA request ya copyright claim ke liye target URL aur supporting details email se bhejen.',
    socialTitle: 'Service updates',
    socialBody: 'Operational updates aur announcements official channels par publish honge.',
    comingSoon: 'Channel links jaldi add kiye jayenge.',
  },
  de: {
    title: 'Kontakt',
    subtitle: 'Fragen, Feedback und operative Anfragen sind willkommen.',
    emailLabel: 'Support-E-Mail',
    dmcaTitle: 'DMCA / Urheberrecht',
    dmcaBody: 'Fur DMCA-Anfragen oder Urheberrechtsmeldungen senden Sie die betroffene URL und begleitende Informationen per E-Mail.',
    socialTitle: 'Service-Updates',
    socialBody: 'Betriebsstatus und Ankundigungen werden uber offizielle Kanale veroffentlicht.',
    comingSoon: 'Kanal-Links werden in Kurze hinzugefugt.',
  },
  tr: {
    title: 'Iletisim',
    subtitle: 'Sorular, geri bildirimler ve operasyonel taleplerinizi bekliyoruz.',
    emailLabel: 'Destek e-postasi',
    dmcaTitle: 'DMCA / Telif hakki',
    dmcaBody: 'DMCA talepleri veya telif hakki bildirimleri icin hedef URL ve destekleyici bilgileri e-posta ile gonderin.',
    socialTitle: 'Servis guncellemeleri',
    socialBody: 'Operasyonel durum ve duyurular resmi kanallar uzerinden yayinlanacaktir.',
    comingSoon: 'Kanal baglantilari yakinda eklenecek.',
  },
};




export const facebookText: Record<Locale, PlatformPageDict> = {
  en: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Status",
    helpPage: "Help Page",
    howToTitle: "How to Save Facebook Media",
    howToSteps: ["Open Facebook: Find the post or media you want to save.", "Copy Link: Use the share button to copy the URL.", "Paste in ClipKeep: Insert the link into the form above.", "Download: Save the file once processing is complete."],
    whyTitle: "Why ClipKeep for Facebook?",
    whyBody: "ClipKeep provides a fast and reliable way to archive your favorite Facebook content for offline viewing.",
    whyPoints: ["High Quality", "Fast Extraction", "No Account Needed"],
    faqTitle: "Facebook FAQ",
    faqItems: [{"q": "Is it free?", "a": "Yes, our Facebook downloader is free to use."}, {"q": "Is it anonymous?", "a": "Yes, we don't track your downloads."}],
    galleryTitle: "Recent Facebook Saves",
    trendingTitle: "Trending on Facebook"
  },
  ar: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "الحالة",
    helpPage: "صفحة المساعدة",
    howToTitle: "كيفية حفظ ميديا Facebook",
    howToSteps: ["افتح Facebook: ابحث عن المنشور الذي تريد حفظه.", "نسخ الرابط: استخدم زر المشاركة لنسخ الرابط.", "لصق في ClipKeep: ضع الرابط في الحقل أعلاه.", "تنزيل: احفظ الملف بعد اكتمال المعالجة."],
    whyTitle: "لماذا ClipKeep لـ Facebook؟",
    whyBody: "يوفر ClipKeep طريقة سريعة وموثوقة لأرشفة محتواك المفضل من Facebook.",
    whyPoints: ["جودة عالية", "استخراج سريع", "لا يلزم حساب"],
    faqTitle: "الأسئلة الشائعة حول Facebook",
    faqItems: [{"q": "هل هو مجاني؟", "a": "نعم، خدمتنا مجانية بالكامل."}, {"q": "هل هو مجهول؟", "a": "نعم، نحن لا نتتبع تنزيلاتك."}],
    galleryTitle: "المحفوظات الأخيرة من Facebook",
    trendingTitle: "رائج على Facebook"
  },
  ja: {
    title: "Facebook ダウンローダー",
    subtitle: "Facebookのコミュニティから動画やメディアを保存します。",
    statusLabel: "ステータス",
    helpPage: "ヘルプページ",
    howToTitle: "Facebook動画の保存方法",
    howToSteps: ["Facebookを開く: 保存したい投稿やメディアを表示します。", "URLをコピー: シェアボタンからリンクをコピーします。", "ClipKeepに貼り付け: 上記の入力欄にURLを貼り付けます。", "保存: 抽出完了後、端末に保存します。"],
    whyTitle: "ClipKeepが選ばれる理由",
    whyBody: "Facebookのコンテンツを簡単かつ安全にアーカイブ。高品質な状態での保存に対応しています。",
    whyPoints: ["最高画質", "高速抽出", "ログイン不要"],
    faqTitle: "よくある質問",
    faqItems: [{"q": "無料ですか？", "a": "はい、すべての機能が無料で利用可能です。"}, {"q": "相手に通知されますか？", "a": "いいえ、ダウンロードが相手に通知されることはありません。"}],
    galleryTitle: "最近のFacebook保存",
    trendingTitle: "Facebookトレンド"
  },
  es: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Estado",
    helpPage: "Ayuda",
    howToTitle: "Cómo guardar de Facebook",
    howToSteps: ["Abre Facebook: Busca el post que quieras guardar.", "Copia el enlace: Usa el botón compartir.", "Pega en ClipKeep: Inserta la URL arriba.", "Descarga: Guarda el archivo al finalizar."],
    whyTitle: "¿Por qué usar ClipKeep?",
    whyBody: "ClipKeep ofrece una forma rápida de archivar contenido de Facebook.",
    whyPoints: ["Alta calidad", "Extracción rápida", "Sin cuenta"],
    faqTitle: "FAQ de Facebook",
    faqItems: [{"q": "¿Es gratis?", "a": "Sí, el descargador es gratuito."}, {"q": "¿Es anónimo?", "a": "Sí, no notificamos a nadie."}],
    galleryTitle: "Recientes de Facebook",
    trendingTitle: "Tendencias en Facebook"
  },
  pt: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Status",
    helpPage: "Ajuda",
    howToTitle: "Como salvar do Facebook",
    howToSteps: ["Abra o Facebook: Encontre o post desejado.", "Copie o link: Use o botão compartilhar.", "Cole no ClipKeep: Insira a URL acima.", "Download: Salve o arquivo após o processamento."],
    whyTitle: "Por que o ClipKeep?",
    whyBody: "ClipKeep é a forma mais rápida de baixar mídia do Facebook.",
    whyPoints: ["Alta Qualidade", "Extração Veloz", "Sem Cadastro"],
    faqTitle: "FAQ do Facebook",
    faqItems: [{"q": "É gratuito?", "a": "Sim, o serviço é gratuito."}, {"q": "É anônimo?", "a": "Sim, garantimos sua privacidade."}],
    galleryTitle: "Recentes do Facebook",
    trendingTitle: "Tendências no Facebook"
  },
  fr: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "État",
    helpPage: "Aide",
    howToTitle: "Comment sauver de Facebook",
    howToSteps: ["Ouvrez Facebook : Trouvez le post à sauver.", "Copiez le lien : Utilisez le bouton partager.", "Collez dans ClipKeep : Insérez l'URL ci-dessus.", "Télécharger : Enregistrez le fichier."],
    whyTitle: "Pourquoi ClipKeep ?",
    whyBody: "ClipKeep permet d'archiver facilement le contenu Facebook.",
    whyPoints: ["Haute Qualité", "Extraction Rapide", "Sans Compte"],
    faqTitle: "FAQ Facebook",
    faqItems: [{"q": "Est-ce gratuit ?", "a": "Oui, le service est gratuit."}, {"q": "Est-ce anonyme ?", "a": "Oui, aucune notification n'est envoyée."}],
    galleryTitle: "Récents sur Facebook",
    trendingTitle: "Tendances Facebook"
  },
  id: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Status",
    helpPage: "Bantuan",
    howToTitle: "Cara simpan dari Facebook",
    howToSteps: ["Buka Facebook: Cari postingan yang ingin disimpan.", "Salin Tautan: Gunakan tombol bagikan.", "Tempel di ClipKeep: Masukkan URL di atas.", "Unduh: Simpan file setelah selesai."],
    whyTitle: "Mengapa ClipKeep?",
    whyBody: "ClipKeep adalah cara tercepat untuk mengunduh media Facebook.",
    whyPoints: ["Kualitas Tinggi", "Ekstraksi Cepat", "Tanpa Login"],
    faqTitle: "FAQ Facebook",
    faqItems: [{"q": "Apakah gratis?", "a": "Ya, pengunduh ini gratis."}, {"q": "Apakah anonim?", "a": "Ya, kami tidak melacak aktivitas Anda."}],
    galleryTitle: "Simpanan Facebook Terkini",
    trendingTitle: "Tren di Facebook"
  },
  hi: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "स्थिति",
    helpPage: "सहायता",
    howToTitle: "Facebook मीडिया कैसे सहेजें",
    howToSteps: ["Facebook खोलें: वह पोस्ट ढूंढें जिसे आप सहेजना चाहते हैं।", "लिंक कॉपी करें: शेयर बटन का उपयोग करें।", "ClipKeep में पेस्ट करें: ऊपर लिंक डालें।", "डाउनलोड करें: फाइल को अपने डिवाइस पर सेव करें।"],
    whyTitle: "ClipKeep क्यों चुनें?",
    whyBody: "ClipKeep Facebook सामग्री को आर्काइव करने का सबसे तेज़ तरीका है।",
    whyPoints: ["हाई क्वालिटी", "तेज़ एक्सट्रैक्शन", "बिना अकाउंट"],
    faqTitle: "Facebook FAQ",
    faqItems: [{"q": "क्या यह मुफ़्त है?", "a": "हाँ, यह सेवा पूरी तरह मुफ़्त है।"}, {"q": "क्या यह गुमनाम है?", "a": "हाँ, हम आपकी जानकारी ट्रैक नहीं करते।"}],
    galleryTitle: "हालिया Facebook सेव",
    trendingTitle: "Facebook पर ट्रेंडिंग"
  },
  de: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Status",
    helpPage: "Hilfe",
    howToTitle: "Facebook Medien speichern",
    howToSteps: ["Facebook öffnen: Suche den gewünschten Post.", "Link kopieren: Nutze den Share-Button.", "In ClipKeep einfügen: URL oben eingeben.", "Download: Datei nach Bearbeitung speichern."],
    whyTitle: "Warum ClipKeep?",
    whyBody: "ClipKeep bietet eine schnelle Archivierung von Facebook-Inhalten.",
    whyPoints: ["Hohe Qualität", "Schnelle Extraktion", "Kein Account"],
    faqTitle: "Facebook FAQ",
    faqItems: [{"q": "Ist es kostenlos?", "a": "Ja, der Downloader ist gratis."}, {"q": "Ist es anonym?", "a": "Ja, es erfolgt keine Rückverfolgung."}],
    galleryTitle: "Zuletzt auf Facebook gespeichert",
    trendingTitle: "Trends auf Facebook"
  },
  tr: {
    title: "Facebook Downloader",
    subtitle: "Download videos and media from Facebook communities.",
    statusLabel: "Durum",
    helpPage: "Yardım",
    howToTitle: "Facebook Medyası Nasıl Kaydedilir",
    howToSteps: ["Facebook'ı Açın: Kaydetmek istediğiniz gönderiyi bulun.", "Bağlantıyı Kopyalayın: Paylaş butonunu kullanın.", "ClipKeep'e Yapıştırın: URL'yi yukarıya ekleyin.", "İndir: İşlem bittiğinde dosyayı kaydedin."],
    whyTitle: "Neden ClipKeep?",
    whyBody: "ClipKeep, Facebook içeriğini arşivlemenin en hızlı yoludur.",
    whyPoints: ["Yüksek Kalite", "Hızlı Ayıklama", "Hesap Gerekmez"],
    faqTitle: "Facebook SSS",
    faqItems: [{"q": "Ücretsiz mi?", "a": "Evet, hizmetimiz tamamen ücretsizdir."}, {"q": "Anonim mi?", "a": "Evet, indirmelerinizi takip etmiyoruz."}],
    galleryTitle: "Son Facebook Kayıtları",
    trendingTitle: "Facebook Trendleri"
  },
};


