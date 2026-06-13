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

const telegramGuide: Record<Locale, { title: string; s1: string; s2: string; s3?: string; cta: string }> = {
  en: { title: "Telegram Video Downloader Not Working", s1: "Use a valid public Telegram post or channel link.", s2: "Temporary upstream limits may resolve within a few minutes.", cta: "Try Telegram Downloader" },
  ja: { title: "Telegram動画が保存できない場合", s1: "Telegram動画が保存できない・ダウンロードできない場合は、まずURLが公開チャンネルまたは公開投稿のものか確認してください。`t.me/チャンネル名/投稿番号` の形式の公開リンクが必要です。非公開グループやシークレットチャット内の動画は、Telegramの仕様上どの外部ツールでも取得できません。", s2: "「読み込めない」「処理が進まない」場合は、Telegram側のレート制限や一時的なサーバー負荷が原因のことがあります。数分待ってからURLを貼り付け直してください。それでも保存できないときは、ブラウザのキャッシュを削除し、URL末尾の余分なパラメータ（`?...`）を取り除いた状態で再試行すると成功率が上がります。", s3: "Telegramの動画は元の投稿画質のまま保存されます。元ファイルが低画質の場合、ツール側で高画質化することはできません。保存後の動画は標準的なMP4形式のため、iPhone・Android・PCのいずれでも再生・編集できます。", cta: "Telegramダウンローダーを試す" },
  ar: { title: "مشكلة في تنزيل فيديو تيليجرام", s1: "استخدم رابط منشور أو قناة Telegram عامة وصالحة.", s2: "قد تختفي القيود المؤقتة خلال بضع دقائق.", cta: "جرّب تنزيل تيليجرام" },
  es: { title: "El descargador de Telegram no funciona", s1: "Usa un enlace publico valido de Telegram.", s2: "Las limitaciones temporales pueden resolverse en pocos minutos.", cta: "Probar descargador de Telegram" },
  pt: { title: "Downloader do Telegram nao funciona", s1: "Use um link publico valido do Telegram.", s2: "Limitacoes temporarias podem normalizar em alguns minutos.", cta: "Testar downloader do Telegram" },
  fr: { title: "Le telechargeur Telegram ne fonctionne pas", s1: "Utilisez un lien Telegram public et valide.", s2: "Les limitations temporaires peuvent disparaitre en quelques minutes.", cta: "Essayer le telechargeur Telegram" },
  id: { title: "Pengunduh Telegram tidak berfungsi", s1: "Gunakan tautan Telegram publik yang valid.", s2: "Pembatasan sementara biasanya pulih dalam beberapa menit.", cta: "Coba pengunduh Telegram" },
  hi: { title: "Telegram downloader kaam nahi kar raha", s1: "Valid public Telegram post ya channel link ka upyog karein.", s2: "Temporary limits kuch minute me normal ho sakte hain.", cta: "Telegram downloader azmayein" },
  de: { title: "Telegram-Downloader funktioniert nicht", s1: "Verwenden Sie einen gultigen offentlichen Telegram-Link.", s2: "Temporare Limits konnen sich in wenigen Minuten auflosen.", cta: "Telegram-Downloader testen" },
  tr: { title: "Telegram indirici calismiyor", s1: "Gecerli ve herkese acik bir Telegram baglantisi kullanin.", s2: "Gecici kisitlar birkac dakika icinde duzelebilir.", cta: "Telegram indiriciyi dene" },
};

const twitterGuide: Record<Locale, { title: string; s1: string; s2: string; s3?: string; cta: string }> = {
  en: { title: "Twitter Video Downloader Not Working", s1: "Private or restricted posts cannot be processed.", s2: "Use a direct tweet URL without tracking parameters.", cta: "Try Twitter Downloader" },
  ja: { title: "Twitter動画が保存できない場合", s1: "Twitter（X）の動画が保存できない最も多い原因は、投稿が非公開アカウント・年齢制限・センシティブ設定になっているケースです。鍵アカウントや制限付きツイートは、Twitterの仕様によりどの外部ツールでも取得できません。まず公開ツイートのURLであることを確認してください。", s2: "ツイートを開き「共有」→「リンクをコピー」で取得したURLを貼り付けてください。`https://x.com/ユーザー名/status/数字` または `https://twitter.com/...` の形式が確実です。検索結果やプロフィール画面のURL、`?s=20` などの追跡パラメータが付いたリンクでは失敗することがあるため、不要なパラメータは削除してから試してください。", s3: "通常の動画とGIFアニメーションに対応し、最高画質のMP4で保存できます。一方、外部のYouTube埋め込み、Spacesの録音、ライブ配信中の映像には対応していません。「見れない」「読み込み中のまま」になる場合は、数分後に再試行するか、別の公開ツイートで動作を確認してください。", cta: "Twitterダウンローダーを試す" },
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

const tiktokWorkingGuide: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: { title: "TikTok Video Downloader Not Working", s1: "Check the URL format (tiktok.com/@user/video/ID).", s2: "Clear cache and retry.", s3: "Public videos only.", cta: "Try TikTok Downloader" },
  ja: { title: "TikTok動画が保存できない時の解決策", s1: "URL形式（tiktok.com/@user/video/ID）を確認してください。", s2: "ブラウザのキャッシュをクリアして再試行してください。", s3: "公開動画のみ対応しています。非公開動画は保存できません。", cta: "TikTok保存を試す" },
  pt: { title: "TikTok Downloader não funciona", s1: "Verifique o formato da URL (tiktok.com/@user/video/ID).", s2: "Limpe o cache e tente novamente.", s3: "Apenas vídeos públicos.", cta: "Testar downloader do TikTok" },
  ar: { title: "محمل تيك توك لا يعمل", s1: "تحقق من تنسيق الرابط (tiktok.com/@user/video/ID).", s2: "امسح ذاكرة التخزين المؤقت وأعد المحاولة.", s3: "الفيديوهات العامة فقط.", cta: "تجربة محمل تيك توك" },
  es: { title: "El descargador de TikTok no funciona", s1: "Verifica el formato de la URL.", s2: "Limpia el cache.", s3: "Solo videos publicos.", cta: "Probar TikTok" },
  fr: { title: "Le telechargeur TikTok ne fonctionne pas", s1: "Verifiez le format de l URL.", s2: "Videz le cache.", s3: "Videos publiques uniquement.", cta: "Essayer TikTok" },
  id: { title: "Pengunduh TikTok tidak berfungsi", s1: "Periksa format URL.", s2: "Hapus cache.", s3: "Hanya video publik.", cta: "Coba TikTok" },
  hi: { title: "TikTok downloader kaam nahi kar raha", s1: "URL format check karein.", s2: "Cache clear karein.", s3: "Sirf public videos.", cta: "TikTok downloader" },
  de: { title: "TikTok-Downloader funktioniert nicht", s1: "URL-Format prufen.", s2: "Cache leeren.", s3: "Nur offentliche Videos.", cta: "TikTok testen" },
  tr: { title: "TikTok indirici calismiyor", s1: "URL formatini kontrol edin.", s2: "Onbellegi temizleyin.", s3: "Sadece kamuya acik videolar.", cta: "TikToku dene" },
};

const watermarkGuideData: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "How to Download Videos Without Watermark", s1: "TikTok — automatic watermark removal.", s2: "Twitter/X — no watermark by default.", cta: "Start Downloading" },
  ja: { title: "TikTok動画をロゴなしで保存する方法", s1: "TikTok — ClipKeepはAPI経由でロゴなしの元ファイルを直接取得します。", s2: "Twitter/X — Twitter動画には元々ロゴはありません。最高画質で保存します。", cta: "保存を開始する" },
  pt: { title: "Como baixar vídeos sem marca d'água", s1: "TikTok — remocao automatica de marca d'agua.", s2: "Twitter/X — sem marca d'agua por padrao.", cta: "Comecar a baixar" },
  ar: { title: "كيفية تنزيل الفيديوهات بدون علامة مائية", s1: "تيك توك — إزالة العلامة المائية تلقائياً.", s2: "تويتر/X — لا توجد علامة مائية افتراضياً.", cta: "ابدأ التنزيل" },
  es: { title: "Como descargar videos sin marca de agua", s1: "TikTok: eliminacion automatica.", s2: "Twitter: sin marca de agua.", cta: "Empezar" },
  fr: { title: "Comment telecharger sans filigrane", s1: "TikTok : retrait automatique.", s2: "Twitter : sans filigrane.", cta: "Telecharger" },
  id: { title: "Cara download tanpa watermark", s1: "TikTok - hapus otomatis.", s2: "Twitter - tanpa watermark.", cta: "Mulai" },
  hi: { title: "Bina watermark video kaise download karein", s1: "TikTok - watermark hatayein.", s2: "Twitter - no watermark.", cta: "Shuru karein" },
  de: { title: "Videos ohne Wasserzeichen herunterladen", s1: "TikTok - automatisch entfernen.", s2: "Twitter - kein Wasserzeichen.", cta: "Starten" },
  tr: { title: "Filigransiz video nasil indirilir", s1: "TikTok - otomatik kaldirma.", s2: "Twitter - filigransiz.", cta: "Basla" },
};

