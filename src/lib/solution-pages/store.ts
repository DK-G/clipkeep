import type { Locale } from "@/lib/i18n/ui";

export type SolutionSection = {
  id: string;
  heading: string;
  body: string;
};

export type SolutionPage = {
  slug: string;
  locale: Locale;
  title: string;
  sections: SolutionSection[];
  cta: {
    label: string;
    href: string;
  };
};

const locales: Locale[] = ["en", "ja", "ar", "es", "pt", "fr", "id", "hi", "de", "tr"];

const telegramGuide: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "Telegram Video Downloader Not Working", s1: "Use a valid public Telegram post or channel link.", s2: "Temporary upstream limits may resolve within a few minutes.", cta: "Try Telegram Downloader" },
  ja: { title: "Telegram動画が保存できない場合", s1: "公開されているTelegram投稿またはチャンネルURLを使用してください。", s2: "一時的な制限は数分で解消する場合があります。", cta: "Telegramダウンローダーを試す" },
  ar: { title: "مشكلة في تنزيل فيديو تيليجرام", s1: "استخدم رابط منشور أو قناة Telegram عامة وصالحة.", s2: "قد تختفي القيود المؤقتة خلال بضع دقائق.", cta: "جرّب تنزيل تيليجرام" },
  es: { title: "El descargador de Telegram no funciona", s1: "Usa un enlace publico valido de Telegram.", s2: "Las limitaciones temporales pueden resolverse en pocos minutos.", cta: "Probar descargador de Telegram" },
  pt: { title: "Downloader do Telegram nao funciona", s1: "Use um link publico valido do Telegram.", s2: "Limitacoes temporarias podem normalizar em alguns minutos.", cta: "Testar downloader do Telegram" },
  fr: { title: "Le telechargeur Telegram ne fonctionne pas", s1: "Utilisez un lien Telegram public et valide.", s2: "Les limitations temporaires peuvent disparaitre en quelques minutes.", cta: "Essayer le telechargeur Telegram" },
  id: { title: "Pengunduh Telegram tidak berfungsi", s1: "Gunakan tautan Telegram publik yang valid.", s2: "Pembatasan sementara biasanya pulih dalam beberapa menit.", cta: "Coba pengunduh Telegram" },
  hi: { title: "Telegram downloader kaam nahi kar raha", s1: "Valid public Telegram post ya channel link ka upyog karein.", s2: "Temporary limits kuch minute me normal ho sakte hain.", cta: "Telegram downloader azmayein" },
  de: { title: "Telegram-Downloader funktioniert nicht", s1: "Verwenden Sie einen gultigen offentlichen Telegram-Link.", s2: "Temporare Limits konnen sich in wenigen Minuten auflosen.", cta: "Telegram-Downloader testen" },
  tr: { title: "Telegram indirici calismiyor", s1: "Gecerli ve herkese acik bir Telegram baglantisi kullanin.", s2: "Gecici kisitlar birkac dakika icinde duzelebilir.", cta: "Telegram indiriciyi dene" },
};