const mobileGuideData: Record<Locale, { title: string; s1: string; s2: string; s3Heading: string; s3: string; cta: string }> = {
  en: { title: "How to Save Videos on iPhone & Android", s1: "iPhone (iOS) — After ClipKeep finishes extraction, tap the download option, then use the Share sheet to choose Save to Files or Save Video. Safari usually gives the most reliable save dialog on iPhone.", s2: "Android — Chrome normally saves the MP4 directly to Downloads. If the video opens in a new tab, open the browser menu and choose Download or Save video.", s3Heading: "Find the saved file", s3: "If you cannot find the file, check Files > Downloads on Android or the Files app on iPhone. Large HD videos may take a few seconds to appear after the browser finishes downloading.", cta: "Download Now" },
  ja: { title: "iPhoneやAndroidで動画を保存する方法", s1: "iPhone (iOS) — ClipKeepで抽出が完了したらダウンロードをタップし、共有メニューから「ファイルに保存」または「ビデオを保存」を選びます。iPhoneではSafariを使うと保存ダイアログが安定します。", s2: "Android — Chromeでは通常、MP4が「ダウンロード」フォルダに直接保存されます。動画が新しいタブで開いた場合は、ブラウザメニューから「ダウンロード」または「動画を保存」を選択してください。", s3Heading: "保存先を確認する", s3: "保存先が見つからない場合は、AndroidではFilesの「ダウンロード」、iPhoneでは「ファイル」アプリを確認します。HD動画は完了後に表示されるまで数秒かかることがあります。", cta: "保存を開始する" },
  pt: { title: "Como salvar vídeos no iPhone e Android", s1: "iPhone (iOS) — Depois que o ClipKeep terminar a extração, toque na opção de download e use o menu de compartilhamento para escolher Salvar em Arquivos ou Salvar Vídeo. No iPhone, o Safari costuma mostrar o salvamento com mais consistência.", s2: "Android — No Chrome, o MP4 normalmente vai direto para a pasta Downloads. Se o vídeo abrir em uma nova aba, use o menu do navegador e escolha Baixar ou Salvar vídeo.", s3Heading: "Encontrar o arquivo salvo", s3: "Se não encontrar o arquivo, verifique Arquivos > Downloads no Android ou o app Arquivos no iPhone. Vídeos HD grandes podem demorar alguns segundos para aparecer depois do download.", cta: "Baixar Agora" },
  ar: { title: "كيفية حفظ الفيديوهات على آيفون وأندرويد", s1: "آيفون (iOS) — بعد انتهاء ClipKeep من الاستخراج، اضغط خيار التنزيل ثم استخدم قائمة المشاركة لاختيار حفظ في الملفات أو حفظ الفيديو. يعمل Safari غالباً بشكل أكثر ثباتاً على iPhone.", s2: "أندرويد — في Chrome يتم حفظ ملف MP4 عادةً مباشرة في مجلد Downloads. إذا فتح الفيديو في تبويب جديد، افتح قائمة المتصفح واختر تنزيل أو حفظ الفيديو.", s3Heading: "العثور على الملف المحفوظ", s3: "إذا لم تجد الملف، تحقق من Files > Downloads على Android أو تطبيق الملفات على iPhone. قد تحتاج فيديوهات HD الكبيرة إلى بضع ثوانٍ لتظهر بعد اكتمال التنزيل.", cta: "تنزيل الآن" },
  es: { title: "Cómo guardar videos en iPhone y Android", s1: "iPhone — Cuando ClipKeep termine la extracción, toca descargar y usa el menú Compartir para elegir Guardar en Archivos o Guardar Video. Safari suele mostrar el diálogo de guardado con más estabilidad.", s2: "Android — Chrome normalmente guarda el MP4 en la carpeta Descargas. Si el video se abre en una pestaña nueva, abre el menú del navegador y elige Descargar o Guardar video.", s3Heading: "Encontrar el archivo guardado", s3: "Si no encuentras el archivo, revisa Archivos > Descargas en Android o la app Archivos en iPhone. Los videos HD grandes pueden tardar unos segundos en aparecer.", cta: "Descargar" },
  fr: { title: "Comment enregistrer sur iPhone et Android", s1: "iPhone — Une fois l'extraction terminee dans ClipKeep, touchez telecharger puis utilisez le menu de partage pour choisir Enregistrer dans Fichiers ou Enregistrer la video. Safari est souvent le plus fiable sur iPhone.", s2: "Android — Chrome enregistre normalement le MP4 dans Telechargements. Si la video s'ouvre dans un nouvel onglet, ouvrez le menu du navigateur et choisissez Telecharger ou Enregistrer la video.", s3Heading: "Retrouver le fichier", s3: "Si le fichier est introuvable, verifiez Fichiers > Telechargements sur Android ou l'app Fichiers sur iPhone. Les videos HD volumineuses peuvent apparaitre apres quelques secondes.", cta: "Telecharger" },
  id: { title: "Cara simpan video di iPhone & Android", s1: "iPhone — Setelah ClipKeep selesai mengekstrak, ketuk opsi download lalu gunakan menu Bagikan untuk memilih Simpan ke File atau Simpan Video. Safari biasanya paling stabil di iPhone.", s2: "Android — Chrome biasanya menyimpan MP4 langsung ke folder Downloads. Jika video terbuka di tab baru, buka menu browser dan pilih Download atau Simpan video.", s3Heading: "Temukan file tersimpan", s3: "Jika file belum terlihat, cek Files > Downloads di Android atau aplikasi Files di iPhone. Video HD berukuran besar bisa butuh beberapa detik sebelum muncul.", cta: "Download" },
  hi: { title: "iPhone aur Android par video kaise save karein", s1: "iPhone — ClipKeep extraction ke baad download option tap karein, phir Share menu se Save to Files ya Save Video chunen. iPhone par Safari save dialog ke liye sabse reliable hota hai.", s2: "Android — Chrome aam taur par MP4 ko Downloads folder me save karta hai. Agar video nayi tab me khule, browser menu se Download ya Save video chunen.", s3Heading: "Saved file dhundhein", s3: "File na mile to Android me Files > Downloads aur iPhone me Files app check karein. Bade HD videos download ke baad dikhne me kuch seconds le sakte hain.", cta: "Download" },
  de: { title: "Videos auf iPhone und Android speichern", s1: "iPhone — Wenn ClipKeep die Extraktion beendet hat, tippen Sie auf Download und nutzen Sie das Teilen-Menue fur In Dateien sichern oder Video sichern. Safari zeigt den Speichern-Dialog auf dem iPhone meist am zuverlaessigsten.", s2: "Android — Chrome speichert die MP4-Datei normalerweise direkt im Downloads-Ordner. Wenn das Video in einem neuen Tab geoeffnet wird, waehlen Sie im Browser-Menue Download oder Video speichern.", s3Heading: "Gespeicherte Datei finden", s3: "Wenn Sie die Datei nicht finden, pruefen Sie Dateien > Downloads auf Android oder die Dateien-App auf dem iPhone. Grosse HD-Videos koennen nach dem Download einige Sekunden brauchen.", cta: "Jetzt laden" },
  tr: { title: "iPhone ve Android'de video nasıl kaydedilir", s1: "iPhone — ClipKeep çıkarma işlemini bitirdikten sonra indirme seçeneğine dokunun ve Paylaş menüsünden Dosyalara Kaydet veya Videoyu Kaydet seçeneğini kullanın. iPhone'da Safari genellikle daha kararlı kayıt ekranı gösterir.", s2: "Android — Chrome MP4 dosyasını genellikle İndirilenler klasörüne kaydeder. Video yeni sekmede açılırsa tarayıcı menüsünden İndir veya Videoyu kaydet seçeneğini seçin.", s3Heading: "Kaydedilen dosyayı bul", s3: "Dosyayı bulamazsanız Android'de Files > Downloads, iPhone'da Dosyalar uygulamasını kontrol edin. Büyük HD videolar indirme bittikten sonra birkaç saniye içinde görünebilir.", cta: "Hemen İndir" },
};

const redditGuide: Record<Locale, { title: string; s1: string; s2: string; s3?: string; cta: string }> = {
  en: { title: "Reddit Video Downloader Not Working", s1: "Use the direct post URL.", s2: "Audio and video are separate on Reddit; we merge them.", cta: "Try Reddit Downloader" },
  ja: { title: "Reddit動画が保存できない場合", s1: "Reddit動画が保存できないときは、投稿の直接URL（`reddit.com/r/サブレディット名/comments/...`）または `redd.it` の短縮リンクを使用してください。検索画面や一覧からコピーしたURL、余分なクエリパラメータが付いたリンクでは正しく取得できないことがあります。", s2: "Redditでは映像と音声が別々のストリームで配信されているため、他ツールでは音声なしで保存されることがあります。ClipKeepは映像と音声を自動的に取得・合成し、1つの音声付きMP4として保存します。古い投稿など、元から映像のみの場合は音声は含まれません。", s3: "非公開（プライベート）サブレディット、ログインが必要なNSFW（成人向け）コミュニティ、隔離（quarantined）コミュニティ、削除済みの投稿は、Redditの仕様により保存できません。公開サブレディットの投稿であれば、リンクを貼り付けるだけで保存できます。", cta: "Reddit保存を試す" },
  ar: { title: "محمل فيديوهات Reddit لا يعمل", s1: "استخدم رابط المنشور المباشر.", s2: "يتم دمج الصوت والفيديو تلقائياً.", cta: "تجربة محمل Reddit" },
  es: { title: "El descargador de Reddit no funciona", s1: "Usa la URL directa de la publicación.", s2: "Combinamos audio y video automáticamente.", cta: "Probar Reddit" },
  pt: { title: "Downloader do Reddit não funciona", s1: "Use a URL direta do post.", s2: "Combinamos áudio e vídeo automaticamente.", cta: "Testar Reddit" },
  fr: { title: "Le telechargeur Reddit ne fonctionne pas", s1: "Utilisez l URL directe du post.", s2: "Nous fusionnons l audio et la video.", cta: "Essayer Reddit" },
  id: { title: "Pengunduh Reddit tidak berfungsi", s1: "Gunakan URL postingan langsung.", s2: "Kami menggabungkan audio and video secara otomatis.", cta: "Coba Reddit" },
  hi: { title: "Reddit downloader kaam nahi kar raha", s1: "Direct post URL ka upyog karein.", s2: "Audio aur video ko hum automatically merge karte hain.", cta: "Reddit downloader" },
  de: { title: "Reddit-Downloader funktioniert nicht", s1: "Verwenden Sie die direkte Post-URL.", s2: "Audio und Video werden automatisch zusammengefuhrt.", cta: "Reddit testen" },
  tr: { title: "Reddit indirici calismiyor", s1: "Dogrudan gonderi URL'sini kullanin.", s2: "Ses ve videoyu otomatik olarak birlestiriyoruz.", cta: "Reddit'i dene" },
};