const twitterGuide: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "Twitter Video Downloader Not Working", s1: "Private or restricted posts cannot be processed.", s2: "Use a direct tweet URL without tracking parameters.", cta: "Try Twitter Downloader" },
  ja: { title: "Twitter動画が保存できない場合", s1: "非公開または制限付き投稿は処理できません。", s2: "追跡パラメータなしの直接URLを使用してください。", cta: "Twitterダウンローダーを試す" },
  ar: { title: "مشكلة في تنزيل فيديو تويتر", s1: "لا يمكن معالجة المنشورات الخاصة أو المقيّدة.", s2: "استخدم رابط التغريدة المباشر بدون معاملات تتبع.", cta: "جرّب تنزيل تويتر" },
  es: { title: "El descargador de Twitter no funciona", s1: "Las publicaciones privadas o restringidas no se pueden procesar.", s2: "Usa la URL directa del tweet sin parametros de seguimiento.", cta: "Probar descargador de Twitter" },
  pt: { title: "Downloader do Twitter nao funciona", s1: "Posts privados ou restritos nao podem ser processados.", s2: "Use a URL direta do tweet sem parametros de rastreamento.", cta: "Testar downloader do Twitter" },
  fr: { title: "Le telechargeur Twitter ne fonctionne pas", s1: "Les publications privees ou restreintes ne peuvent pas etre traitees.", s2: "Utilisez l URL directe du tweet sans parametres de suivi.", cta: "Essayer le telechargeur Twitter" },
  id: { title: "Pengunduh Twitter tidak berfungsi", s1: "Posting privat atau terbatas tidak dapat diproses.", s2: "Gunakan URL tweet langsung tanpa parameter pelacakan.", cta: "Coba pengunduh Twitter" },
  hi: { title: "Twitter downloader kaam nahi kar raha", s1: "Private ya restricted posts process nahi ho sakte.", s2: "Tracking parameter ke bina direct tweet URL ka upyog karein.", cta: "Twitter downloader azmayein" },
  de: { title: "Twitter-Downloader funktioniert nicht", s1: "Private oder eingeschrankte Beitrage konnen nicht verarbeitet werden.", s2: "Verwenden Sie die direkte Tweet-URL ohne Tracking-Parameter.", cta: "Twitter-Downloader testen" },
  tr: { title: "Twitter indirici calismiyor", s1: "Ozel veya kisitli gonderiler islenemez.", s2: "Takip parametresi olmadan dogrudan tweet URLsi kullanin.", cta: "Twitter indiriciyi dene" },
};

const degradedGuide: Record<Locale, { title: string; s1: string; cta: string }> = {
  en: { title: "Extractor Temporarily Limited", s1: "Service is in degraded mode. Retry after the suggested wait time.", cta: "Check Service Status" },
  ja: { title: "抽出機能は一時的に制限中", s1: "現在は負荷軽減モードです。案内された待機時間後に再試行してください。", cta: "サービス状況を確認" },
  ar: { title: "الخدمة محدودة مؤقتًا", s1: "الخدمة تعمل في وضع التخفيف. أعد المحاولة بعد المهلة المقترحة.", cta: "تحقق من حالة الخدمة" },
  es: { title: "Extractor temporalmente limitado", s1: "El servicio esta en modo degradado. Reintenta tras el tiempo sugerido.", cta: "Ver estado del servicio" },
  pt: { title: "Extractor temporariamente limitado", s1: "O servico esta em modo degradado. Tente novamente apos o tempo sugerido.", cta: "Ver status do servico" },
  fr: { title: "Extracteur temporairement limite", s1: "Le service est en mode degrade. Reessayez apres le delai suggere.", cta: "Voir l etat du service" },
  id: { title: "Extractor dibatasi sementara", s1: "Layanan sedang dalam mode degradadasi. Coba lagi setelah waktu yang disarankan.", cta: "Lihat status layanan" },
  hi: { title: "Extractor temporary limited", s1: "Service degraded mode me hai. Suggested wait ke baad dobara try karein.", cta: "Service status dekhen" },
  de: { title: "Extractor vorubergehend eingeschrankt", s1: "Der Dienst lauft im Degraded-Mode. Bitte nach der vorgeschlagenen Wartezeit erneut versuchen.", cta: "Service-Status prufen" },
  tr: { title: "Extractor gecici olarak sinirli", s1: "Hizmet degrade modunda calisiyor. Onerilen bekleme suresinden sonra tekrar deneyin.", cta: "Servis durumunu kontrol et" },
};

// English-only helper pages (other locales fall back to en via findSolutionPage)
const enPages: SolutionPage[] = [
  {
    slug: "tiktok-video-downloader-not-working",
    locale: "en",
    title: "TikTok Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Check the URL format", body: "Make sure the link is in the format tiktok.com/@username/video/ID or a short vt.tiktok.com link. Copy it using the Share button inside the TikTok app." },
      { id: "s2", heading: "Clear cache and retry", body: "Clear your browser cache and reload ClipKeep. TikTok CDN changes occasionally cause temporary errors that resolve within a few minutes." },
      { id: "s3", heading: "Public videos only", body: "TikTok private account videos and friend-only posts cannot be accessed by any external tool — this is a platform restriction." },
    ],
    cta: { label: "Try TikTok Downloader", href: "/download-tiktok-video" },
  },
  {
    slug: "reddit-video-downloader-not-working",
    locale: "en",
    title: "Reddit Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Use a direct post URL", body: "Use the direct post URL in the format reddit.com/r/subreddit/comments/ID or a redd.it short link. Avoid sharing URLs with extra query parameters." },
      { id: "s2", heading: "Audio and video are separate on Reddit", body: "Reddit hosts video and audio as separate streams. ClipKeep merges them automatically, but some older posts may have video only." },
      { id: "s3", heading: "NSFW and private subreddits", body: "Posts from private subreddits or NSFW communities that require login cannot be downloaded by ClipKeep." },
    ],
    cta: { label: "Try Reddit Downloader", href: "/download-reddit-video" },
  },
  {
    slug: "facebook-video-downloader-not-working",
    locale: "en",
    title: "Facebook Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Public videos only", body: "Only publicly shared Facebook videos can be downloaded. Videos set to Friends Only, Private, or Groups are not accessible externally." },
      { id: "s2", heading: "Use the full video URL", body: "Navigate to the video post directly and copy the URL from your browser address bar. Avoid using URLs from the Facebook app share sheet as they may resolve incorrectly." },
      { id: "s3", heading: "Facebook Reels and Stories", body: "Facebook Reels may work if they are public. Stories expire after 24 hours and may not be available." },
    ],
    cta: { label: "Try Facebook Downloader", href: "/download-facebook-video" },
  },
  {
    slug: "bilibili-video-downloader-not-working",
    locale: "en",
    title: "Bilibili Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Use the BV or AV link", body: "Copy the Bilibili video URL directly from your browser. The URL should contain the BV ID (e.g., bilibili.com/video/BVxxxxxxxx) or an AV number." },
      { id: "s2", heading: "Region restrictions", body: "Some Bilibili videos are restricted to viewers in mainland China. If a video plays for you but fails to download, try a different quality option." },
      { id: "s3", heading: "Login-required content", body: "Videos that require a Bilibili account or are behind a paywall cannot be accessed by ClipKeep." },
    ],
    cta: { label: "Try Bilibili Downloader", href: "/download-bilibili-video" },
  },
  {
    slug: "discord-video-downloader-not-working",
    locale: "en",
    title: "Discord Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Use a public CDN link", body: "Discord attachment URLs (cdn.discordapp.com/attachments/...) must be publicly accessible. Links from private servers or DMs require authentication and cannot be downloaded." },
      { id: "s2", heading: "Link expiry", body: "Discord CDN links expire. If the link was copied a long time ago, go back to the Discord message and copy a fresh link." },
      { id: "s3", heading: "Supported format", body: "ClipKeep works with direct Discord video attachment links. Post URLs from discord.com/channels/... are not currently supported — use the direct CDN attachment URL." },
    ],
    cta: { label: "Try Discord Downloader", href: "/download-discord-video" },
  },
  {
    slug: "instagram-downloader-not-working",
    locale: "en",
    title: "Instagram Downloader — Currently Unavailable",
    sections: [
      { id: "s1", heading: "Instagram support is paused", body: "Instagram has significantly restricted third-party access to its content. ClipKeep's Instagram downloader is temporarily unavailable while we work on a compliant solution." },
      { id: "s2", heading: "What you can do now", body: "You can save Instagram posts directly from the app using the Bookmark feature. For Reels, some devices allow you to use the native screen recorder." },
      { id: "s3", heading: "Other platforms", body: "ClipKeep fully supports TikTok, Twitter/X, Telegram, Reddit, Pinterest, Threads, and more. Check back later for Instagram updates." },
    ],
    cta: { label: "See Supported Platforms", href: "/" },
  },
  {
    slug: "video-download-not-working-on-iphone",
    locale: "en",
    title: "Video Download Not Working on iPhone",
    sections: [
      { id: "s1", heading: "Use Safari, not Chrome", body: "On iPhone, Safari provides the best download experience. Chrome on iOS may not trigger the native download dialog. Open ClipKeep in Safari and tap the download button." },
      { id: "s2", heading: "Save to Files app", body: "When Safari presents a download prompt, choose Save to Files. The video will appear in the Files app under Downloads and can then be imported into Photos." },
      { id: "s3", heading: "Storage space", body: "Ensure your iPhone has enough free storage before downloading. A typical HD video can be 50–200 MB. Check Settings > General > iPhone Storage." },
    ],
    cta: { label: "Open ClipKeep", href: "/" },
  },
  {
    slug: "video-download-not-working-on-android",
    locale: "en",
    title: "Video Download Not Working on Android",
    sections: [
      { id: "s1", heading: "Use Chrome on Android", body: "Open ClipKeep in Chrome on Android and tap the Download button. Chrome will save the file to your Downloads folder automatically." },
      { id: "s2", heading: "Check download notifications", body: "Android download progress appears in the notification bar. If it disappears quickly, check the Downloads folder in your Files app — the download may have completed silently." },
      { id: "s3", heading: "Allow storage permission", body: "If prompted, allow Chrome to access device storage. Without this permission, downloads will fail silently. Go to Settings > Apps > Chrome > Permissions to enable it." },
    ],
    cta: { label: "Open ClipKeep", href: "/" },
  },
  {
    slug: "download-not-working-on-chrome",
    locale: "en",
    title: "Download Not Working on Chrome",
    sections: [
      { id: "s1", heading: "Check Chrome download settings", body: "Go to Chrome Settings > Downloads and make sure Ask where to save each file is turned on, or that your default download folder is accessible." },
      { id: "s2", heading: "Disable download-blocking extensions", body: "Some browser extensions (ad blockers, privacy tools) can block download requests. Try disabling extensions temporarily or use Chrome's Incognito mode." },
      { id: "s3", heading: "Allow pop-ups from ClipKeep", body: "In Chrome's address bar, click the lock icon > Site Settings, and allow pop-ups and redirects for ClipKeep. Some downloads open in a new tab before saving." },
    ],
    cta: { label: "Open ClipKeep", href: "/" },
  },
  {
    slug: "download-not-working-private-account",
    locale: "en",
    title: "Cannot Download from Private Account",
    sections: [
      { id: "s1", heading: "Private accounts are not accessible", body: "Content from private Twitter, TikTok, Instagram, or Telegram accounts cannot be accessed by ClipKeep or any external tool. This is enforced at the platform level." },
      { id: "s2", heading: "What you can do", body: "Ask the account owner to share the video directly, or request that they make the specific post public. Some platforms allow sharing a public link to a single post even from a private account." },
      { id: "s3", heading: "Public posts work normally", body: "ClipKeep works with all publicly accessible posts. If an account is public, its videos can be downloaded without any restrictions." },
    ],
    cta: { label: "Try with a Public URL", href: "/" },
  },
  {
    slug: "how-to-download-without-watermark",
    locale: "en",
    title: "How to Download Videos Without Watermark",
    sections: [
      { id: "s1", heading: "TikTok — automatic watermark removal", body: "ClipKeep fetches the original pre-watermark video file from TikTok's servers via the API. The downloaded MP4 has no TikTok logo overlay." },
      { id: "s2", heading: "Twitter/X — no watermark by default", body: "Twitter videos do not have watermarks. ClipKeep downloads the original MP4 directly from Twitter's CDN without any modification." },
      { id: "s3", heading: "Other platforms", body: "For Telegram, Reddit, Pinterest, and others, ClipKeep also downloads the original source files. Watermarks embedded into the video by the creator are part of the file and cannot be removed." },
    ],
    cta: { label: "Start Downloading", href: "/" },
  },
  {
    slug: "video-download-slow",
    locale: "en",
    title: "Video Download Is Slow",
    sections: [
      { id: "s1", heading: "Processing time is normal", body: "ClipKeep fetches video metadata and the direct download URL from external servers. This process usually takes 3–15 seconds depending on the platform and video size." },
      { id: "s2", heading: "Download speed depends on your connection", body: "The actual file download speed is determined by your internet connection and the source CDN, not ClipKeep. HD videos (100–500 MB) will take longer on slower connections." },
      { id: "s3", heading: "If it seems stuck", body: "If the progress bar has not moved for over 60 seconds, try refreshing and re-submitting the URL. Occasional upstream CDN timeouts can cause stalls that resolve on retry." },
    ],
    cta: { label: "Check Service Status", href: "/status" },
  },
  {
    slug: "video-downloader-safe-guide",
    locale: "en",
    title: "Is ClipKeep Safe to Use?",
    sections: [
      { id: "s1", heading: "No login or account required", body: "ClipKeep never asks for your social media credentials. You only paste a public URL — no passwords, no OAuth, no account access." },
      { id: "s2", heading: "HTTPS and privacy", body: "All communication with ClipKeep uses HTTPS. We do not log personal information, sell data, or track individual users. See our Privacy Policy for full details." },
      { id: "s3", heading: "No malware or extensions", body: "ClipKeep is a web tool — it requires no browser extension, no desktop app, and no downloads to your device beyond the video file you requested." },
    ],
    cta: { label: "Read Privacy Policy", href: "/legal/privacy" },
  },
  {
    slug: "is-video-downloader-legal",
    locale: "en",
    title: "Is Using a Video Downloader Legal?",
    sections: [
      { id: "s1", heading: "Personal use is generally tolerated", body: "Downloading videos for personal offline viewing is widely tolerated in many jurisdictions. However, laws vary by country, and platform Terms of Service may prohibit downloading." },
      { id: "s2", heading: "Do not redistribute", body: "Downloading for personal archival differs from republishing or monetizing someone else's content. Always respect copyright and the creator's rights." },
      { id: "s3", heading: "ClipKeep's position", body: "ClipKeep is a neutral tool. Users are responsible for how they use downloaded content. We comply with DMCA takedown requests and do not host content ourselves." },
    ],
    cta: { label: "Read Terms of Service", href: "/legal/terms" },
  },
  {
    slug: "video-format-mp4-vs-webm",
    locale: "en",
    title: "MP4 vs WebM — Which Format Should I Download?",
    sections: [
      { id: "s1", heading: "MP4 is the safest choice", body: "MP4 (H.264) is supported on every device and platform — iOS, Android, Windows, Mac, and all major video editors. Choose MP4 when compatibility matters most." },
      { id: "s2", heading: "WebM offers better compression", body: "WebM (VP9/AV1) files are often smaller with the same visual quality. They work well on Chrome and Firefox but may not play natively on older iOS or Windows devices." },
      { id: "s3", heading: "What ClipKeep provides", body: "ClipKeep downloads the original format provided by the platform. For most platforms this is MP4. When multiple formats are available, the higher-quality MP4 option is shown first." },
    ],
    cta: { label: "Start Downloading", href: "/" },
  },
  {
    slug: "best-quality-download-settings",
    locale: "en",
    title: "How to Get the Best Quality Download",
    sections: [
      { id: "s1", heading: "Choose the highest resolution option", body: "When ClipKeep shows multiple quality options (e.g., 1080p, 720p, 480p), always select the highest available for the best result. The original upload quality is the ceiling." },
      { id: "s2", heading: "HD is not always available", body: "If the creator uploaded a low-resolution video, no tool can enhance it beyond the source quality. The original upload resolution is the maximum possible." },
      { id: "s3", heading: "Avoid re-encoding after download", body: "Avoid converting the downloaded file unless necessary — each conversion cycle reduces quality. The file ClipKeep provides is already the best available version." },
    ],
    cta: { label: "Start Downloading", href: "/" },
  },
  {
    slug: "twitter-video-download-2026",
    locale: "en",
    title: "Twitter / X Video Downloader — 2026 Guide",
    sections: [
      { id: "s1", heading: "Updated for X's 2026 platform changes", body: "ClipKeep is regularly updated to stay compatible with X's evolving API. As of 2026, paste any public tweet URL containing a video or GIF and ClipKeep will extract it." },
      { id: "s2", heading: "How to use", body: "Open the tweet on X, tap Share > Copy Link, then paste it into ClipKeep. Select your preferred quality (HD recommended) and download the MP4." },
      { id: "s3", heading: "What works and what does not", body: "Public tweets with native video or GIF work. Linked YouTube embeds, Spaces recordings, and private account posts are not supported." },
    ],
    cta: { label: "Try Twitter Downloader", href: "/download-twitter-video" },
  },
  {
    slug: "tiktok-download-2026",
    locale: "en",
    title: "TikTok Video Downloader — 2026 Guide",
    sections: [
      { id: "s1", heading: "Updated for TikTok's 2026 changes", body: "ClipKeep adapts continuously as TikTok updates its CDN and API. Paste any public TikTok video URL and ClipKeep will extract the watermark-free HD MP4." },
      { id: "s2", heading: "How to use", body: "In the TikTok app tap Share > Copy Link, then paste it into ClipKeep. Both full tiktok.com URLs and short vt.tiktok.com links are accepted." },
      { id: "s3", heading: "Limitations in 2026", body: "Private accounts, videos removed by TikTok, and videos restricted to certain regions cannot be downloaded. Duets and Stitch videos download the combined final version." },
    ],
    cta: { label: "Try TikTok Downloader", href: "/download-tiktok-video" },
  },
];