const qualityGuide: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "How to Get the Best Quality Download", s1: "Always select the highest resolution option available.", s2: "HD is limited by the source upload quality.", cta: "Start Downloading" },
  ja: { title: "最高画質で動画を保存する方法", s1: "オプションに複数の解像度がある場合は、常に最も高い数値を選択してください。", s2: "HD画質は元の投稿動画の品質に依存します。", cta: "保存を開始する" },
  ar: { title: "كيفية الحصول على أفضل جودة تنزيل", s1: "اختر دائماً أعلى دقة متاحة في الخيارات.", s2: "جودة HD تعتمد على جودة الفيديو الأصلي المرفوع.", cta: "ابدأ التنزيل" },
  es: { title: "Cómo obtener la mejor calidad de descarga", s1: "Selecciona siempre la resolución más alta disponible.", s2: "La calidad HD depende de la fuente original.", cta: "Empezar" },
  pt: { title: "Como obter a melhor qualidade de download", s1: "Sempre selecione a maior resolução disponível.", s2: "A qualidade HD depende do vídeo original.", cta: "Baixar Agora" },
  fr: { title: "Comment obtenir la meilleure qualité", s1: "Choisissez toujours la résolution la plus élevée.", s2: "La qualité dépend de la source originale.", cta: "Telecharger" },
  id: { title: "Cara mendapatkan kualitas terbaik", s1: "Pilih resolusi tertinggi yang tersedia.", s2: "Kualitas HD tergantung pada sumber asli.", cta: "Mulai" },
  hi: { title: "Best quality download kaise karein", s1: "Hamesha available sabse high resolution chunein.", s2: "HD quality source par depend karti hai.", cta: "Download karein" },
  de: { title: "So erhalten Sie die beste Qualitat", s1: "Wahlen Sie immer die hochste verfugbare Auflosung.", s2: "HD-Qualitat hangt vom Original-Upload ab.", cta: "Jetzt laden" },
  tr: { title: "En iyi kalitede indirme nasıl yapılır", s1: "Her zaman mevcut olan en yüksek çözünürlüğü seçin.", s2: "HD kalitesi orijinal kaynağa bağlıdır.", cta: "Hemen İndir" },
};

const twitter2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Twitter / X Video Downloader — 2026 Guide",
    s1: "ClipKeep is regularly updated to stay compatible with X's evolving API. As of 2026, paste any public tweet URL containing a video or GIF and ClipKeep will extract it.",
    s2: "Open the tweet on X, tap Share > Copy Link, then paste it into ClipKeep. Select your preferred quality (HD recommended) and download the MP4.",
    s3: "Public tweets with native video or GIF work. Linked YouTube embeds, Spaces recordings, and private account posts are not supported.",
    cta: "Try Twitter Downloader"
  },
  ja: {
    title: "Twitter (X) 動画保存・ダウンロード 2026年最新ガイド",
    s1: "ClipKeepはXのAPI仕様変更に常に適応しています。2026年現在、動画やGIFを含むすべての公開ツイートからメディアを抽出可能です。",
    s2: "保存方法：Xで投稿を開き「共有」からリンクをコピーしてClipKeepに貼り付けるだけ。最高画質(HD)を選択して保存してください。",
    s3: "通常の動画やGIFに対応。YouTube埋め込み、スペースの録音、非公開アカウントの投稿には対応していません。",
    cta: "Twitter動画保存を試す"
  },
  pt: {
    title: "Baixar Vídeo do Twitter / X — Guia 2026",
    s1: "O ClipKeep é atualizado regularmente para ser compatível com as mudanças no X. Em 2026, basta colar qualquer link público de tweet com vídeo.",
    s2: "Como usar: No X, toque em Compartilhar > Copiar Link, cole no ClipKeep. Escolha a qualidade HD e baixe o MP4.",
    s3: "Funciona com vídeos nativos e GIFs. Links do YouTube, Spaces e contas privadas não são suportados.",
    cta: "Baixar Vídeo do Twitter"
  },
  ar: {
    title: "دليل تنزيل فيديوهات تويتر (X) — تحديث 2026",
    s1: "يتم تحديث ClipKeep بانتظام ليتوافق مع تغييرات X. في عام 2026، يمكنك استخراج أي فيديو أو GIF من التغريدات العامة.",
    s2: "طريقة الاستخدام: افتح التغريدة، اضغط مشاركة > نسخ الرابط، ثم ألصقه في ClipKeep. اختر جودة HD وحمل ملف MP4.",
    s3: "يدعم الفيديوهات الأصلية وGIF. لا يدعم روابط يوتيوب، تسجيلات Spaces، أو الحسابات الخاصة.",
    cta: "جرب محمل تويتر"
  },
  es: { title: "Descargador de videos de Twitter / X — Guía 2026", s1: "ClipKeep se actualiza regularmente para ser compatible con los cambios de X en 2026. Pega cualquier enlace de tweet público con vídeo.", s2: "Cómo usar: En X, pulsa Compartir > Copiar enlace, pégalo en ClipKeep. Elige calidad HD y descarga el MP4.", s3: "Funciona con vídeos y GIFs. No soporta enlaces de YouTube, Spaces o cuentas privadas.", cta: "Probar Twitter" },
  fr: { title: "Téléchargeur Vidéo Twitter / X — Guide 2026", s1: "ClipKeep est mis à jour pour rester compatible avec les évolutions de X en 2026. Collez n'importe quel lien de tweet public avec vidéo.", s2: "Utilisation : Sur X, appuyez sur Partager > Copier le lien, collez-le dans ClipKeep. Choisissez la qualité HD et téléchargez le MP4.", s3: "Compatible vidéos et GIFs. Ne supporte pas les liens YouTube, Spaces ou comptes privés.", cta: "Essayer Twitter" },
  id: { title: "Pengunduh Video Twitter / X — Panduan 2026", s1: "ClipKeep diperbarui secara rutin agar tetap kompatibel dengan perubahan X di 2026. Tempel tautan tweet publik apa pun yang berisi video.", s2: "Cara pakai: Di X, ketuk Bagikan > Salin Tautan, tempel ke ClipKeep. Pilih kualitas HD dan unduh MP4.", s3: "Mendukung video dan GIF. Tidak mendukung tautan YouTube, Spaces, atau akun privat.", cta: "Coba Twitter" },
  hi: { title: "Twitter / X Video Downloader — 2026 गाइड", s1: "ClipKeep को X के 2026 के बदलावों के साथ संगत रहने के लिए अपडेट किया गया है। किसी भी सार्वजनिक ट्वीट लिंक को पेस्ट करें।", s2: "कैसे उपयोग करें: X पर शेयर > लिंक कॉपी करें, फिर ClipKeep में पेस्ट करें। HD क्वालिटी चुनें और MP4 डाउनलोड करें।", s3: "वीडियो और GIF के लिए काम करता है। YouTube लिंक, Spaces या प्राइवेट अकाउंट सपोर्टेड नहीं हैं।", cta: "Twitter डाउनलोडर" },
  de: { title: "Twitter / X Video Downloader — Guide 2026", s1: "ClipKeep wird regelmäßig aktualisiert, um mit den X-Änderungen im Jahr 2026 kompatibel zu bleiben. Fügen Sie einen öffentlichen Tweet-Link ein.", s2: "Anwendung: Auf X auf Teilen > Link kopieren klicken, bei ClipKeep einfügen. HD-Qualität wählen und MP4 herunterladen.", s3: "Unterstützt Videos und GIFs. Keine YouTube-Links, Spaces oder private Konten.", cta: "Twitter testen" },
  tr: { title: "Twitter / X Video İndirici — 2026 Kılavuzu", s1: "ClipKeep, 2026'daki X değişiklikleriyle uyumlu kalacak şekilde düzenli olarak güncellenir. Herhangi bir tweet bağlantısını yapıştırın.", s2: "Nasıl kullanılır: X'te Paylaş > Bağlantıyı Kopyala'ya tıklayın, ClipKeep'e yapıştırın. HD kaliteyi seçin ve MP4'ü indirin.", s3: "Videolar ve GIF'ler için çalışır. YouTube bağlantıları, Spaces veya gizli hesaplar desteklenmez.", cta: "Twitter'ı dene" },
};