const pages: SolutionPage[] = [
  ...enPages,
  ...locales.map((locale) => ({
    slug: "telegram-video-downloader-not-working",
    locale,
    title: telegramGuide[locale].title,
    sections: [
      { id: "s1", heading: "Step 1", body: telegramGuide[locale].s1 },
      { id: "s2", heading: "Step 2", body: telegramGuide[locale].s2 },
    ],
    cta: { label: telegramGuide[locale].cta, href: "/download-telegram-video" },
  })),
  ...locales.map((locale) => ({
    slug: "twitter-video-downloader-not-working",
    locale,
    title: twitterGuide[locale].title,
    sections: [
      { id: "s1", heading: "Step 1", body: twitterGuide[locale].s1 },
      { id: "s2", heading: "Step 2", body: twitterGuide[locale].s2 },
    ],
    cta: { label: twitterGuide[locale].cta, href: "/download-twitter-video" },
  })),
  ...locales.map((locale) => ({
    slug: "extractor-temporary-limited",
    locale,
    title: degradedGuide[locale].title,
    sections: [{ id: "s1", heading: "Status", body: degradedGuide[locale].s1 }],
    cta: { label: degradedGuide[locale].cta, href: "/status" },
  })),
];

export function findSolutionPage(slug: string, locale: Locale): SolutionPage | undefined {
  return pages.find((p) => p.slug === slug && p.locale === locale)
    ?? pages.find((p) => p.slug === slug && p.locale === "en");
}