const tiktok2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "TikTok Video Downloader — 2026 Guide",
    s1: "ClipKeep adapts continuously as TikTok updates its CDN and API. Paste any public TikTok video URL and ClipKeep will extract the watermark-free HD MP4.",
    s2: "In the TikTok app tap Share > Copy Link, then paste it into ClipKeep. Both full tiktok.com URLs and short vt.tiktok.com links are accepted.",
    s3: "Private accounts, videos removed by TikTok, and videos restricted to certain regions cannot be downloaded. Duets and Stitch videos download the combined final version.",
    cta: "Try TikTok Downloader"
  },
  ja: {
    title: "TikTok動画保存 (ロゴなし) — 2026年最新ガイド",
    s1: "TikTokのCDNやAPI更新に常に対応。ClipKeepはロゴなし(透かしなし)のHD MP4動画を高速に抽出します。",
    s2: "使い方：TikTokアプリで共有ボタンを押し「リンクをコピー」してClipKeepに貼り付けるだけ。短縮URL(vt.tiktok.com)も対応。",
    s3: "非公開アカウント、削除済み動画、地域制限動画は保存できません。デュエットやリミックス動画は結合版が保存されます。",
    cta: "TikTok動画保存を試す"
  },
  pt: {
    title: "Baixar Vídeo do TikTok Sem Marca d'Água — Guia 2026",
    s1: "O ClipKeep se adapta às atualizações do TikTok. Cole qualquer URL de vídeo público e extraia o MP4 HD sem marca d'água.",
    s2: "No app TikTok, toque em Compartilhar > Copiar Link e cole no ClipKeep. Aceitamos links tiktok.com e vt.tiktok.com.",
    s3: "Contas privadas e vídeos removidos não podem ser baixados. Vídeos de Dueto e Stitch baixam a versão final combinada.",
    cta: "Baixar Vídeo do TikTok"
  },
  ar: {
    title: "تنزيل فيديوهات تيك توك بدون علامة مائية — دليل 2026",
    s1: "يتوافق ClipKeep مع تحديثات تيك توك المستمرة. ألصق أي رابط فيديو عام واستخرج ملف MP4 HD بدون شعار تيك توك.",
    s2: "في تطبيق TikTok، اضغط مشاركة > نسخ الرابط، ثم ألصقه في ClipKeep. ندعم الروابط الطويلة والقصيرة (vt.tiktok.com).",
    s3: "لا يمكن تنزيل فيديوهات الحسابات الخاصة أو المحذوفة. فيديوهات Duets و Stitch يتم تنزيلها كنسخة نهائية مدمجة.",
    cta: "جرب محمل تيك توك"
  },
  es: { title: "Descargador de TikTok sin marca de agua — Guía 2026", s1: "ClipKeep se adapta continuamente a las actualizaciones de TikTok. Pega cualquier URL de vídeo público y ClipKeep extraerá el MP4 HD sin marca de agua.", s2: "En la app TikTok pulsa Compartir > Copiar enlace, luego pégalo en ClipKeep. Se aceptan enlaces largos y cortos.", s3: "Cuentas privadas y videos eliminados no son compatibles. Duetos y Stitch descargan la versión combinada.", cta: "Probar TikTok" },
  fr: { title: "Téléchargeur TikTok sans filigrane — Guide 2026", s1: "ClipKeep s'adapte en continu aux mises à jour de TikTok. Collez n'importe quelle URL de vidéo publique et ClipKeep extraira le MP4 HD sans filigrane.", s2: "Dans l'application TikTok, appuyez sur Partager > Copier le lien, puis collez-le dans ClipKeep. Liens longs et courts acceptés.", s3: "Les comptes privés et les vidéos supprimées ne sont pas supportés. Les Duos et Stitch téléchargent la version finale combinée.", cta: "Essayer TikTok" },
  id: { title: "Pengunduh TikTok tanpa watermark — Panduan 2026", s1: "ClipKeep terus beradaptasi dengan pembaruan TikTok. Tempel URL video publik apa pun dan ClipKeep akan mengekstrak MP4 HD tanpa tanda air.", s2: "Di aplikasi TikTok ketuk Bagikan > Salin Tautan, lalu tempel ke ClipKeep. Tautan panjang dan pendek (vt.tiktok.com) diterima.", s3: "Akun privat dan video yang dihapus tidak dapat diunduh. Video Duet dan Stitch mengunduh versi gabungan akhir.", cta: "Coba TikTok" },
  hi: { title: "TikTok बिना वॉटरमार्क डाउनलोडर — 2026 गाइड", s1: "TikTok के अपडेट के साथ ClipKeep लगातार खुद को ढालता है। किसी भी सार्वजनिक TikTok वीडियो URL को पेस्ट करें और वॉटरमार्क-मुक्त HD MP4 प्राप्त करें।", s2: "TikTok ऐप में शेयर > लिंक कॉपी करें, फिर इसे ClipKeep में पेस्ट करें। लंबे और छोटे (vt.tiktok.com) दोनों लिंक स्वीकार किए जाते हैं।", s3: "प्राइवेट अकाउंट और हटाए गए वीडियो डाउनलोड नहीं किए जा सकते। युगल और स्टिच वीडियो संयुक्त संस्करण डाउनलोड करते हैं।", cta: "TikTok डाउनलोडर" },
  de: { title: "TikTok Downloader ohne Wasserzeichen — Guide 2026", s1: "ClipKeep passt sich kontinuierlich an TikTok-Updates an. Fügen Sie eine öffentliche TikTok-URL ein, um das MP4 HD ohne Wasserzeichen zu erhalten.", s2: "Tippen Sie in der TikTok-App auf Teilen > Link kopieren und fügen Sie ihn bei ClipKeep ein. Lange und kurze Links werden unterstützt.", s3: "Private Konten und gelöschte Videos werden nicht unterstützt. Duette und Stitch-Videos laden die kombinierte Endversion.", cta: "TikTok testen" },
  tr: { title: "Filigransız TikTok İndirici — 2026 Kılavuzu", s1: "ClipKeep, TikTok güncellemelerine sürekli uyum sağlar. Herhangi bir genel TikTok video URL'sini yapıştırın ve filigransız HD MP4'ü alın.", s2: "TikTok uygulamasında Paylaş > Bağlantıyı Kopyala'ya dokunun, ardından ClipKeep'e yapıştırın. Hem uzun hem de kısa bağlantılar desteklenir.", s3: "Gizli hesaplar ve silinen videolar indirilemez. Düet ve Stitch videoları birleştirilmiş son sürümü indirir.", cta: "TikTok'u dene" },
};

const reddit2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Reddit Video Downloader — 2026 Guide",
    s1: "As of 2026, Reddit videos often use separate streams for audio and video. ClipKeep automatically fetches and merges these into a single high-quality MP4 for you.",
    s2: "Simply copy the Reddit post URL (e.g., reddit.com/r/videos/...) and paste it into ClipKeep. We support both the classic desktop links and the mobile 'share' links.",
    s3: "Public posts in open subreddits are supported. Private subreddits, quarantined communities, and deleted posts cannot be accessed.",
    cta: "Try Reddit Downloader"
  },
  ja: {
    title: "Reddit動画保存・ダウンロード 2026年最新ガイド",
    s1: "2026年現在、Redditの動画は映像と音声が分離して配信されています。ClipKeepはこれらを自動的に取得・合成し、1つの高品質なMP4として保存可能にします。",
    s2: "Redditの投稿URL（reddit.com/r/...）をコピーしてClipKeepに貼り付けるだけ。デスクトップ版リンクとモバイル共有用リンクの両方に対応しています。",
    s3: "公開サブレディットの投稿に対応。非公開（プライベート）サブレディット、隔離済みのコミュニティ、削除された投稿は保存できません。",
    cta: "Reddit保存を試す"
  },
  pt: {
    title: "Baixar Vídeo do Reddit — Guia 2026",
    s1: "Em 2026, o Reddit usa transmissões separadas para áudio e vídeo. O ClipKeep baixa e mescla ambos automaticamente em um único MP4 de alta qualidade.",
    s2: "Copie a URL do post do Reddit e cole no ClipKeep. Suportamos links de desktop e links de compartilhamento mobile.",
    s3: "Apenas posts públicos em subreddits abertos. Subreddits privados ou posts excluídos não podem ser acessados.",
    cta: "Baixar Vídeo do Reddit"
  },
  ar: {
    title: "دليل تنزيل فيديوهات ريديت (Reddit) — تحديث 2026",
    s1: "في عام 2026، يستخدم Reddit مسارات منفصلة للصوت والفيديو. يقوم ClipKeep بدمجها تلقائياً في ملف MP4 واحد عالي الجودة.",
    s2: "انسخ رابط منشور Reddit وألصقه في ClipKeep. ندعم روابط سطح المكتب وروابط المشاركة من الجوال.",
    s3: "يدعم المنشورات العامة في المجتمعات المفتوحة. لا يدعم المجتمعات الخاصة أو المنشورات المحذوفة.",
    cta: "جرب محمل Reddit"
  },
  es: { title: "Descargador de videos de Reddit — Guía 2026", s1: "En 2026, Reddit separa audio y video. ClipKeep los une automáticamente en un MP4 de alta calidad.", s2: "Copia la URL del post de Reddit y pégala en ClipKeep. Soporta enlaces de escritorio y móviles.", s3: "Solo posts públicos. No soporta subreddits privados o contenido eliminado.", cta: "Probar Reddit" },
  fr: { title: "Téléchargeur Vidéo Reddit — Guide 2026", s1: "En 2026, Reddit sépare l'audio et la vidéo. ClipKeep les fusionne automatiquement en un MP4 de haute qualité.", s2: "Copiez l'URL du post Reddit et collez-la dans ClipKeep. Liens bureau et mobile supportés.", s3: "Posts publics uniquement. Ne supporte pas les subreddits privés ou le contenu supprimé.", cta: "Essayer Reddit" },
  id: { title: "Pengunduh Video Reddit — Panduan 2026", s1: "Di 2026, Reddit memisahkan audio dan video. ClipKeep menggabungkannya secara otomatis menjadi MP4 berkualitas tinggi.", s2: "Salin URL postingan Reddit dan tempel ke ClipKeep. Mendukung tautan desktop dan mobile.", s3: "Hanya postingan publik. Tidak mendukung subreddit privat atau konten yang dihapus.", cta: "Coba Reddit" },
  hi: { title: "Reddit Video Downloader — 2026 गाइड", s1: "2026 में, Reddit ऑडियो और वीडियो को अलग रखता है। ClipKeep उन्हें ऑटोमैटिक मर्ज करके हाई-क्वालिटी MP4 बनाता है।", s2: "Reddit पोस्ट URL को कॉपी करके ClipKeep में पेस्ट करें। डेस्कटॉप और मोबाइल शेयर लिंक दोनों सपोर्टेड हैं।", s3: "सार्वजनिक पोस्ट के लिए काम करता है। प्राइवेट सबरेडिट या हटाए गए पोस्ट एक्सेस नहीं किए जा सकते।", cta: "Reddit डाउनलोडر" },
  de: { title: "Reddit Video Downloader — Guide 2026", s1: "Im Jahr 2026 trennt Reddit Audio und Video. ClipKeep führt beides automatisch in einem hochwertigen MP4 zusammen.", s2: "Kopieren Sie die Reddit-Post-URL und fügen Sie sie bei ClipKeep ein. Desktop- und mobile Links werden unterstützt.", s3: "Nur öffentliche Beiträge. Keine privaten Subreddits oder gelöschten Inhalte.", cta: "Reddit testen" },
  tr: { title: "Reddit Video İndirici — 2026 Kılavuzu", s1: "2026'da Reddit ses ve videoyu ayırıyor. ClipKeep bunları otomatik olarak tek bir yüksek kaliteli MP4'te birleştirir.", s2: "Reddit gönderi URL'sini kopyalayıp ClipKeep'e yapıştırın. Masaüstü ve mobil paylaşım bağlantıları desteklenir.", s3: "Yalnızca herkese açık gönderiler. Gizli subredditler veya silinen içerikler desteklenmez.", cta: "Reddit'i dene" },
};

const facebook2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Facebook Video Downloader — 2026 Guide",
    s1: "Facebook (Meta) frequently updates its video delivery system. In 2026, ClipKeep remains the most reliable tool to fetch public videos, Reels, and public group content.",
    s2: "Copy the link from the 'Share' menu or your browser address bar. Paste it into ClipKeep. We support both high-definition (HD) and standard-definition (SD) sources.",
    s3: "Only public videos can be downloaded. Content set to 'Friends Only' or posted in private groups cannot be accessed due to privacy restrictions.",
    cta: "Try Facebook Downloader"
  },
  ja: {
    title: "Facebook動画保存・ダウンロード 2026年最新ガイド",
    s1: "Facebook(Meta)は頻繁に動画配信仕様を変更しますが、ClipKeepは2026年も最新のレコメンド動画、リール、公開グループの投稿に対応しています。",
    s2: "保存方法：「共有」メニューまたはブラウザのURLバーからリンクをコピーし、ClipKeepに貼り付けてください。HD画質とSD画質の選択が可能です。",
    s3: "公開設定の動画のみ対応。「友達限定」や非公開グループ内の動画は、プライバシー保護のため保存できません。",
    cta: "Facebook動画保存を試す"
  },
  pt: { title: "Baixar Vídeo do Facebook — Guia 2026", s1: "O Facebook (Meta) atualiza frequentemente seu sistema. Em 2026, o ClipKeep continua sendo a ferramenta mais confiável para baixar vídeos públicos e Reels.", s2: "Copie o link do menu 'Compartilhar' ou da barra de endereços. Cole no ClipKeep. Suportamos resoluções HD e SD.", s3: "Apenas vídeos públicos. Conteúdo restrito a 'Amigos' ou grupos privados não pode ser acessado.", cta: "Baixar Vídeo do Facebook" },
  ar: { title: "دليل تنزيل فيديوهات فيسبوك — تحديث 2026", s1: "يقوم فيسبوك بتحديث نظام بث الفيديو باستمرار. في عام 2026، يظل ClipKeep الأداة الأكثر موثوقية لتنزيل الفيديوهات العامة والـ Reels.", s2: "انسخ الرابط من قائمة 'مشاركة' أو شريط العنوان. ألصقه في ClipKeep. ندعم جودتي HD و SD.", s3: "للفيديوهات العامة فقط. لا يمكن الوصول إلى المحتوى المقتصر على 'الأصدقاء' أو المجموعات الخاصة.", cta: "جرب محمل فيسبوك" },
  es: { title: "Descargador de videos de Facebook — Guía 2026", s1: "Facebook actualiza su sistema frecuentemente. En 2026, ClipKeep sigue siendo la herramienta más confiable para descargar videos públicos y Reels.", s2: "Copia el enlace del menú 'Compartir' y pégalo en ClipKeep. Soportamos calidad HD y SD.", s3: "Solo videos públicos. No se puede acceder a contenido de 'Amigos' o grupos privados.", cta: "Probar Facebook" },
  fr: { title: "Téléchargeur Vidéo Facebook — Guide 2026", s1: "Facebook met souvent à jour son système. En 2026, ClipKeep reste l'outil le plus fiable pour télécharger des vidéos publiques et des Reels.", s2: "Copiez le lien depuis le menu 'Partager' et collez-le dans ClipKeep. Nous supportons les qualités HD et SD.", s3: "Uniquement pour les vidéos publiques. Le contenu réservé aux 'Amis' ou aux groupes privés n'est pas accessible.", cta: "Essayer Facebook" },
  id: { title: "Pengunduh Video Facebook — Panduan 2026", s1: "Facebook sering memperbarui sistem videonya. Di 2026, ClipKeep tetap menjadi alat paling andal untuk mengunduh video publik dan Reels.", s2: "Salin tautan dari menu 'Bagikan' dan tempel ke ClipKeep. Kami mendukung kualitas HD dan SD.", s3: "Hanya untuk video publik. Konten 'Hanya Teman' atau grup privat tidak dapat diakses.", cta: "Coba Facebook" },
  hi: { title: "Facebook Video Downloader — 2026 गाइड", s1: "Facebook अक्सर अपना सिस्टम अपडेट करता है। 2026 में, ClipKeep सार्वजनिक वीडियो और Reels डाउनलोड करने का सबसे भरोसेमंद टूल है।", s2: "'Share' मेनू से लिंक कॉपी करें और ClipKeep में पेस्ट करें। हम HD और SD दोनों सपोर्ट करते हैं।", s3: "केवल सार्वजनिक वीडियो। 'Friends Only' या प्राइवेट ग्रुप का कंटेंट डाउनलोड नहीं किया जा सकता।", cta: "Facebook डाउनलोडर" },
  de: { title: "Facebook Video Downloader — Guide 2026", s1: "Facebook aktualisiert sein System häufig. Im Jahr 2026 bleibt ClipKeep das zuverlässigste Tool für öffentliche Videos und Reels.", s2: "Kopieren Sie den Link aus dem 'Teilen'-Menü und fügen Sie ihn bei ClipKeep ein. Wir unterstützen HD- und SD-Qualität.", s3: "Nur öffentliche Videos. Inhalte für 'Freunde' oder private Gruppen sind nicht zugänglich.", cta: "Facebook testen" },
  tr: { title: "Facebook Video İndirici — 2026 Kılavuzu", s1: "Facebook sistemini sık sık günceller. 2026'da ClipKeep, kamuya açık videoları ve Reels içeriklerini indirmek için en güvenilir araçtır.", s2: "'Paylaş' menüsünden bağlantıyı kopyalayın ve ClipKeep'e yapıştırın. HD ve SD seçeneklerini destekliyoruz.", s3: "Yalnızca herkese açık videolar. 'Arkadaşlar' veya özel gruplardaki içeriklere erişilemez.", cta: "Facebook'u dene" },
};

const threads2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Threads Video Downloader — 2026 Guide",
    s1: "Threads is Meta's rapidly growing text and video platform. In 2026, ClipKeep provides a seamless way to save high-quality videos and GIFs directly from Threads posts.",
    s2: "Tap the share icon on a Threads post, select 'Copy Link', and paste it into ClipKeep. The tool will automatically extract the original MP4 file.",
    s3: "Works for all public Threads profiles. Private profiles and content that has been deleted or restricted by the author are not accessible.",
    cta: "Try Threads Downloader"
  },
  ja: {
    title: "Threads動画保存・ダウンロード 2026年最新ガイド",
    s1: "Meta社の新プラットフォームThreadsは2026年も急成長中。ClipKeepを使えば、Threadsの投稿から動画やGIFを高品質なまま直接保存できます。",
    s2: "保存方法：投稿のシェアアイコンから「リンクをコピー」し、ClipKeepに貼り付けるだけ。オリジナルのMP4ファイルを自動抽出します。",
    s3: "すべての公開プロフィールに対応。非公開アカウントや、投稿者が削除・制限したコンテンツは取得できません。",
    cta: "Threads動画保存を試す"
  },
  pt: { title: "Baixar Vídeo do Threads — Guia 2026", s1: "Threads é a plataforma da Meta em crescimento. Em 2026, o ClipKeep oferece uma forma simples de salvar vídeos e GIFs do Threads.", s2: "Toque no ícone de compartilhar, selecione 'Copiar Link' e cole no ClipKeep. O MP4 original será extraído.", s3: "Funciona para perfis públicos. Perfis privados ou conteúdo excluído não são acessíveis.", cta: "Baixar Vídeo do Threads" },
  ar: { title: "دليل تنزيل فيديوهات ثريدز (Threads) — تحديث 2026", s1: "ثريدز هي منصة ميتا المتنامية. في عام 2026، يوفر ClipKeep طريقة سلسة لحفظ الفيديوهات وGIF من منشورات Threads.", s2: "اضغط على أيقونة المشاركة، اختر 'نسخ الرابط'، وألصقه في ClipKeep. سيقوم الموقع باستخراج ملف MP4 الأصلي.", s3: "يدعم جميع الملفات الشخصية العامة. لا يمكن الوصول للحسابات الخاصة أو المحتوى المحذوف.", cta: "جرب محمل ثريدز" },
  es: { title: "Descargador de videos de Threads — Guía 2026", s1: "Threads es la plataforma de Meta que crece rápido. En 2026, ClipKeep permite guardar videos y GIFs de Threads en alta calidad.", s2: "Pulsa el icono de compartir, elige 'Copiar enlace' y pégalo en ClipKeep. Extraerá el MP4 original automáticamente.", s3: "Funciona para perfiles públicos. No se puede acceder a perfiles privados o contenido eliminado.", cta: "Probar Threads" },
  fr: { title: "Téléchargeur Vidéo Threads — Guide 2026", s1: "Threads est la plateforme de Meta en pleine croissance. En 2026, ClipKeep permet de sauvegarder facilement les vidéos et GIFs de Threads.", s2: "Appuyez sur l'icône de partage, choisissez 'Copier le lien' et collez-le dans ClipKeep. Le fichier MP4 original sera extrait.", s3: "Fonctionne pour les profils publics. Les comptes privés ou contenus supprimés ne sont pas accessibles.", cta: "Essayer Threads" },
  id: { title: "Pengunduh Video Threads — Panduan 2026", s1: "Threads adalah platform Meta yang berkembang pesat. Di 2026, ClipKeep menyediakan cara mudah untuk menyimpan video dan GIF dari Threads.", s2: "Ketuk ikon bagikan, pilih 'Salin Tautan', dan tempel ke ClipKeep. Alat ini akan mengekstrak file MP4 asli.", s3: "Berlaku untuk semua profil publik. Profil privat atau konten yang dihapus tidak dapat diakses.", cta: "Coba Threads" },
  hi: { title: "Threads Video Downloader — 2026 गाइड", s1: "Threads Meta का तेजी से बढ़ता प्लेटफॉर्म है। 2026 में, ClipKeep Threads पोस्ट से वीडियो और GIF डाउनलोड करने का आसान तरीका देता है।", s2: "शेयर आइकन पर टैप करें, 'Copy Link' चुनें और ClipKeep में पेस्ट करें। MP4 फाइल अपने आप एक्सट्रैक्ट हो जाएगी।", s3: "सभी सार्वजनिक प्रोफाइल के लिए काम करता है। प्राइवेट प्रोफाइल या हटाए गए कंटेंट एक्सेस नहीं किए जा सकते।", cta: "Threads डाउनलोडर" },
  de: { title: "Threads Video Downloader — Guide 2026", s1: "Threads ist die wachsende Plattform von Meta. Im Jahr 2026 bietet ClipKeep eine einfache Möglichkeit, Videos und GIFs von Threads zu speichern.", s2: "Tippen Sie auf das Teilen-Symbol, wählen Sie 'Link kopieren' und fügen Sie ihn bei ClipKeep ein. Die MP4-Datei wird extrahiert.", s3: "Funktioniert für alle öffentlichen Profile. Private Konten oder gelöschte Inhalte sind nicht zugänglich.", cta: "Threads testen" },
  tr: { title: "Threads Video İndirici — 2026 Kılavuzu", s1: "Threads, Meta'nın hızla büyüyen platformudur. 2026'da ClipKeep, Threads gönderilerinden video ve GIF kaydetmek için kolay bir yol sunar.", s2: "Paylaş simgesine dokunun, 'Bağlantıyı Kopyala'yı seçin ve ClipKeep'e yapıştırın. Orijinal MP4 dosyası çıkarılacaktır.", s3: "Tüm halka açık profiller için çalışır. Gizli profiller veya silinen içerikler desteklenmez.", cta: "Threads'i dene" },
};

const pinterest2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Pinterest Video Downloader — 2026 Guide",
    s1: "Pinterest is a goldmine for creative videos and ideas. In 2026, ClipKeep helps you save high-quality MP4s from any public Pin URL.",
    s2: "Open the Pin, copy the URL from the browser or the 'Share' menu, and paste it into ClipKeep. We support both standard Pins and Video Pins.",
    s3: "Only public Pins can be downloaded. Secret boards or Pins restricted by the author's privacy settings are not supported.",
    cta: "Try Pinterest Downloader"
  },
  ja: {
    title: "Pinterest動画保存・ダウンロード 2026年最新ガイド",
    s1: "Pinterestはクリエイティブな動画やアイデアの宝庫。2026年もClipKeepを使えば、公開ピンのURLから高品質なMP4動画を保存できます。",
    s2: "保存方法：ピンを開いてURLをコピー（ブラウザまたは共有メニューから）し、ClipKeepに貼り付けるだけ。通常のピンと動画ピンの両方に対応。",
    s3: "公開ピンのみ対応。シークレットボード内のピンや、投稿者が制限しているコンテンツは取得できません。",
    cta: "Pinterest動画保存を試す"
  },
  pt: { title: "Baixar Vídeo do Pinterest — Guia 2026", s1: "Pinterest é uma mina de ouro de vídeos criativos. Em 2026, o ClipKeep ajuda você a salvar MP4s de qualquer Pin público.", s2: "Abra o Pin, copie a URL e cole no ClipKeep. Suportamos Pins de vídeo e Pins padrão.", s3: "Apenas Pins públicos. Pastas secretas ou Pins restritos não são suportados.", cta: "Baixar Vídeo do Pinterest" },
  ar: { title: "دليل تنزيل فيديوهات بينتيريست (Pinterest) — تحديث 2026", s1: "بينتيريست هو كنز للفيديوهات الإبداعية. في عام 2026، يساعدك ClipKeep في حفظ ملفات MP4 من أي رابط Pin عام.", s2: "افتح الـ Pin، انسخ الرابط وألصقه في ClipKeep. ندعم الـ Pins العادية وفيديوهات الـ Pins.", s3: "يدعم الـ Pins العامة فقط. لا يمكن الوصول للمجلدات السرية أو المحتوى الخاص.", cta: "جرب محمل Pinterest" },
  es: { title: "Descargador de videos de Pinterest — Guía 2026", s1: "Pinterest es una mina de ideas creativas. En 2026, ClipKeep te ayuda a guardar MP4s de cualquier Pin público.", s2: "Abre el Pin, copia la URL y pégala en ClipKeep. Soportamos Pins normales y de video.", s3: "Solo Pins públicos. No soporta tableros secretos o Pins privados.", cta: "Probar Pinterest" },
  fr: { title: "Téléchargeur Vidéo Pinterest — Guide 2026", s1: "Pinterest est une mine d'or d'idées créatives. En 2026, ClipKeep vous aide à sauvegarder les MP4 de n'importe quel Pin public.", s2: "Ouvrez le Pin, copiez l'URL et collez-la dans ClipKeep. Nous supportons les Pins standards et les épingles vidéo.", s3: "Pins publics uniquement. Ne supporte pas les tableaux secrets ou épingles privées.", cta: "Essayer Pinterest" },
  id: { title: "Pengunduh Video Pinterest — Panduan 2026", s1: "Pinterest adalah tambang emas video kreatif. Di 2026, ClipKeep membantu Anda menyimpan MP4 dari Pin publik apa pun.", s2: "Buka Pin, salin URL-nya, dan tempel ke ClipKeep. Kami mendukung Pin standar dan Pin video.", s3: "Hanya Pin publik. Papan rahasia atau Pin privat tidak didukung.", cta: "Coba Pinterest" },
  hi: { title: "Pinterest Video Downloader — 2026 गाइड", s1: "Pinterest क्रिएटिव वीडियो का खजाना है। 2026 में, ClipKeep आपको किसी भी सार्वजनिक Pin से MP4 सेव करने में मदद करता है।", s2: "Pin खोलें, URL कॉपी करें और ClipKeep में पेस्ट करें। हम स्टैंडर्ड और वीडियो Pin दोनों सपोर्ट करते हैं।", s3: "केवल सार्वजनिक Pin। गुप्त बोर्ड या प्राइवेट Pin सपोर्टेड नहीं हैं।", cta: "Pinterest डाउनलोडर" },
  de: { title: "Pinterest Video Downloader — Guide 2026", s1: "Pinterest ist eine Goldgrube für kreative Videos. Im Jahr 2026 hilft ClipKeep Ihnen, MP4s von jedem öffentlichen Pin zu speichern.", s2: "Pin öffnen, URL kopieren und bei ClipKeep einfügen. Wir unterstützen Standard-Pins und Video-Pins.", s3: "Nur öffentliche Pins. Keine geheimen Pinnwände oder privaten Pins.", cta: "Pinterest testen" },
  tr: { title: "Pinterest Video İndirici — 2026 Kılavuzu", s1: "Pinterest yaratıcı videolar için bir hazinedir. 2026'da ClipKeep, herhangi bir genel Pin bağlantısından MP4 kaydetmenize yardımcı olur.", s2: "Paylaş simgesine dokunun, 'Bağlantıyı Kopyala'yı seçin ve ClipKeep'e yapıştırın. Standart Pinleri ve Video Pinlerini destekliyoruz.", s3: "Yalnızca herkese açık Pinler. Gizli panolar veya özel Pinler desteklenmez.", cta: "Pinterest'i dene" },
};

const bluesky2026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "BlueSky Video Downloader — 2026 Guide",
    s1: "BlueSky has become a major hub for high-quality video content in 2026. ClipKeep supports downloading videos directly from BlueSky posts.",
    s2: "Copy the link to the BlueSky post, paste it into ClipKeep, and we'll extract the MP4 for you.",
    s3: "Currently supports public posts. Private or deleted content is not accessible.",
    cta: "Try BlueSky Downloader"
  },
  ja: {
    title: "BlueSky動画保存・ダウンロード 2026年最新ガイド",
    s1: "2026年、BlueSkyは高品質な動画コンテンツの主要な拠点となりました。ClipKeepはBlueSky投稿からの直接ダウンロードに対応しています。",
    s2: "保存方法：BlueSky投稿のリンクをコピーしてClipKeepに貼り付けるだけ。MP4ファイルを抽出します。",
    s3: "公開投稿のみ対応。非公開または削除されたコンテンツは取得できません。",
    cta: "BlueSky動画保存を試す"
  },
  pt: { title: "Baixar Vídeo do BlueSky — Guia 2026", s1: "O BlueSky se tornou um grande centro de conteúdo de vídeo em 2026. O ClipKeep suporta o download direto de posts do BlueSky.", s2: "Copie o link do post do BlueSky, cole no ClipKeep e extrairemos o MP4 para você.", s3: "Suporta posts públicos. Conteúdo privado ou excluído não é acessível.", cta: "Baixar Vídeo do BlueSky" },
  ar: { title: "دليل تنزيل فيديوهات بلو سكاي (BlueSky) — تحديث 2026", s1: "أصبح بلو سكاي مركزاً رئيسياً لمحتوى الفيديو في عام 2026. يدعم ClipKeep تنزيل الفيديوهات مباشرة من منشورات BlueSky.", s2: "انسخ رابط منشور BlueSky، وألصقه في ClipKeep، وسنقوم باستخراج ملف MP4 لك.", s3: "يدعم المنشورات العامة حالياً. لا يمكن الوصول للمحتوى الخاص أو المحذوف.", cta: "جرب محمل بلو سكاي" },
  es: { title: "Descargador de videos de BlueSky — Guía 2026", s1: "BlueSky es un centro de videos de alta calidad en 2026. ClipKeep permite descargar videos de BlueSky directamente.", s2: "Copia el enlace del post de BlueSky y pégalo en ClipKeep.", s3: "Solo posts públicos. No soporta contenido privado o eliminado.", cta: "Probar BlueSky" },
  fr: { title: "Téléchargeur Vidéo BlueSky — Guide 2026", s1: "BlueSky est devenu un centre majeur de vidéos en 2026. ClipKeep supporte le téléchargement direct depuis les posts BlueSky.", s2: "Copiez le lien du post BlueSky et collez-le dans ClipKeep.", s3: "Posts publics uniquement. Contenu privé ou supprimé inaccessible.", cta: "Essayer BlueSky" },
  id: { title: "Pengunduh Video BlueSky — Panduan 2026", s1: "BlueSky menjadi pusat video berkualitas di 2026. ClipKeep mendukung pengunduhan video langsung dari postingan BlueSky.", s2: "Salin tautan postingan BlueSky dan tempel ke ClipKeep.", s3: "Hanya postingan publik. Konten privat atau dihapus tidak dapat diakses.", cta: "Coba BlueSky" },
  hi: { title: "BlueSky Video Downloader — 2026 गाइड", s1: "BlueSky 2026 में वीडियो का प्रमुख केंद्र बन गया है। ClipKeep BlueSky पोस्ट से वीडियो डाउनलोड करने में मदद करता है।", s2: "BlueSky पोस्ट लिंक कॉपी करें और ClipKeep में पेस्ट करें।", s3: "केवल सार्वजनिक पोस्ट। प्राइवेट या हटाए गए कंटेंट एक्सेस नहीं किए जा सकते।", cta: "BlueSky डाउनलोडर" },
  de: { title: "BlueSky Video Downloader — Guide 2026", s1: "BlueSky ist 2026 ein wichtiges Video-Zentrum. ClipKeep unterstützt den direkten Download von BlueSky-Posts.", s2: "Kopieren Sie den Link zum BlueSky-Post und fügen Sie ihn bei ClipKeep ein.", s3: "Nur öffentliche Posts. Private oder gelöschte Inhalte sind nicht zugänglich.", cta: "BlueSky testen" },
  tr: { title: "BlueSky Video İndirici — 2026 Kılavuzu", s1: "BlueSky 2026'da önemli bir video merkezi haline geldi. ClipKeep, BlueSky gönderilerinden doğrudan indirmeyi destekler.", s2: "BlueSky gönderi bağlantısını kopyalayıp ClipKeep'e yapıştırın.", s3: "Yalnızca herkese açık gönderiler. Gizli veya silinen içerikler desteklenmez.", cta: "BlueSky'ı dene" },
};

const lemon82026GuideData: Record<Locale, { title: string; s1: string; s2: string; s3: string; cta: string }> = {
  en: {
    title: "Lemon8 Video Downloader — 2026 Guide",
    s1: "Lemon8 is the go-to platform for lifestyle and aesthetic videos. In 2026, ClipKeep remains the best tool to save these videos without quality loss.",
    s2: "Open the Lemon8 post, tap Share > Copy Link, and paste it into ClipKeep. We handle the extraction and provide the original video file.",
    s3: "Public posts only. Ensure the creator has not restricted sharing settings.",
    cta: "Try Lemon8 Downloader"
  },
  ja: {
    title: "Lemon8動画保存・ダウンロード 2026年最新ガイド",
    s1: "Lemon8はライフスタイルや美的センスの高い動画が集まるプラットフォームです。2026年もClipKeepは画質を落とさず保存できる最適なツールです。",
    s2: "保存方法：Lemon8投稿を開き、共有からリンクをコピーしてClipKeepに貼り付けるだけ。元ファイルを抽出します。",
    s3: "公開投稿のみ対応。投稿者が共有を制限している場合は保存できないことがあります。",
    cta: "Lemon8動画保存を試す"
  },
  pt: { title: "Baixar Vídeo do Lemon8 — Guia 2026", s1: "Lemon8 é a plataforma ideal para vídeos de lifestyle. Em 2026, o ClipKeep continua sendo a melhor ferramenta para salvar esses vídeos.", s2: "Abra o post do Lemon8, toque em Compartilhar > Copiar Link e cole no ClipKeep.", s3: "Apenas posts públicos. Verifique se o autor não restringiu as configurações de compartilhamento.", cta: "Baixar Vídeo do Lemon8" },
  ar: { title: "دليل تنزيل فيديوهات ليمون 8 (Lemon8) — تحديث 2026", s1: "ليمون 8 هو المنصة المفضلة لفيديوهات نمط الحياة. في عام 2026، يظل ClipKeep أفضل أداة لحفظ هذه الفيديوهات.", s2: "افتح منشور Lemon8، اضغط مشاركة > نسخ الرابط، وألصقه في ClipKeep.", s3: "للمنشورات العامة فقط. تأكد من أن صاحب المنشور لم يقم بتقييد إعدادات المشاركة.", cta: "جرب محمل ليمون 8" },
  es: { title: "Descargador de videos de Lemon8 — Guía 2026", s1: "Lemon8 es la plataforma para videos de estilo de vida. En 2026, ClipKeep sigue siendo la mejor herramienta para guardarlos.", s2: "Abre el post de Lemon8, pulsa Compartir > Copiar enlace y pégalo en ClipKeep.", s3: "Solo posts públicos. Asegúrate de que el autor no haya restringido el compartir.", cta: "Probar Lemon8" },
  fr: { title: "Téléchargeur Vidéo Lemon8 — Guide 2026", s1: "Lemon8 est la plateforme pour les vidéos lifestyle. En 2026, ClipKeep reste le meilleur outil pour les sauvegarder.", s2: "Ouvrez le post Lemon8, appuyez sur Partager > Copier le lien et collez-le dans ClipKeep.", s3: "Posts publics uniquement. Vérifiez que l'auteur n'a pas restreint le partage.", cta: "Essayer Lemon8" },
  id: { title: "Pengunduh Video Lemon8 — Panduan 2026", s1: "Lemon8 adalah platform video gaya hidup. Di 2026, ClipKeep tetap menjadi alat terbaik untuk menyimpannya.", s2: "Buka postingan Lemon8, ketuk Bagikan > Salin Tautan dan tempel ke ClipKeep.", s3: "Hanya postingan publik. Pastikan kreator tidak membatasi pengaturan berbagi.", cta: "Coba Lemon8" },
  hi: { title: "Lemon8 Video Downloader — 2026 गाइड", s1: "Lemon8 लाइफस्टाइल और एस्थेटिक वीडियो का प्लेटफॉर्म है। 2026 में, ClipKeep इन्हें सेव करने का सबसे अच्छा टूल है।", s2: "Lemon8 पोस्ट खोलें, शेयर > लिंक कॉपी करें और ClipKeep में पेस्ट करें।", s3: "केवल सार्वजनिक पोस्ट। सुनिश्चित करें कि क्रिएटर ने शेयरिंग सेटिंग सीमित नहीं की है।", cta: "Lemon8 डाउनलोडर" },
  de: { title: "Lemon8 Video Downloader — Guide 2026", s1: "Lemon8 ist die Plattform für Lifestyle-Videos. Im Jahr 2026 bleibt ClipKeep das beste Tool zum Speichern dieser Videos.", s2: "Lemon8-Post öffnen, auf Teilen > Link kopieren klicken und bei ClipKeep einfügen.", s3: "Nur öffentliche Posts. Stellen Sie sicher, dass der Autor das Teilen nicht eingeschränkt hat.", cta: "Lemon8 testen" },
  tr: { title: "Lemon8 Video İndirici — 2026 Kılavuzu", s1: "Lemon8, yaşam tarzı videoları için bir platformdur. 2026'da ClipKeep, bu videoları kaydetmek için en iyi araç olmaya devam ediyor.", s2: "Paylaş simgesine dokunun, 'Bağlantıyı Kopyala'yı seçin ve ClipKeep'e yapıştırın.", s3: "Yalnızca herkese açık gönderiler. Yazarın paylaşımı kısıtlamadığından emin olun.", cta: "Lemon8'i dene" },
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
  ...locales.map((locale) => ({
    slug: "twitter-video-download-2026",
    locale,
    title: twitter2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: twitter2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: twitter2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: twitter2026GuideData[locale].s3 },
    ],
    cta: { label: twitter2026GuideData[locale].cta, href: "/download-twitter-video" },
  })),
  ...locales.map((locale) => ({
    slug: "tiktok-download-2026",
    locale,
    title: tiktok2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: tiktok2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: tiktok2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: tiktok2026GuideData[locale].s3 },
    ],
    cta: { label: tiktok2026GuideData[locale].cta, href: "/download-tiktok-video" },
  })),
  ...locales.map((locale) => ({
    slug: "reddit-video-download-2026",
    locale,
    title: reddit2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: reddit2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: reddit2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: reddit2026GuideData[locale].s3 },
    ],
    cta: { label: reddit2026GuideData[locale].cta, href: "/download-reddit-video" },
  })),
  ...locales.map((locale) => ({
    slug: "facebook-video-download-2026",
    locale,
    title: facebook2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: facebook2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: facebook2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: facebook2026GuideData[locale].s3 },
    ],
    cta: { label: facebook2026GuideData[locale].cta, href: "/download-facebook-video" },
  })),
  ...locales.map((locale) => ({
    slug: "threads-video-download-2026",
    locale,
    title: threads2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: threads2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: threads2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: threads2026GuideData[locale].s3 },
    ],
    cta: { label: threads2026GuideData[locale].cta, href: "/download-threads-video" },
  })),
  ...locales.map((locale) => ({
    slug: "pinterest-video-download-2026",
    locale,
    title: pinterest2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: pinterest2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: pinterest2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: pinterest2026GuideData[locale].s3 },
    ],
    cta: { label: pinterest2026GuideData[locale].cta, href: "/download-pinterest-video" },
  })),
  ...locales.map((locale) => ({
    slug: "bluesky-video-download-2026",
    locale,
    title: bluesky2026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: bluesky2026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: bluesky2026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: bluesky2026GuideData[locale].s3 },
    ],
    cta: { label: bluesky2026GuideData[locale].cta, href: "/download-bluesky-video" },
  })),
  ...locales.map((locale) => ({
    slug: "lemon8-video-download-2026",
    locale,
    title: lemon82026GuideData[locale].title,
    sections: [
      { id: "s1", heading: locale === 'en' ? "Updated for 2026" : "2026 Guide", body: lemon82026GuideData[locale].s1 },
      { id: "s2", heading: locale === 'en' ? "How to use" : "Usage", body: lemon82026GuideData[locale].s2 },
      { id: "s3", heading: locale === 'en' ? "Limitations" : "Note", body: lemon82026GuideData[locale].s3 },
    ],
    cta: { label: lemon82026GuideData[locale].cta, href: "/download-lemon8-video" },
  })),
];

export const pages: SolutionPage[] = [
  ...enPages,
  ...locales.map((locale) => ({
    slug: "telegram-video-downloader-not-working",
    locale,
    title: telegramGuide[locale].title,
    sections: [
      { id: "s1", heading: locale === "ja" ? "公開URLを使う" : "Step 1", body: telegramGuide[locale].s1 },
      { id: "s2", heading: locale === "ja" ? "一時的なエラーへの対処" : "Step 2", body: telegramGuide[locale].s2 },
      ...(telegramGuide[locale].s3 ? [{ id: "s3", heading: locale === "ja" ? "画質と保存形式" : "Step 3", body: telegramGuide[locale].s3 as string }] : []),
    ],
    cta: { label: telegramGuide[locale].cta, href: "/download-telegram-video" },
  })),
  ...locales.map((locale) => ({
    slug: "twitter-video-downloader-not-working",
    locale,
    title: twitterGuide[locale].title,
    sections: [
      { id: "s1", heading: locale === "ja" ? "非公開・制限付き投稿について" : "Step 1", body: twitterGuide[locale].s1 },
      { id: "s2", heading: locale === "ja" ? "正しいURLの貼り付け方" : "Step 2", body: twitterGuide[locale].s2 },
      ...(twitterGuide[locale].s3 ? [{ id: "s3", heading: locale === "ja" ? "GIF・動画の画質と対応範囲" : "Step 3", body: twitterGuide[locale].s3 as string }] : []),
    ],
    cta: { label: twitterGuide[locale].cta, href: "/download-twitter-video" },
  })),
  ...locales.map((locale) => ({
    slug: "tiktok-video-downloader-not-working",
    locale,
    title: tiktokWorkingGuide[locale].title,
    sections: [
      { id: "s1", heading: "Step 1", body: tiktokWorkingGuide[locale].s1 },
      { id: "s2", heading: "Step 2", body: tiktokWorkingGuide[locale].s2 },
      { id: "s3", heading: "Step 3", body: tiktokWorkingGuide[locale].s3 },
    ],
    cta: { label: tiktokWorkingGuide[locale].cta, href: "/download-tiktok-video" },
  })),
  ...locales.map((locale) => ({
    slug: "how-to-download-without-watermark",
    locale,
    title: watermarkGuideData[locale].title,
    sections: [
      { id: "s1", heading: "TikTok", body: watermarkGuideData[locale].s1 },
      { id: "s2", heading: "Twitter/X", body: watermarkGuideData[locale].s2 },
    ],
    cta: { label: watermarkGuideData[locale].cta, href: "/" },
  })),
  ...locales.map((locale) => ({
    slug: "extractor-temporary-limited",
    locale,
    title: degradedGuide[locale].title,
    sections: [{ id: "s1", heading: "Status", body: degradedGuide[locale].s1 }],
    cta: { label: degradedGuide[locale].cta, href: "/status" },
  })),
  ...locales.map((locale) => ({
    slug: "how-to-save-on-iphone-android",
    locale,
    title: mobileGuideData[locale].title,
    sections: [
      { id: "s1", heading: "iPhone / iOS", body: mobileGuideData[locale].s1 },
      { id: "s2", heading: "Android", body: mobileGuideData[locale].s2 },
      { id: "s3", heading: mobileGuideData[locale].s3Heading, body: mobileGuideData[locale].s3 },
    ],
    cta: { label: mobileGuideData[locale].cta, href: "/" },
  })),
  ...locales.map((locale) => ({
    slug: "reddit-video-downloader-not-working",
    locale,
    title: redditGuide[locale].title,
    sections: [
      { id: "s1", heading: locale === "ja" ? "投稿URLの形式を確認" : "Step 1", body: redditGuide[locale].s1 },
      { id: "s2", heading: locale === "ja" ? "音声と映像の自動合成" : "Step 2", body: redditGuide[locale].s2 },
      ...(redditGuide[locale].s3 ? [{ id: "s3", heading: locale === "ja" ? "保存できない投稿の種類" : "Step 3", body: redditGuide[locale].s3 as string }] : []),
    ],
    cta: { label: redditGuide[locale].cta, href: "/download-reddit-video" },
  })),
  ...locales.map((locale) => ({
    slug: "best-quality-download-settings",
    locale,
    title: qualityGuide[locale].title,
    sections: [
      { id: "s1", heading: "High Quality", body: qualityGuide[locale].s1 },
      { id: "s2", heading: "Limitations", body: qualityGuide[locale].s2 },
    ],
    cta: { label: qualityGuide[locale].cta, href: "/" },
  })),
];

export function findSolutionPage(slug: string, locale: Locale): SolutionPage | undefined {
  return pages.find((p) => p.slug === slug && p.locale === locale)
    ?? pages.find((p) => p.slug === slug && p.locale === "en");
}
