import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogCtaLink } from '@/components/blog-cta-link';
import { notFound } from 'next/navigation';
import { getKeywordArticle, getRelatedKeywordArticles, keywordArticles, type BlogLocale } from '@/lib/blog/keyword-articles';
import { normalizeLocale } from '@/lib/i18n/ui';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function toBlogLocale(input: string | null | undefined): BlogLocale {
  const n = normalizeLocale(input);
  if (n === 'es' || n === 'ar' || n === 'ja' || n === 'pt' || n === 'fr' || n === 'de' || n === 'tr' || n === 'id' || n === 'hi') return n;
  return 'en';
}

function text(locale: BlogLocale) {
  if (locale === 'ar') {
    return {
      quickAnswer: 'الإجابة السريعة',
      steps: 'الخطوات',
      safety: 'السلامة والقانون',
      fails: 'أخطاء شائعة',
      ctaMain: 'ابدأ باستخدام ClipKeep الآن',
      ctaSupport: 'دليل الحلول',
      related: 'مواضيع مرتبطة',
      jumpTool: 'فتح أداة التنزيل',
      jumpSupport: 'فتح دليل الحلول',
      compareHint: 'للمقارنة بين الخيارات، راجع أيضًا صفحة الأسئلة الشائعة.',
      twitterDl: 'أداة تنزيل تويتر',
      tiktokDl: 'أداة تنزيل تيك توك',
      telegramDl: 'أداة تنزيل تيليجرام',
      guideLabel: 'دليل أرشفة الوسائط',
      faqLabel: 'الأسئلة الشائعة',
    };
  }
  if (locale === 'ja') {
    return {
      quickAnswer: '要点',
      steps: '手順',
      safety: '安全性と法的な注意点',
      fails: 'よくある失敗',
      ctaMain: '今すぐ ClipKeep を使う',
      ctaSupport: '解決ガイド',
      related: '関連記事',
      jumpTool: 'ダウンローダーを開く',
      jumpSupport: '解決ガイドを開く',
      compareHint: '候補を並べて比べる場合は、FAQ もあわせて確認してください。',
      twitterDl: 'Twitter ダウンローダー',
      tiktokDl: 'TikTok ダウンローダー',
      telegramDl: 'Telegram ダウンローダー',
      guideLabel: 'メディア保存ガイド',
      faqLabel: 'FAQ',
    };
  }
  if (locale === 'es') {
    return {
      quickAnswer: 'Respuesta rápida',
      steps: 'Pasos',
      safety: 'Seguridad y legalidad',
      fails: 'Errores frecuentes',
      ctaMain: 'Empieza con ClipKeep ahora',
      ctaSupport: 'Guía de solución',
      related: 'Lecturas relacionadas',
      jumpTool: 'Ir al descargador',
      jumpSupport: 'Abrir la guía de solución',
      compareHint: 'Para comparar opciones lado a lado, revisa también el FAQ.',
      twitterDl: 'Descargador de Twitter',
      tiktokDl: 'Descargador de TikTok',
      telegramDl: 'Descargador de Telegram',
      guideLabel: 'Guía de archivado de medios',
      faqLabel: 'Preguntas frecuentes',
    };
  }
  if (locale === 'pt') {
    return {
      quickAnswer: 'Resposta rápida',
      steps: 'Passo a passo',
      safety: 'Segurança e observações legais',
      fails: 'Falhas comuns',
      ctaMain: 'Comece a usar o ClipKeep agora',
      ctaSupport: 'Guia de solução',
      related: 'Leituras relacionadas',
      jumpTool: 'Abrir o downloader',
      jumpSupport: 'Abrir o guia de solução',
      compareHint: 'Para comparar opções lado a lado, vale a pena consultar também o FAQ.',
      twitterDl: 'Downloader do Twitter',
      tiktokDl: 'Downloader do TikTok',
      telegramDl: 'Downloader do Telegram',
      guideLabel: 'Guia de arquivamento de mídia',
      faqLabel: 'Perguntas frequentes',
    };
  }
  if (locale === 'fr') {
    return {
      quickAnswer: 'Réponse rapide',
      steps: 'Étapes',
      safety: 'Sécurité et remarques légales',
      fails: 'Échecs fréquents',
      ctaMain: 'Commencer avec ClipKeep',
      ctaSupport: 'Guide de résolution',
      related: 'Lectures liées',
      jumpTool: 'Ouvrir le téléchargeur',
      jumpSupport: 'Ouvrir le guide de résolution',
      compareHint: 'Pour comparer les options côte à côte, consultez aussi la FAQ.',
      twitterDl: 'Téléchargeur Twitter',
      tiktokDl: 'Téléchargeur TikTok',
      telegramDl: 'Téléchargeur Telegram',
      guideLabel: 'Guide d’archivage des médias',
      faqLabel: 'FAQ',
    };
  }
  if (locale === 'de') {
    return {
      quickAnswer: 'Kurzantwort',
      steps: 'Schritte',
      safety: 'Sicherheit und rechtliche Hinweise',
      fails: 'Häufige Fehler',
      ctaMain: 'ClipKeep jetzt nutzen',
      ctaSupport: 'Lösungsleitfaden',
      related: 'Verwandte Artikel',
      jumpTool: 'Downloader öffnen',
      jumpSupport: 'Lösungsleitfaden öffnen',
      compareHint: 'Für einen direkten Vergleich lohnt sich auch ein Blick in die FAQ.',
      twitterDl: 'Twitter-Downloader',
      tiktokDl: 'TikTok-Downloader',
      telegramDl: 'Telegram-Downloader',
      guideLabel: 'Leitfaden zur Medienarchivierung',
      faqLabel: 'FAQ',
    };
  }
  if (locale === 'tr') {
    return {
      quickAnswer: 'Kısa cevap',
      steps: 'Adımlar',
      safety: 'Güvenlik ve yasal notlar',
      fails: 'Yaygın hatalar',
      ctaMain: 'ClipKeep’i şimdi kullan',
      ctaSupport: 'Çözüm rehberi',
      related: 'İlgili yazılar',
      jumpTool: 'İndiriciyi aç',
      jumpSupport: 'Çözüm rehberini aç',
      compareHint: 'Seçenekleri yan yana karşılaştırmak için SSS sayfasına da bakın.',
      twitterDl: 'Twitter indirici',
      tiktokDl: 'TikTok indirici',
      telegramDl: 'Telegram indirici',
      guideLabel: 'Medya arşivleme rehberi',
      faqLabel: 'SSS',
    };
  }
  if (locale === 'id') {
    return {
      quickAnswer: 'Jawaban singkat',
      steps: 'Langkah-langkah',
      safety: 'Catatan keamanan dan hukum',
      fails: 'Masalah yang sering terjadi',
      ctaMain: 'Gunakan ClipKeep sekarang',
      ctaSupport: 'Panduan solusi',
      related: 'Bacaan terkait',
      jumpTool: 'Buka downloader',
      jumpSupport: 'Buka panduan solusi',
      compareHint: 'Untuk membandingkan pilihan secara berdampingan, lihat juga halaman FAQ.',
      twitterDl: 'Downloader Twitter',
      tiktokDl: 'Downloader TikTok',
      telegramDl: 'Downloader Telegram',
      guideLabel: 'Panduan arsip media',
      faqLabel: 'FAQ',
    };
  }
  if (locale === 'hi') {
    return {
      quickAnswer: 'संक्षिप्त उत्तर',
      steps: 'स्टेप्स',
      safety: 'सुरक्षा और कानूनी नोट्स',
      fails: 'आम समस्याएँ',
      ctaMain: 'अब ClipKeep इस्तेमाल करें',
      ctaSupport: 'समाधान गाइड',
      related: 'संबंधित लेख',
      jumpTool: 'डाउनलोडर खोलें',
      jumpSupport: 'समाधान गाइड खोलें',
      compareHint: 'विकल्पों की तुलना करने के लिए FAQ पेज भी देखें।',
      twitterDl: 'Twitter डाउनलोडर',
      tiktokDl: 'TikTok डाउनलोडर',
      telegramDl: 'Telegram डाउनलोडर',
      guideLabel: 'मीडिया आर्काइविंग गाइड',
      faqLabel: 'FAQ',
    };
  }
  return {
    quickAnswer: 'Quick answer',
    steps: 'Steps',
    safety: 'Safety and legal notes',
    fails: 'Common failures',
    ctaMain: 'Use ClipKeep now',
    ctaSupport: 'Help page',
    related: 'Related reads',
    jumpTool: 'Open downloader',
    jumpSupport: 'Open solution guide',
    compareHint: 'For side-by-side options, also check the FAQ.',
    twitterDl: 'Twitter downloader',
    tiktokDl: 'TikTok downloader',
    telegramDl: 'Telegram downloader',
    guideLabel: 'Media archiving guide',
    faqLabel: 'FAQ',
  };
}

function buildIntro(keyword: string, locale: BlogLocale): string {
  if (locale === 'ar') return `يركّز هذا الدليل على عبارة البحث: ${keyword}، ويشرح أسرع طريقة عملية لاستخدام ClipKeep مع روابط مباشرة للأداة.`;
  if (locale === 'ja') return `このガイドでは、「${keyword}」を調べている人向けに、ClipKeep で試す最短ルートを整理しています。`;
  if (locale === 'es') return `Esta guía está enfocada en la búsqueda "${keyword}" y explica el flujo más directo con ClipKeep, con acceso inmediato al descargador.`;
  if (locale === 'pt') return `Este guia foi criado para quem procura "${keyword}" e mostra a forma mais direta de usar o ClipKeep, com acesso imediato à ferramenta certa.`;
  if (locale === 'fr') return `Ce guide a été conçu pour les personnes qui recherchent "${keyword}" et présente la façon la plus directe d’utiliser ClipKeep, avec un accès immédiat au bon outil.`;
  if (locale === 'de') return `Dieser Leitfaden richtet sich an Personen, die nach "${keyword}" suchen, und zeigt den direktesten Weg, ClipKeep mit dem passenden Tool zu nutzen.`;
  if (locale === 'tr') return `Bu rehber, "${keyword}" arayan kullanıcılar için hazırlandı ve ClipKeep ile en kısa ve pratik akışı gösterir.`;
  if (locale === 'id') return `Panduan ini ditujukan bagi pengguna yang mencari "${keyword}" dan menjelaskan alur paling praktis untuk memakai ClipKeep.`;
  if (locale === 'hi') return `यह गाइड उन उपयोगकर्ताओं के लिए है जो "${keyword}" खोज रहे हैं, और ClipKeep इस्तेमाल करने का सबसे व्यावहारिक तरीका समझाती है।`;
  return `This guide targets the keyword "${keyword}" and explains the fastest practical workflow with ClipKeep, including direct downloader links.`;
}

function stepLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['افتح المنشور الأصلي وانسخ الرابط.', 'انتقل إلى أداة ClipKeep المناسبة للمنصة.', 'الصق الرابط وابدأ الاستخراج.', 'احفظ الملف وتحقق من الجودة النهائية.'];
  if (locale === 'ja') return ['元の投稿を開いて URL をコピーします。', '利用するプラットフォームに合った ClipKeep のツールを開きます。', 'URL を貼り付けて抽出を開始します。', '保存したファイルの画質と音声を確認します。'];
  if (locale === 'es') return ['Abre la públicación original y copia el enlace.', 'Entra en la herramienta de ClipKeep correspondiente a la plataforma.', 'Pega el enlace y ejecuta la extracción.', 'Guarda el archivo y verifica la calidad final.'];
  if (locale === 'pt') return ['Abra a publicação original e copie o link.', 'Abra a ferramenta do ClipKeep correspondente à plataforma.', 'Cole o link e inicie a extração.', 'Salve o arquivo e confira a qualidade final.'];
  if (locale === 'fr') return ['Ouvrez la publication d’origine et copiez le lien.', 'Ouvrez l’outil ClipKeep correspondant à la plateforme.', 'Collez le lien et lancez l’extraction.', 'Enregistrez le fichier et vérifiez la qualité finale.'];
  if (locale === 'de') return ['Öffnen Sie den Originalbeitrag und kopieren Sie den Link.', 'Öffnen Sie das passende ClipKeep-Tool für die Plattform.', 'Fügen Sie den Link ein und starten Sie die Extraktion.', 'Speichern Sie die Datei und prüfen Sie die finale Qualität.'];
  if (locale === 'tr') return ['Orijinal gönderiyi açıp bağlantıyı kopyalayın.', 'Platforma uygun ClipKeep aracını açın.', 'Bağlantıyı yapıştırıp çıkarma işlemini başlatın.', 'Dosyayı kaydedip son kaliteyi kontrol edin.'];
  if (locale === 'id') return ['Buka postingan asli lalu salin tautannya.', 'Buka alat ClipKeep yang sesuai dengan platform yang digunakan.', 'Tempel tautan lalu mulai ekstraksi.', 'Simpan file lalu periksa kualitas akhirnya.'];
  if (locale === 'hi') return ['मूल पोस्ट खोलें और उसका लिंक कॉपी करें।', 'प्लेटफ़ॉर्म के मुताबिक सही ClipKeep टूल खोलें।', 'लिंक पेस्ट करें और एक्सट्रैक्शन शुरू करें।', 'फ़ाइल सेव करें और अंतिम गुणवत्ता जाँचें।'];
  return ['Open the source post and copy the URL.', 'Open the matching ClipKeep tool page.', 'Paste URL and run extraction.', 'Save the file and verify quality.'];
}

function failLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['الرابط غير صالح أو غير متاح للعامة.', 'يوجد قيد مؤقت من المنصة.', 'هناك مشكلة في الاتصال أو المتصفح.'];
  if (locale === 'ja') return ['URL が無効か、投稿が公開されていません。', 'プラットフォーム側で一時的な制限がかかっている可能性があります。', '通信環境またはブラウザ側で問題が起きている可能性があります。'];
  if (locale === 'es') return ['La URL no es válida o no es pública.', 'La plataforma tiene una restricción temporal.', 'Hay un problema de red o del navegador.'];
  if (locale === 'pt') return ['A URL é inválida ou não está pública.', 'A plataforma está com uma restrição temporária.', 'Existe um problema de rede ou do navegador.'];
  if (locale === 'fr') return ['L’URL est invalide ou la publication n’est pas publique.', 'La plateforme connaît une restriction temporaire.', 'Un problème de réseau ou de navigateur est survenu.'];
  if (locale === 'de') return ['Die URL ist ungültig oder der Beitrag ist nicht öffentlich.', 'Die Plattform hat derzeit eine vorübergehende Einschränkung.', 'Es ist ein Netzwerk- oder Browserproblem aufgetreten.'];
  if (locale === 'tr') return ['URL geçersiz ya da gönderi herkese açık değil.', 'Platformda geçici bir kısıtlama var.', 'Ağ ya da tarayıcı kaynaklı bir sorun oluştu.'];
  if (locale === 'id') return ['URL tidak valid atau postingannya tidak publik.', 'Platform sedang mengalami pembatasan sementara.', 'Terjadi masalah pada jaringan atau browser.'];
  if (locale === 'hi') return ['URL अमान्य है या पोस्ट पब्लिक नहीं है।', 'प्लेटफ़ॉर्म पर अस्थायी प्रतिबंध है।', 'नेटवर्क या ब्राउज़र से जुड़ी समस्या हुई है।'];
  return ['Invalid or private URL.', 'Temporary platform restriction.', 'Browser or network issue.'];
}

function telegramSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'telegram-vídeo-download': ['Post link is from a private chat.', 'The media is restricted in the channel.', 'Telegram CDN request timed out.'],
    'telegram-vídeo-downloader-online': ['Copied the share text instead of the URL.', 'Link preview is blocked by app settings.', 'Browser extension conflicts with request headers.'],
    'telegram-vídeo-save-method-ja': ['Used message forward link instead of source link.', 'Original post was edited and media changed.', 'Regional edge node returned stale metadata.'],
    'telegram-vídeo-download-pc-ja': ['Desktop app copied an internal deep-link.', 'Corporate network blocks Telegram media domains.', 'Download was interrupted by antivirus proxy scan.'],
    'telegram-vídeo-download-iphone': ['iOS copied a short redirect URL only.', 'In-app browser removed required query params.', 'Background refresh suspended the request.'],
    'telegram-vídeo-download-android': ['Android WebView stripped the referrer.', 'Battery saver paused extraction in background.', 'Share intent delivered malformed URL encoding.'],
    'telegram-private-vídeo-download': ['Target media is not publicly accessible.', 'Channel requires membership approval.', 'Private post permission expired.'],
    'telegram-vídeo-download-link': ['Link points to a message without media.', 'Copied thread root URL, not media post URL.', 'URL contains unsupported tracking fragment.'],
    'telegram-save-visible-ja': ['Users confuse download logs with notifications.', 'Public channel admin can see view counts only.', 'Shared files can expose username in app UI.'],
    'telegram-vídeo-download-bot-safe': ['Bot asks for excessive permissions.', 'Unverified bot endpoint has no policy page.', 'Bot forwards media through unknown third-party storage.'],
  };

  const ja: Record<string, string[]> = {
    'telegram-vídeo-download': ['投稿リンクが非公開チャット由来でした。', 'チャンネル内でそのメディアに制限がかかっています。', 'Telegram CDN への取得がタイムアウトしました。'],
    'telegram-vídeo-downloader-online': ['URL ではなく共有文面をコピーしていました。', 'アプリ設定でリンクプレビューが無効になっています。', 'ブラウザ拡張がリクエストヘッダーと競合しています。'],
    'telegram-vídeo-save-method-ja': ['元リンクではなく転送メッセージのリンクを使っていました。', '元の投稿が編集されてメディアが差し替わりました。', '地域側のエッジが古いメタデータを返しました。'],
    'telegram-vídeo-download-pc-ja': ['デスクトップアプリが内部 deep-link をコピーしていました。', '社内ネットワークが Telegram のメディアドメインをブロックしています。', 'アンチウイルスのプロキシ検査でダウンロードが止まりました。'],
    'telegram-vídeo-download-iphone': ['iOS 側で短いリダイレクト URL だけがコピーされました。', 'アプリ内ブラウザが必要な query parameter を削除しています。', 'バックグラウンド更新でリクエストが停止しました。'],
    'telegram-vídeo-download-android': ['Android WebView が referrer を落としました。', '省電力設定でバックグラウンド抽出が一時停止しました。', '共有 intent が壊れた URL エンコードを渡しています。'],
    'telegram-private-vídeo-download': ['対象メディアは公開状態ではありません。', 'チャンネル参加に承認が必要です。', '非公開投稿への権限が期限切れになりました。'],
    'telegram-vídeo-download-link': ['リンク先がメディアなしのメッセージでした。', 'メディア付き投稿の URL ではなくスレッドの先頭 URL をコピーしていました。', 'URL に未対応のトラッキング断片が含まれています。'],
    'telegram-save-visible-ja': ['ダウンロード履歴と通知を混同しています。', '公開チャンネルの管理者が見えるのは view 数だけです。', '共有ファイルによってアプリ内でユーザー名が見えることがあります。'],
    'telegram-vídeo-download-bot-safe': ['ボットが過剰な権限を求めています。', '未検証のボットでポリシーページがありません。', 'ボットが不明な外部ストレージ経由でメディアを中継しています。'],
  };

  const es: Record<string, string[]> = {
    'telegram-vídeo-download': ['El enlace viene de un chat privado.', 'El canal restringe ese archivo.', 'La solicitud al CDN de Telegram expiró.'],
    'telegram-vídeo-downloader-online': ['Se copió texto del mensaje y no la URL.', 'La vista previa del enlace está bloqueada.', 'Una extensión del navegador altera cabeceras.'],
    'telegram-vídeo-save-method-ja': ['Se usó enlace reenviado en vez del original.', 'La públicación fue editada y cambió el archivo.', 'El nodo regional devolvió metadatos antiguos.'],
    'telegram-vídeo-download-pc-ja': ['La app de escritorio copió un deep-link interno.', 'La red corporativa bloquea dominios de medios.', 'El antivirus interrumpió la descarga.'],
    'telegram-vídeo-download-iphone': ['iOS copió solo un enlace corto de redirección.', 'El navegador interno quitó parámetros clave.', 'La app pausó la solicitud en segundo plano.'],
    'telegram-vídeo-download-android': ['WebView de Android eliminó el referrer.', 'Ahorro de batería pausó la extracción.', 'El intent de compartir dañó la codificación URL.'],
    'telegram-private-vídeo-download': ['El archivo no es público.', 'El canal requiere aprobación de ingreso.', 'El permiso del post privado expiró.'],
    'telegram-vídeo-download-link': ['El enlace apunta a un mensaje sin vídeo.', 'Se copió la raíz del hilo y no el post.', 'La URL trae fragmentos de tracking no compatibles.'],
    'telegram-save-visible-ja': ['Se confunden registros internos con notificaciones.', 'El admin solo ve métricas públicas de vistas.', 'Archivos compartidos pueden mostrar usuario en la app.'],
    'telegram-vídeo-download-bot-safe': ['El bot solicita permisos excesivos.', 'El bot no verificado no tiene política pública.', 'El bot reenvía archivos a almacenamiento desconocido.'],
  };

  const fr: Record<string, string[]> = {
    'telegram-vídeo-download': ['Le lien de la publication provient d’un chat privé.', 'Le média est restreint à l’intérieur du canal.', 'La requête vers le CDN de Telegram a expiré.'],
    'telegram-vídeo-downloader-online': ['Le texte de partage a été copié au lieu de l’URL.', 'L’aperçu du lien est bloqué dans les réglages de l’application.', 'Une extension du navigateur est entrée en conflit avec les en-têtes de la requête.'],
    'telegram-vídeo-save-method-ja': ['Un lien de transfert a été utilisé à la place du lien d’origine.', 'La publication d’origine a été modifiée et le média a changé.', 'Le nœud régional a renvoyé des métadonnées obsolètes.'],
    'telegram-vídeo-download-pc-ja': ['L’application de bureau a copié un deep-link interne.', 'Le réseau d’entreprise bloque les domaines média de Telegram.', 'Le téléchargement a été interrompu par une analyse antivirus via proxy.'],
    'telegram-vídeo-download-iphone': ['L’iPhone a copié uniquement un lien court de redirection.', 'Le navigateur intégré a supprimé des paramètres nécessaires.', 'La mise à jour en arrière-plan a suspendu la requête.'],
    'telegram-vídeo-download-android': ['Le WebView Android a supprimé le referrer.', 'Le mode économie a mis l’extraction en pause en arrière-plan.', 'Le partage a fourni une URL avec un encodage incorrect.'],
    'telegram-private-vídeo-download': ['Le média visé n’est pas accessible publiquement.', 'Le canal exige une approbation pour y entrer.', 'L’autorisation de la publication privée a expiré.'],
    'telegram-vídeo-download-link': ['Le lien pointe vers un message sans média.', 'La racine du fil a été copiée au lieu de l’URL de la publication contenant le média.', 'L’URL contient un fragment de suivi non pris en charge.'],
    'telegram-save-visible-ja': ['Beaucoup de personnes confondent les journaux internes avec des notifications.', 'L’administrateur du canal public ne voit que les compteurs de vues.', 'Les fichiers partagés peuvent exposer le nom d’utilisateur dans l’interface de l’application.'],
    'telegram-vídeo-download-bot-safe': ['Le bot demande des autorisations excessives.', 'Le service du bot non vérifié ne propose pas de page de politique.', 'Le bot relaie le média via un stockage externe inconnu.'],
  };
  const de: Record<string, string[]> = {
    'telegram-vídeo-download': ['Der Beitragslink stammt aus einem privaten Chat.', 'Das Medium ist innerhalb des Kanals eingeschränkt.', 'Die Anfrage an das Telegram-CDN ist abgelaufen.'],
    'telegram-vídeo-downloader-online': ['Es wurde der Freigabetext statt der URL kopiert.', 'Die Linkvorschau ist in den App-Einstellungen blockiert.', 'Eine Browser-Erweiterung hat die Anfrage-Header gestört.'],
    'telegram-vídeo-save-method-ja': ['Es wurde ein Weiterleitungslink statt des Original-Links verwendet.', 'Der Originalbeitrag wurde bearbeitet und das Medium hat sich geändert.', 'Der regionale Knoten hat veraltete Metadaten zurückgegeben.'],
    'telegram-vídeo-download-pc-ja': ['Die Desktop-App hat einen internen Deep-Link kopiert.', 'Das Unternehmensnetz blockiert Telegram-Media-Domains.', 'Der Download wurde durch einen Antivirus-Scan über einen Proxy unterbrochen.'],
    'telegram-vídeo-download-iphone': ['Das iPhone hat nur einen kurzen Weiterleitungslink kopiert.', 'Der In-App-Browser hat notwendige Parameter entfernt.', 'Die Hintergrundaktualisierung hat die Anfrage unterbrochen.'],
    'telegram-vídeo-download-android': ['Die Android-WebView hat den Referrer entfernt.', 'Der Energiesparmodus hat die Extraktion im Hintergrund pausiert.', 'Die Freigabe hat eine URL mit fehlerhafter Kodierung geliefert.'],
    'telegram-private-vídeo-download': ['Das Zielmedium ist nicht öffentlich zugänglich.', 'Der Kanal erfordert eine Freigabe für den Beitritt.', 'Die Berechtigung für den privaten Beitrag ist abgelaufen.'],
    'telegram-vídeo-download-link': ['Der Link verweist auf eine Nachricht ohne Medium.', 'Es wurde der Thread-Anfang statt der URL des Beitrags mit Medium kopiert.', 'Die URL enthält ein nicht unterstütztes Tracking-Fragment.'],
    'telegram-save-visible-ja': ['Viele verwechseln interne Protokolle mit Benachrichtigungen.', 'Der Administrator eines öffentlichen Kanals sieht nur die Aufrufzahlen.', 'Geteilte Dateien können den Benutzernamen in der App-Oberfläche sichtbar machen.'],
    'telegram-vídeo-download-bot-safe': ['Der Bot fordert zu weitgehende Berechtigungen an.', 'Der nicht verifizierte Bot-Dienst bietet keine Richtlinienseite an.', 'Der Bot leitet das Medium über einen unbekannten externen Speicher weiter.'],
  };




  const tr: Record<string, string[]> = {
    'telegram-vídeo-download': ['Gönderi bağlantısı özel bir sohbetten alınmış.', 'Medya kanal içinde kısıtlanmış olabilir.', 'Telegram CDN isteği zaman aşımına uğradı.'],
    'telegram-vídeo-downloader-online': ['URL yerine paylaşım metni kopyalandı.', 'Bağlantı önizlemesi uygulama ayarları tarafından engelleniyor.', 'Bir tarayıcı eklentisi istek başlıklarıyla çakıştı.'],
    'telegram-vídeo-save-method-ja': ['Kaynak bağlantı yerine yönlendirilmiş mesaj bağlantısı kullanıldı.', 'Orijinal gönderi düzenlendi ve medya değişti.', 'Bölgesel uç düğüm eski meta veriler döndürdü.'],
    'telegram-vídeo-download-pc-ja': ['Masaüstü uygulaması dahili bir derin bağlantı kopyaladı.', 'Kurumsal ağ Telegram medya alanlarını engelliyor.', 'İndirme antivirüs proxy taraması yüzünden kesildi.'],
    'telegram-vídeo-download-iphone': ['iOS yalnızca kısa yönlendirme bağlantısını kopyaladı.', 'Uygulama içi tarayıcı gerekli sorgu parametrelerini kaldırdı.', 'Arka plan yenilemesi isteği askıya aldı.'],
    'telegram-vídeo-download-android': ['Android WebView yönlendiren kaynağı kaldırdı.', 'Pil tasarrufu arka plandaki çıkarma işlemini duraklattı.', 'Paylaşım intenti bozuk URL kodlaması üretti.'],
    'telegram-private-vídeo-download': ['Hedef medya herkese açık değil.', 'Kanal katılım onayı gerektiriyor.', 'Özel gönderi izni süresi doldu.'],
    'telegram-vídeo-download-link': ['Bağlantı medyasız bir mesaja gidiyor.', 'Medya gönderisinin URL’si yerine dizinin kök bağlantısı kopyalandı.', 'URL desteklenmeyen bir takip parçası içeriyor.'],
    'telegram-save-visible-ja': ['Kullanıcılar indirme kayıtlarıyla bildirimleri karıştırıyor.', 'Herkese açık kanal yöneticisi yalnızca görüntülenme sayılarını görebilir.', 'Paylaşılan dosyalar uygulama arayüzünde kullanıcı adını görünür kılabilir.'],
    'telegram-vídeo-download-bot-safe': ['Bot aşırı izinler istiyor.', 'Doğrulanmamış bot uç noktasının bir politika sayfası yok.', 'Bot medyayı bilinmeyen bir üçüncü taraf depolama üzerinden iletiyor.'],
  };

  const id: Record<string, string[]> = {
    'telegram-vídeo-download': ['Tautan postingan berasal dari chat privat.', 'Media dibatasi di dalam kanal tersebut.', 'Permintaan ke CDN Telegram mengalami timeout.'],
    'telegram-vídeo-downloader-online': ['Yang disalin adalah teks bagikan, bukan URL.', 'Pratinjau tautan diblokir oleh pengaturan aplikasi.', 'Ekstensi browser bentrok dengan header permintaan.'],
    'telegram-vídeo-save-method-ja': ['Yang digunakan adalah tautan forward pesan, bukan tautan sumber.', 'Postingan asli telah diedit dan medianya berubah.', 'Node edge regional mengembalikan metadata yang sudah usang.'],
    'telegram-vídeo-download-pc-ja': ['Aplikasi desktop menyalin deep-link internal.', 'Jaringan kantor memblokir domain media Telegram.', 'Unduhan terganggu oleh pemindaian antivirus melalui proxy.'],
    'telegram-vídeo-download-iphone': ['iOS hanya menyalin URL pengalihan pendek.', 'Browser di dalam aplikasi menghapus query parameter penting.', 'Penyegaran latar belakang menangguhkan permintaan.'],
    'telegram-vídeo-download-android': ['WebView Android menghapus referrer.', 'Mode hemat baterai menjeda ekstraksi di latar belakang.', 'Intent berbagi menghasilkan encoding URL yang rusak.'],
    'telegram-private-vídeo-download': ['Media target tidak bisa diakses secara publik.', 'Kanal membutuhkan persetujuan keanggotaan.', 'Izin postingan privat sudah kedaluwarsa.'],
    'telegram-vídeo-download-link': ['Tautan mengarah ke pesan tanpa media.', 'Yang disalin adalah URL akar thread, bukan URL postingan medianya.', 'URL mengandung fragmen pelacakan yang tidak didukung.'],
    'telegram-save-visible-ja': ['Pengguna sering mencampuradukkan log unduhan dengan notifikasi.', 'Admin kanal publik hanya bisa melihat jumlah tayangan.', 'File yang dibagikan dapat mengekspos username di antarmuka aplikasi.'],
    'telegram-vídeo-download-bot-safe': ['Bot meminta izin yang berlebihan.', 'Endpoint bot yang belum terverifikasi tidak memiliki halaman kebijakan.', 'Bot meneruskan media melalui penyimpanan pihak ketiga yang tidak dikenal.'],
  };

  const hi: Record<string, string[]> = {
    'telegram-vídeo-download': ['पोस्ट का लिंक किसी private chat से आया है।', 'Media चैनल के भीतर restricted है।', 'Telegram CDN request timeout हो गई।'],
    'telegram-vídeo-downloader-online': ['URL की जगह share text कॉपी हो गया।', 'App settings की वजह से link preview block है।', 'Browser extension request headers से टकरा रही है।'],
    'telegram-vídeo-save-method-ja': ['Source link की जगह forwarded message link इस्तेमाल हुई।', 'Original post edit हुई और media बदल गया।', 'Regional edge node ने stale metadata लौटाया।'],
    'telegram-vídeo-download-pc-ja': ['Desktop app ने internal deep-link कॉपी किया।', 'Corporate network Telegram media domains block कर रहा है।', 'Antivirus proxy scan ने download रोक दिया।'],
    'telegram-vídeo-download-iphone': ['iOS ने सिर्फ short redirect URL कॉपी की।', 'In-app browser ने ज़रूरी query params हटा दिए।', 'Background refresh ने request suspend कर दी।'],
    'telegram-vídeo-download-android': ['Android WebView ने referrer हटा दिया।', 'Battery saver ने background extraction pause कर दी।', 'Share intent ने malformed URL encoding दी।'],
    'telegram-private-vídeo-download': ['Target media publicly accessible नहीं है।', 'Channel में membership approval की ज़रूरत है।', 'Private post permission expire हो गई।'],
    'telegram-vídeo-download-link': ['Link ऐसे message पर जा रहा है जिसमें media नहीं है।', 'Media post URL की जगह thread root URL कॉपी हुई।', 'URL में unsupported tracking fragment है।'],
    'telegram-save-visible-ja': ['यूज़र download logs और notifications को एक जैसा समझ रहे हैं।', 'Public channel admin केवल view counts देख सकता है।', 'Shared files app UI में username दिखा सकती हैं।'],
    'telegram-vídeo-download-bot-safe': ['Bot बहुत ज़्यादा permissions मांग रहा है।', 'Unverified bot endpoint की कोई policy page नहीं है।', 'Bot media को किसी unknown third-party storage से forward कर रहा है।'],
  };

  const pt: Record<string, string[]> = {
    'telegram-vídeo-download': ['O link da publicação veio de um chat privado.', 'A mídia está restrita dentro do canal.', 'A requisição ao CDN do Telegram expirou.'],
    'telegram-vídeo-downloader-online': ['Foi copiado o texto de compartilhamento, não a URL.', 'A visualização do link está bloqueada nas configurações do app.', 'Uma extensão do navegador entrou em conflito com os cabeçalhos da requisição.'],
    'telegram-vídeo-save-method-ja': ['Foi usado um link de encaminhamento em vez do link original.', 'A publicação original foi editada e a mídia mudou.', 'O nó regional retornou metadados desatualizados.'],
    'telegram-vídeo-download-pc-ja': ['O app de desktop copiou um deep-link interno.', 'A rede corporativa bloqueia domínios de mídia do Telegram.', 'O download foi interrompido por uma verificação de antivírus em proxy.'],
    'telegram-vídeo-download-iphone': ['O iPhone copiou apenas um link curto de redirecionamento.', 'O navegador interno removeu parâmetros necessários.', 'A atualização em segundo plano suspendeu a requisição.'],
    'telegram-vídeo-download-android': ['O WebView do Android removeu o referrer.', 'O modo de economia pausou a extração em segundo plano.', 'O compartilhamento entregou uma URL com codificação incorreta.'],
    'telegram-private-vídeo-download': ['A mídia alvo não está acessível publicamente.', 'O canal exige aprovação para entrada.', 'A permissão da publicação privada expirou.'],
    'telegram-vídeo-download-link': ['O link aponta para uma mensagem sem mídia.', 'Foi copiada a raiz do tópico, não a URL da publicação com a mídia.', 'A URL contém um fragmento de rastreamento não suportado.'],
    'telegram-save-visible-ja': ['Muita gente confunde registros internos com notificações.', 'O administrador do canal público consegue ver apenas contagens de visualização.', 'Arquivos compartilhados podem expor o nome de usuário na interface do app.'],
    'telegram-vídeo-download-bot-safe': ['O bot pede permissões excessivas.', 'O endpoint do bot não verificado não oferece página de política.', 'O bot encaminha a mídia por um armazenamento externo desconhecido.'],
  };

  const ar: Record<string, string[]> = {
    'telegram-vídeo-download': ['الرابط من محادثة خاصة.', 'القناة تفرض تقييدًا على الملف.', 'انتهت مهلة طلب CDN الخاص بتليجرام.'],
    'telegram-vídeo-downloader-online': ['تم نسخ نص الرسالة بدل الرابط.', 'معاينة الرابط محجوبة في الإعدادات.', 'إضافة المتصفح عدّلت الترويسات.'],
    'telegram-vídeo-save-method-ja': ['استُخدم رابط مُعاد توجيهه بدل الأصلي.', 'تم تعديل المنشور وتغيّر الملف.', 'عقدة المنطقة أعادت بيانات قديمة.'],
    'telegram-vídeo-download-pc-ja': ['تطبيق سطح المكتب نسخ رابطًا داخليًا.', 'شبكة العمل تحجب نطاقات وسائط تليجرام.', 'فحص الحماية أوقف التنزيل أثناء النقل.'],
    'telegram-vídeo-download-iphone': ['iOS نسخ رابط تحويل قصير فقط.', 'متصفح التطبيق حذف معاملات مطلوبة.', 'التحديث الخلفي أوقف الطلب مؤقتًا.'],
    'telegram-vídeo-download-android': ['WebView على أندرويد حذف المرجع.', 'وضع توفير البطارية أوقف الاستخراج.', 'رابط المشاركة وصل بترميز غير صحيح.'],
    'telegram-private-vídeo-download': ['الوسائط غير متاحة للعامة.', 'القناة تتطلب موافقة عضوية.', 'انتهت صلاحية إذن المنشور الخاص.'],
    'telegram-vídeo-download-link': ['الرابط يشير لرسالة بلا وسائط.', 'تم نسخ رابط أصل المحادثة بدل المنشور.', 'الرابط يحتوي جزء تتبع غير مدعوم.'],
    'telegram-save-visible-ja': ['يتم الخلط بين السجلات والإشعارات.', 'المشرف يرى عدّاد المشاهدات العام فقط.', 'الملفات المشتركة قد تُظهر اسم المستخدم.'],
    'telegram-vídeo-download-bot-safe': ['البوت يطلب صلاحيات مبالغًا فيها.', 'البوت غير موثّق ولا يملك سياسة واضحة.', 'البوت يمرر الملفات عبر تخزين طرف ثالث مجهول.'],
  };

  if (locale === 'ja') return ja[slug] || null;
  if (locale === 'es') return es[slug] || null;
  if (locale === 'pt') return pt[slug] || null;
  if (locale === 'fr') return fr[slug] || null;
  if (locale === 'de') return de[slug] || null;
  if (locale === 'tr') return tr[slug] || null;
  if (locale === 'id') return id[slug] || null;
  if (locale === 'hi') return hi[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function twitterSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['Tweet URL is copied from a deleted post.', 'Media is in a quote tweet and wrong URL is used.', 'Shortened t.co link failed to resolve.'],
    'twitter-vídeo-downloader-online-free': ['Rate limit hit from repeated requests.', 'Ad-blocker blocks media request chain.', 'Copied profile URL instead of tweet URL.'],
    'twitter-vídeo-download-iphone': ['iOS in-app browser strips required parameters.', 'Share sheet copied preview URL only.', 'Low-power mode suspended background download.'],
    'twitter-vídeo-save-method-ja': ['User copied image tweet URL with no vídeo.', 'Tweet has region-restricted media.', 'Temporary X edge response returned incomplete metadata.'],
    'twitter-vídeo-save-not-working-ja': ['Tweet became private after copy.', 'Account was suspended or protected.', 'Session cookie-dependent media request failed.'],
    'twitter-vídeo-download-android': ['Android WebView changed URL encoding.', 'Battery optimization paused extraction.', 'Network switched between Wi-Fi and mobile mid-request.'],
    'twitter-gif-download': ['GIF is delivered as MP4 and user expects GIF file.', 'Animated media variant unavailable in selected quality.', 'Post contains static image despite GIF label.'],
    'twitter-vídeo-downloader-safe': ['User opened cloned phishing domain.', 'Browser warns mixed-content on unsafe mirror.', 'Untrusted extension injects redirect script.'],
    'twitter-vídeo-download-no-watermark': ['Source already has creator watermark.', 'Low-quality fallback selected by mistake.', 'Tweet media variant missing in selected format.'],
    'twitter-vídeo-download-mp4': ['Only HLS variant available for that post.', 'MP4 track blocked by transient CDN error.', 'Selected quality has no direct MP4 url.'],
    'twitter-vídeo-download-chrome': ['Old Chrome cache serves stale script bundle.', 'Third-party cookie setting breaks media token fetch.', 'Extension conflicts with fetch interception.'],
    'twitter-save-visible-ja': ['User confuses impressions with download logs.', 'Public engagement metrics are visible, not local saves.', 'Shared repost may expose account activity publicly.'],
    'twitter-vídeo-download-private-account': ['Protected account media is not publicly accessible.', 'Follow approval is required before media access.', 'Tweet permission changed after URL copy.'],
    'twitter-vídeo-download-without-login': ['Guest access token expired.', 'Post requires authenticated session.', 'Age/country gate blocks unauthenticated access.'],
    'twitter-vídeo-downloader-2026': ['Platform endpoint changed and cache is stale.', 'New anti-abuse thresholds triggered.', 'Legacy extraction path no longer supported.'],
  };

  const ja: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['削除済みの投稿から URL をコピーしていました。', '動画は引用ポスト側にあり、別のリンクを使っていました。', '短縮された t.co リンクを正しく展開できていません。'],
    'twitter-vídeo-downloader-online-free': ['短時間にリクエストが集中して一時的な制限に当たりました。', '広告ブロッカーがメディア取得の流れを止めています。', '投稿 URL ではなくプロフィール URL を貼り付けていました。'],
    'twitter-vídeo-download-iphone': ['iPhone のアプリ内ブラウザが必要なパラメータを落としています。', '共有メニューでプレビュー用 URL しかコピーされていません。', '省電力モードでバックグラウンド処理が止まりました。'],
    'twitter-vídeo-save-method-ja': ['動画を含まない投稿 URL をコピーしていました。', 'その投稿のメディアは地域制限付きです。', 'X 側の一時レスポンスでメタデータが欠けていました。'],
    'twitter-vídeo-save-not-working-ja': ['URL をコピーした後に投稿が非公開になりました。', 'アカウントが保護状態または停止状態に変わりました。', 'セッション依存のメディア取得が失敗しました。'],
    'twitter-vídeo-download-android': ['Android WebView が URL エンコードを変えてしまいました。', 'バッテリー最適化で抽出処理が一時停止しました。', '取得中に Wi-Fi とモバイル通信が切り替わりました。'],
    'twitter-gif-download': ['GIF は実際には MP4 として配信されています。', '選択した画質ではアニメーション版が用意されていません。', 'GIF と見えても実際は静止画像の投稿です。'],
    'twitter-vídeo-downloader-safe': ['クローンや偽装の疑いがあるドメインを開いていました。', '安全ではないミラー先として mixed content 警告が出ています。', '信頼できない拡張機能がリダイレクトを差し込んでいます。'],
    'twitter-vídeo-download-no-watermark': ['元の動画にすでに投稿者側の透かしがあります。', '誤って低画質の代替版を選んでいました。', '期待していた形式のメディアバリエーションがありません。'],
    'twitter-vídeo-download-mp4': ['その投稿では HLS 版しか公開されていません。', '一時的な CDN エラーで MP4 トラックが取れませんでした。', '選んだ画質には直接 MP4 の URL がありません。'],
    'twitter-vídeo-download-chrome': ['Chrome の古いキャッシュが古いスクリプトを返しています。', 'サードパーティ Cookie の設定でメディアトークン取得が壊れています。', '拡張機能が fetch 処理と競合しています。'],
    'twitter-save-visible-ja': ['表示回数とダウンロード履歴を混同しています。', '見えるのは公開エンゲージメントで、端末保存そのものではありません。', '再投稿や共有によってアカウントの動きが見えることがあります。'],
    'twitter-vídeo-download-private-account': ['保護アカウントのメディアは公開取得できません。', 'メディアを見るにはフォロー承認が必要です。', 'URL コピー後に投稿の権限設定が変わりました。'],
    'twitter-vídeo-download-without-login': ['ゲスト用トークンの有効期限が切れています。', 'その投稿はログイン済みセッションを前提にしています。', '年齢制限や国制限で未ログインアクセスが遮断されています。'],
    'twitter-vídeo-downloader-2026': ['プラットフォーム側のエンドポイントが変わり、キャッシュが古くなっています。', '新しい anti-abuse 制限に引っかかっています。', '旧来の抽出ルートがもう使えません。'],
  };

  const es: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['La URL proviene de un tweet eliminado.', 'El vídeo está en un quote tweet y se copió otro enlace.', 'El enlace t.co no se resolvió.'],
    'twitter-vídeo-downloader-online-free': ['Se alcanzó límite temporal de solicitudes.', 'El bloqueador corta la cadena de medios.', 'Se pegó URL de perfil y no del tweet.'],
    'twitter-vídeo-download-iphone': ['El navegador interno de iOS quita parámetros.', 'Compartir copió solo URL de vista previa.', 'Modo ahorro pausó descarga en segundo plano.'],
    'twitter-vídeo-save-method-ja': ['Se copió un tweet sin vídeo.', 'El vídeo tiene restricción regional.', 'El nodo de X devolvió metadatos incompletos.'],
    'twitter-vídeo-save-not-working-ja': ['El tweet pasó a privado.', 'La cuenta quedó protegida o suspendida.', 'Falló solicitud dependiente de sesión.'],
    'twitter-vídeo-download-android': ['WebView alteró codificación de URL.', 'Ahorro de batería pausó la extracción.', 'Cambio de red interrumpió la solicitud.'],
    'twitter-gif-download': ['El GIF se entrega como MP4.', 'La variante animada no está en esa calidad.', 'El post marcado GIF era imagen estática.'],
    'twitter-vídeo-downloader-safe': ['Se abrió un dominio clonado.', 'El navegador detectó contenido mixto.', 'Una extensión inyectó redirección no confiable.'],
    'twitter-vídeo-download-no-watermark': ['La marca de água ya existe en origen.', 'Se eligió por error una calidad baja.', 'Falta variante de formato en ese tweet.'],
    'twitter-vídeo-download-mp4': ['Ese post solo expone variante HLS.', 'Error temporal de CDN bloqueó pista MP4.', 'La calidad elegida no trae URL MP4 directa.'],
    'twitter-vídeo-download-chrome': ['Cache viejo de Chrome sirve scripts antiguos.', 'Cookies de terceros bloquean token.', 'Extensión interfiere con fetch.'],
    'twitter-save-visible-ja': ['Se confunden métricas públicas con guardados.', 'Se ve engagement, no descargas locales.', 'Un repost puede exponer actividad pública.'],
    'twitter-vídeo-download-private-account': ['El contenido de cuenta protegida no es público.', 'Se requiere aprobación para acceder al vídeo.', 'El permiso cambió tras copiar la URL.'],
    'twitter-vídeo-download-without-login': ['Expiró token de acceso invitado.', 'El post exige sesión autenticada.', 'Bloqueo por edad/país sin login.'],
    'twitter-vídeo-downloader-2026': ['Cambió endpoint de plataforma y hay cache viejo.', 'Nuevos umbrales antiabuso se activaron.', 'La ruta legacy de extracción ya no aplica.'],
  };

  const fr: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['L’URL a été copiée depuis une publication déjà supprimée.', 'La vidéo se trouvait dans une publication citée et le lien utilisé n’était pas le bon.', 'Le lien court t.co n’a pas été résolu correctement.'],
    'twitter-vídeo-downloader-online-free': ['La limite temporaire de requêtes a été atteinte.', 'Le bloqueur a interrompu la chaîne de chargement du média.', 'L’URL du profil a été collée à la place de l’URL de la publication.'],
    'twitter-vídeo-download-iphone': ['Le navigateur intégré de l’iPhone a supprimé des paramètres importants.', 'Le menu de partage a copié uniquement l’URL d’aperçu.', 'Le mode économie d’énergie a suspendu le téléchargement en arrière-plan.'],
    'twitter-vídeo-save-method-ja': ['Une publication sans vidéo a été copiée.', 'Le média de la publication est restreint par région.', 'Le nœud X a renvoyé des métadonnées incomplètes.'],
    'twitter-vídeo-save-not-working-ja': ['La publication est devenue privée après la copie du lien.', 'Le compte a été protégé ou suspendu.', 'La requête dépendante de la session a échoué.'],
    'twitter-vídeo-download-android': ['Le WebView Android a modifié l’encodage de l’URL.', 'L’optimisation de la batterie a mis l’extraction en pause.', 'Le réseau a basculé entre Wi-Fi et données mobiles pendant la requête.'],
    'twitter-gif-download': ['Le GIF est livré sous forme de MP4 et non comme un vrai fichier GIF.', 'La variante animée n’est pas disponible dans la qualité choisie.', 'La publication marquée comme GIF contient en réalité une image statique.'],
    'twitter-vídeo-downloader-safe': ['Un domaine cloné ou suspect a été ouvert.', 'Le navigateur a signalé un contenu non sûr.', 'Une extension non fiable a injecté une redirection.'],
    'twitter-vídeo-download-no-watermark': ['Le fichier source contient déjà un filigrane.', 'Une variante de faible qualité a été choisie par erreur.', 'La variante de format attendue n’est pas apparue pour cette publication.'],
    'twitter-vídeo-download-mp4': ['Cette publication n’expose que la variante HLS.', 'Une erreur CDN temporaire a bloqué la piste MP4.', 'La qualité choisie ne fournit pas d’URL MP4 directe.'],
    'twitter-vídeo-download-chrome': ['Un ancien cache de Chrome a servi des scripts obsolètes.', 'La configuration des cookies a empêché le jeton du média.', 'Une extension est entrée en conflit avec le chargement de la page.'],
    'twitter-save-visible-ja': ['Beaucoup de personnes confondent les métriques publiques avec les téléchargements locaux.', 'X affiche l’engagement, pas les fichiers enregistrés sur l’appareil.', 'Un repost peut exposer l’activité publique du compte.'],
    'twitter-vídeo-download-private-account': ['Le média d’un compte protégé n’est pas accessible publiquement.', 'Il faut être approuvé pour suivre le compte avant d’accéder au contenu.', 'L’autorisation de la publication a changé après la copie du lien.'],
    'twitter-vídeo-download-without-login': ['Le jeton d’accès visiteur a expiré.', 'La publication exige une session authentifiée.', 'Une restriction d’âge ou de pays a bloqué l’accès sans connexion.'],
    'twitter-vídeo-downloader-2026': ['Le point d’accès de la plateforme a changé et le cache est devenu obsolète.', 'De nouveaux seuils anti-abus ont été déclenchés.', 'L’ancienne route d’extraction ne fonctionne plus.'],
  };
  const de: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['Die URL wurde aus einem bereits gelöschten Beitrag kopiert.', 'Das Video befand sich in einem zitierten Beitrag und es wurde der falsche Link verwendet.', 'Der verkürzte t.co-Link konnte nicht korrekt aufgelöst werden.'],
    'twitter-vídeo-downloader-online-free': ['Das temporäre Anfragelimit wurde erreicht.', 'Ein Blocker hat die Lade-Kette des Mediums unterbrochen.', 'Es wurde die Profil-URL statt der Beitrags-URL eingefügt.'],
    'twitter-vídeo-download-iphone': ['Der In-App-Browser auf dem iPhone hat wichtige Parameter entfernt.', 'Über das Teilen-Menü wurde nur die Vorschau-URL kopiert.', 'Der Stromsparmodus hat den Download im Hintergrund angehalten.'],
    'twitter-vídeo-save-method-ja': ['Es wurde ein Beitrag ohne Video kopiert.', 'Das Medium des Beitrags ist regional eingeschränkt.', 'Ein X-Endpunkt hat unvollständige Metadaten zurückgegeben.'],
    'twitter-vídeo-save-not-working-ja': ['Der Beitrag wurde nach dem Kopieren des Links privat.', 'Das Konto wurde geschützt oder gesperrt.', 'Die sitzungsabhängige Anfrage ist fehlgeschlagen.'],
    'twitter-vídeo-download-android': ['Die Android-WebView hat die URL-Kodierung verändert.', 'Die Akkuoptimierung hat die Extraktion pausiert.', 'Das Netzwerk wechselte während der Anfrage zwischen WLAN und mobilen Daten.'],
    'twitter-gif-download': ['Das GIF wird als MP4 ausgeliefert und nicht als echte GIF-Datei.', 'Die animierte Variante ist in der gewählten Qualität nicht verfügbar.', 'Der als GIF markierte Beitrag enthält in Wirklichkeit nur ein statisches Bild.'],
    'twitter-vídeo-downloader-safe': ['Es wurde eine geklonte oder verdächtige Domain geöffnet.', 'Der Browser hat vor unsicherem Inhalt gewarnt.', 'Eine nicht vertrauenswürdige Erweiterung hat eine Weiterleitung eingefügt.'],
    'twitter-vídeo-download-no-watermark': ['Die Quelldatei enthält bereits ein Wasserzeichen.', 'Aus Versehen wurde eine Variante mit niedriger Qualität gewählt.', 'Die erwartete Formatvariante ist für diesen Beitrag nicht verfügbar.'],
    'twitter-vídeo-download-mp4': ['Dieser Beitrag stellt nur die HLS-Variante bereit.', 'Ein temporärer CDN-Fehler hat die MP4-Spur blockiert.', 'Die gewählte Qualität liefert keine direkte MP4-URL.'],
    'twitter-vídeo-download-chrome': ['Ein alter Chrome-Cache hat veraltete Skripte ausgeliefert.', 'Die Cookie-Einstellung hat das Medien-Token blockiert.', 'Eine Erweiterung hat den Seitenaufbau gestört.'],
    'twitter-save-visible-ja': ['Viele verwechseln öffentliche Kennzahlen mit lokalen Downloads.', 'X zeigt Interaktionen, aber keine auf dem Gerät gespeicherten Dateien.', 'Ein Repost kann öffentliche Kontoaktivität sichtbar machen.'],
    'twitter-vídeo-download-private-account': ['Medien eines geschützten Kontos sind nicht öffentlich zugänglich.', 'Vor dem Zugriff auf den Inhalt ist eine Bestätigung zum Folgen erforderlich.', 'Die Berechtigung des Beitrags hat sich nach dem Kopieren des Links geändert.'],
    'twitter-vídeo-download-without-login': ['Das Besucher-Token ist abgelaufen.', 'Der Beitrag verlangt eine authentifizierte Sitzung.', 'Eine Alters- oder Ländersperre blockiert den Zugriff ohne Anmeldung.'],
    'twitter-vídeo-downloader-2026': ['Der Plattform-Endpunkt wurde geändert und der Cache ist veraltet.', 'Neue Anti-Missbrauchs-Schwellen wurden ausgelöst.', 'Der alte Extraktionspfad wird nicht mehr unterstützt.'],
  };

  const id: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['URL tweet diambil dari postingan yang sudah dihapus.', 'Medianya ada di tweet kutipan tetapi tautan yang dipakai bukan tautan yang benar.', 'Tautan pendek t.co gagal diarahkan ke tujuan akhir.'],
    'twitter-vídeo-downloader-online-free': ['Batas permintaan sementara tercapai.', 'Pemblokir iklan memutus rantai pemuatan media.', 'Yang ditempel adalah URL profil, bukan URL tweet.'],
    'twitter-vídeo-download-iphone': ['Browser di dalam aplikasi iPhone menghapus parameter penting.', 'Menu berbagi hanya menyalin URL pratinjau.', 'Mode hemat daya menghentikan unduhan di latar belakang.'],
    'twitter-vídeo-save-method-ja': ['Yang disalin adalah tweet tanpa video.', 'Media pada tweet dibatasi berdasarkan wilayah.', 'Respons edge X sementara mengembalikan metadata yang tidak lengkap.'],
    'twitter-vídeo-save-not-working-ja': ['Tweet menjadi privat setelah tautannya disalin.', 'Akun berubah menjadi terlindungi atau ditangguhkan.', 'Permintaan media yang bergantung pada sesi gagal.'],
    'twitter-vídeo-download-android': ['WebView Android mengubah encoding URL.', 'Optimasi baterai menjeda proses ekstraksi.', 'Jaringan berpindah antara Wi-Fi dan data seluler saat permintaan berjalan.'],
    'twitter-gif-download': ['GIF dikirim sebagai MP4 sementara pengguna mengharapkan file GIF asli.', 'Varian media animasi tidak tersedia pada kualitas yang dipilih.', 'Postingan berlabel GIF ternyata hanya berisi gambar statis.'],
    'twitter-vídeo-downloader-safe': ['Pengguna membuka domain tiruan yang mencurigakan.', 'Browser menampilkan peringatan mixed content pada mirror yang tidak aman.', 'Ekstensi yang tidak tepercaya menyisipkan skrip pengalihan.'],
    'twitter-vídeo-download-no-watermark': ['File sumber sudah memiliki watermark pembuat.', 'Varian kualitas rendah dipilih tanpa sengaja.', 'Varian format yang diharapkan tidak tersedia pada tweet ini.'],
    'twitter-vídeo-download-mp4': ['Tweet ini hanya menyediakan varian HLS.', 'Track MP4 terblokir oleh error CDN sementara.', 'Kualitas yang dipilih tidak memiliki URL MP4 langsung.'],
    'twitter-vídeo-download-chrome': ['Cache Chrome yang lama masih memuat bundle skrip usang.', 'Pengaturan cookie pihak ketiga merusak pengambilan token media.', 'Ekstensi browser bentrok dengan proses fetch.'],
    'twitter-save-visible-ja': ['Pengguna sering mencampuradukkan impresi dengan log unduhan.', 'Yang terlihat adalah metrik interaksi publik, bukan file yang disimpan secara lokal.', 'Repost yang dibagikan bisa memperlihatkan aktivitas akun secara publik.'],
    'twitter-vídeo-download-private-account': ['Media dari akun terlindungi tidak tersedia untuk publik.', 'Akses ke media memerlukan persetujuan follow terlebih dahulu.', 'Izin pada tweet berubah setelah URL disalin.'],
    'twitter-vídeo-download-without-login': ['Token akses tamu sudah kedaluwarsa.', 'Postingan memerlukan sesi yang sudah terautentikasi.', 'Pembatasan usia atau negara memblokir akses tanpa login.'],
    'twitter-vídeo-downloader-2026': ['Endpoint platform berubah dan cache sudah usang.', 'Ambang anti-abuse yang baru terpicu.', 'Jalur ekstraksi lama sudah tidak lagi didukung.'],
  };

  const hi: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['Tweet की URL किसी डिलीट हो चुकी पोस्ट से कॉपी की गई थी।', 'वीडियो quote tweet में था, लेकिन गलत लिंक इस्तेमाल किया गया।', 'छोटी t.co लिंक अंतिम पते तक resolve नहीं हुई।'],
    'twitter-vídeo-downloader-online-free': ['बार-बार request करने से अस्थायी rate limit लग गई।', 'Ad-blocker ने media request chain को रोक दिया।', 'Tweet URL की जगह profile URL पेस्ट कर दी गई।'],
    'twitter-vídeo-download-iphone': ['iPhone के in-app browser ने ज़रूरी parameters हटा दिए।', 'Share sheet ने सिर्फ preview URL कॉपी की।', 'Low-power mode ने background download रोक दिया।'],
    'twitter-vídeo-save-method-ja': ['यूज़र ने ऐसी tweet URL कॉपी की जिसमें वीडियो नहीं था।', 'Tweet का media किसी region में restricted है।', 'X edge से अधूरा metadata लौटा।'],
    'twitter-vídeo-save-not-working-ja': ['लिंक कॉपी करने के बाद tweet private हो गया।', 'अकाउंट protected या suspended हो गया।', 'Session पर निर्भर media request फेल हो गई।'],
    'twitter-vídeo-download-android': ['Android WebView ने URL encoding बदल दी।', 'Battery optimization ने extraction रोक दी।', 'Request के दौरान network Wi-Fi और mobile data के बीच बदल गया।'],
    'twitter-gif-download': ['GIF असल GIF file की जगह MP4 के रूप में दिया जा रहा है।', 'चुनी हुई quality में animated variant उपलब्ध नहीं है।', 'GIF label वाली post में वास्तव में static image है।'],
    'twitter-vídeo-downloader-safe': ['यूज़र ने cloned phishing domain खोल लिया।', 'Browser ने unsafe mirror पर mixed-content warning दिखाई।', 'Untrusted extension ने redirect script inject किया।'],
    'twitter-vídeo-download-no-watermark': ['Source file में creator watermark पहले से मौजूद है।', 'गलती से low-quality fallback चुन लिया गया।', 'चुने हुए format में tweet media variant उपलब्ध नहीं है।'],
    'twitter-vídeo-download-mp4': ['उस post के लिए सिर्फ HLS variant उपलब्ध है।', 'अस्थायी CDN error ने MP4 track block कर दिया।', 'चुनी हुई quality में direct MP4 URL नहीं है।'],
    'twitter-vídeo-download-chrome': ['पुराना Chrome cache outdated script bundle दे रहा है।', 'Third-party cookie setting ने media token fetch तोड़ दिया।', 'एक extension fetch process से टकरा रही है।'],
    'twitter-save-visible-ja': ['यूज़र impressions और download logs को एक जैसा समझ रहा है।', 'पब्लिक engagement metrics दिखती हैं, local saves नहीं।', 'Shared repost से अकाउंट activity सार्वजनिक रूप से दिख सकती है।'],
    'twitter-vídeo-download-private-account': ['Protected account का media publicly accessible नहीं है।', 'Media access से पहले follow approval ज़रूरी है।', 'URL कॉपी होने के बाद tweet permission बदल गई।'],
    'twitter-vídeo-download-without-login': ['Guest access token expire हो गया।', 'Post को authenticated session की ज़रूरत है।', 'Age या country gate ने unauthenticated access रोक दिया।'],
    'twitter-vídeo-downloader-2026': ['Platform endpoint बदल गया और cache पुराना हो चुका है।', 'नए anti-abuse thresholds trigger हो गए।', 'पुराना extraction path अब supported नहीं है।'],
  };

  const pt: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['A URL foi copiada de uma publicação já apagada.', 'O vídeo estava em uma publicação citada e o link usado não era o correto.', 'O link curto t.co não foi resolvido corretamente.'],
    'twitter-vídeo-downloader-online-free': ['O limite temporário de requisições foi atingido.', 'O bloqueador interrompeu a cadeia de carregamento da mídia.', 'Foi colada a URL do perfil em vez da URL da publicação.'],
    'twitter-vídeo-download-iphone': ['O navegador interno do iPhone removeu parâmetros importantes.', 'O menu de compartilhamento copiou apenas a URL de visualização.', 'O modo de economia pausou o download em segundo plano.'],
    'twitter-vídeo-save-method-ja': ['Foi copiada uma publicação sem vídeo.', 'A mídia da publicação está restrita por região.', 'A borda do X retornou metadados incompletos.'],
    'twitter-vídeo-save-not-working-ja': ['A publicação ficou privada depois da cópia do link.', 'A conta foi protegida ou suspensa.', 'A requisição dependente de sessão falhou.'],
    'twitter-vídeo-download-android': ['O WebView do Android alterou a codificação da URL.', 'A otimização de bateria pausou a extração.', 'A rede mudou entre Wi-Fi e dados durante a requisição.'],
    'twitter-gif-download': ['O GIF é entregue como MP4, não como um arquivo GIF real.', 'A variante animada não está disponível na qualidade escolhida.', 'A publicação marcada como GIF, na verdade, contém uma imagem estática.'],
    'twitter-vídeo-downloader-safe': ['Foi aberto um domínio clonado ou suspeito.', 'O navegador avisou sobre conteúdo inseguro.', 'Uma extensão não confiável injetou um redirecionamento.'],
    'twitter-vídeo-download-no-watermark': ['A marca d’água já existe no arquivo de origem.', 'Uma variante de baixa qualidade foi escolhida por engano.', 'A variante de formato esperada não apareceu nessa publicação.'],
    'twitter-vídeo-download-mp4': ['Essa publicação só expõe a variante HLS.', 'Um erro temporário de CDN bloqueou a trilha MP4.', 'A qualidade escolhida não tem URL MP4 direta.'],
    'twitter-vídeo-download-chrome': ['O cache antigo do Chrome serviu scripts desatualizados.', 'A configuração de cookies impediu o token da mídia.', 'Uma extensão entrou em conflito com o carregamento da página.'],
    'twitter-save-visible-ja': ['Muita gente confunde métricas públicas com downloads locais.', 'O X mostra engajamento, não os arquivos salvos no aparelho.', 'Um repost pode expor atividade pública da conta.'],
    'twitter-vídeo-download-private-account': ['A mídia de uma conta protegida não está disponível publicamente.', 'É preciso ter aprovação para seguir a conta antes de acessar o conteúdo.', 'A permissão da publicação mudou depois da cópia do link.'],
    'twitter-vídeo-download-without-login': ['O token de acesso de visitante expirou.', 'A publicação exige uma sessão autenticada.', 'Uma restrição de idade ou país bloqueou o acesso sem login.'],
    'twitter-vídeo-downloader-2026': ['O endpoint da plataforma mudou e o cache ficou defasado.', 'Novos limites antiabuso foram acionados.', 'A rota antiga de extração deixou de funcionar.'],
  };

  const tr: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['URL, daha önce silinmiş bir gönderiden kopyalandı.', 'Video alıntılanmış bir gönderideydi ve yanlış bağlantı kullanıldı.', 'Kısaltılmış t.co bağlantısı düzgün şekilde çözümlenemedi.'],
    'twitter-vídeo-downloader-online-free': ['Geçici istek sınırına ulaşıldı.', 'Bir engelleyici medya yükleme zincirini kesti.', 'Gönderi URL’si yerine profil URL’si yapıştırıldı.'],
    'twitter-vídeo-download-iphone': ['iPhone iç tarayıcısı gerekli parametreleri kaldırdı.', 'Paylaş menüsü yalnızca önizleme URL’sini kopyaladı.', 'Düşük güç modu arka plandaki indirmeyi durdurdu.'],
    'twitter-vídeo-save-method-ja': ['Video içermeyen bir gönderi kopyalandı.', 'Gönderideki medya bölgesel olarak kısıtlı.', 'Bir X uç noktası eksik meta veri döndürdü.'],
    'twitter-vídeo-save-not-working-ja': ['Bağlantı kopyalandıktan sonra gönderi gizliye alındı.', 'Hesap korumalı hâle geldi ya da askıya alındı.', 'Oturuma bağlı istek başarısız oldu.'],
    'twitter-vídeo-download-android': ['Android WebView URL kodlamasını değiştirdi.', 'Pil optimizasyonu çıkarma işlemini duraklattı.', 'İstek sırasında ağ Wi‑Fi ile mobil veri arasında değişti.'],
    'twitter-gif-download': ['GIF gerçek bir GIF dosyası yerine MP4 olarak sunuluyor.', 'Animasyonlu varyant seçilen kalitede mevcut değil.', 'GIF olarak işaretlenen gönderi aslında statik bir görsel içeriyor.'],
    'twitter-vídeo-downloader-safe': ['Klonlanmış ya da şüpheli bir alan adı açıldı.', 'Tarayıcı güvensiz içerik uyarısı verdi.', 'Güvenilmeyen bir eklenti yönlendirme enjekte etti.'],
    'twitter-vídeo-download-no-watermark': ['Kaynak dosyada zaten filigran var.', 'Yanlışlıkla düşük kaliteli bir varyant seçildi.', 'Beklenen format varyantı bu gönderi için mevcut değil.'],
    'twitter-vídeo-download-mp4': ['Bu gönderi yalnızca HLS varyantını sunuyor.', 'Geçici bir CDN hatası MP4 parçasını engelledi.', 'Seçilen kalite doğrudan MP4 URL’si vermiyor.'],
    'twitter-vídeo-download-chrome': ['Eski Chrome önbelleği güncelliğini yitirmiş betikler sundu.', 'Çerez ayarı medya belirtecini engelledi.', 'Bir eklenti sayfa yüklenmesini bozdu.'],
    'twitter-save-visible-ja': ['Birçok kişi herkese açık metriklerle yerel indirmeleri karıştırır.', 'X etkileşimi gösterir, ancak cihaza kaydedilen dosyaları göstermez.', 'Bir repost herkese açık hesap etkinliğini görünür kılabilir.'],
    'twitter-vídeo-download-private-account': ['Korumalı bir hesabın medyası herkese açık değildir.', 'İçeriğe erişmeden önce hesabı takip etmek için onay gerekir.', 'Bağlantı kopyalandıktan sonra gönderinin izni değişti.'],
    'twitter-vídeo-download-without-login': ['Ziyaretçi erişim belirteci süresi doldu.', 'Gönderi kimliği doğrulanmış oturum gerektiriyor.', 'Yaş veya ülke kısıtı giriş olmadan erişimi engelledi.'],
    'twitter-vídeo-downloader-2026': ['Platform uç noktası değişti ve önbellek eskidi.', 'Yeni kötüye kullanım eşikleri tetiklendi.', 'Eski çıkarma yolu artık desteklenmiyor.'],
  };

  const ar: Record<string, string[]> = {
    'how-to-download-twitter-vídeos': ['الرابط من تغريدة محذوفة.', 'الفيديو داخل اقتباس وتم نسخ رابط خاطئ.', 'رابط t.co لم يُفك بشكل صحيح.'],
    'twitter-vídeo-downloader-online-free': ['تم الوصول لحد الطلبات المؤقت.', 'مانع الإعلانات قطع سلسلة التحميل.', 'تم نسخ رابط الحساب بدل التغريدة.'],
    'twitter-vídeo-download-iphone': ['متصفح iOS الداخلي حذف معاملات مهمة.', 'تم نسخ رابط المعاينة فقط.', 'وضع توفير الطاقة أوقف التنزيل بالخلفية.'],
    'twitter-vídeo-save-method-ja': ['تم نسخ تغريدة بلا فيديو.', 'الوسائط مقيدة حسب المنطقة.', 'عقدة X أعادت بيانات ناقصة.'],
    'twitter-vídeo-save-not-working-ja': ['أصبحت التغريدة خاصة بعد النسخ.', 'الحساب محمي أو موقوف.', 'فشل طلب يعتمد على جلسة تسجيل.'],
    'twitter-vídeo-download-android': ['WebView غيّر ترميز الرابط.', 'توفير البطارية أوقف الاستخراج.', 'تبدّل الشبكة أثناء الطلب.'],
    'twitter-gif-download': ['الـ GIF يُقدّم بصيغة MP4.', 'نسخة الحركة غير متاحة بالجودة المختارة.', 'المنشور المصنّف GIF كان صورة ثابتة.'],
    'twitter-vídeo-downloader-safe': ['تم فتح نطاق مزيّف.', 'المتصفح حذّر من محتوى غير آمن.', 'إضافة غير موثوقة حقنت إعادة توجيه.'],
    'twitter-vídeo-download-no-watermark': ['العلامة المائية موجودة من المصدر.', 'تم اختيار جودة منخفضة بالخطأ.', 'نسخة التنسيق المطلوبة غير متاحة.'],
    'twitter-vídeo-download-mp4': ['المنشور يوفّر HLS فقط.', 'خطأ CDN مؤقت منع مسار MP4.', 'الجودة المختارة لا تحتوي رابط MP4 مباشر.'],
    'twitter-vídeo-download-chrome': ['ذاكرة Chrome المؤقتة قديمة.', 'إعدادات الكوكيز منعت رمز الوسائط.', 'إضافة المتصفح تعارضت مع الطلب.'],
    'twitter-save-visible-ja': ['تم الخلط بين التفاعل والحفظ المحلي.', 'الظاهر هو المؤشرات العامة لا التنزيل.', 'إعادة النشر قد تُظهر النشاط علنًا.'],
    'twitter-vídeo-download-private-account': ['وسائط الحساب المحمي ليست عامة.', 'يلزم قبول المتابعة للوصول.', 'تغيرت صلاحية الوصول بعد النسخ.'],
    'twitter-vídeo-download-without-login': ['انتهت صلاحية وصول الزائر.', 'المنشور يتطلب تسجيل دخول.', 'قيود عمر/بلد تمنع الوصول بدون حساب.'],
    'twitter-vídeo-downloader-2026': ['تغيّر مسار API وما زال الكاش قديمًا.', 'تم تفعيل حدود جديدة لمكافحة الإساءة.', 'المسار القديم للاستخراج لم يعد مدعومًا.'],
  };

  if (locale === 'ja') return ja[slug] || null;
  if (locale === 'es') return es[slug] || null;
  if (locale === 'pt') return pt[slug] || null;
  if (locale === 'fr') return fr[slug] || null;
  if (locale === 'de') return de[slug] || null;
  if (locale === 'tr') return tr[slug] || null;
  if (locale === 'id') return id[slug] || null;
  if (locale === 'hi') return hi[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function tiktokSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['Original upload already has baked-in watermark.', 'Selected variant falls back to branded stream.', 'Post switched to restricted distribution mode.'],
    'tiktok-downloader-without-watermark-online': ['Shared link points to profile, not vídeo.', 'Anti-bot challenge interrupted media fetch.', 'Region edge returned temporary 403 for media.'],
    'tiktok-vídeo-save-method-ja': ['Copied short link without resolving final URL.', 'Video was replaced after repost edit.', 'The selected post is image carousel, not vídeo.'],
    'tiktok-vídeo-save-not-working-ja': ['Post was removed or made private.', 'Account visibility changed after link copy.', 'Temporary platform throttle blocked extraction.'],
    'download-tiktok-vídeo-hd': ['HD variant is unavailable for this upload.', 'Source vídeo was originally low resolution.', 'Bandwidth adaptation selected lower bitrate stream.'],
    'tiktok-download-mp4': ['Only segmented stream is exposed for this post.', 'MP4 mux step failed due transient timeout.', 'Chosen quality has no direct MP4 rendition.'],
    'save-tiktok-vídeo-iphone': ['In-app browser strips required query params.', 'iOS share copied preview URL only.', 'Background task was paused by low-power mode.'],
    'tiktok-vídeo-download-android': ['Android intent delivered malformed URL.', 'WebView blocked redirect chain for media.', 'Battery optimization paused extraction task.'],
    'tiktok-downloader-safe': ['User opened cloned phishing mirror.', 'Injected script from extension changed destination.', 'TLS warning ignored on untrusted domain.'],
    'tiktok-vídeo-downloader-free': ['Free endpoint hit temporary quota ceiling.', 'Burst retries triggered anti-abuse cooldown.', 'Public CDN path rotated during request.'],
    'tiktok-vídeo-download-private': ['Private account content is not publicly accessible.', 'Follow approval required before media access.', 'Permission changed between copy and extraction.'],
    'tiktok-save-visible-ja': ['Users confuse view metrics with local saves.', 'Platform can show engagement, not device download.', 'Re-share activity may expose account actions.'],
    'how-to-save-tiktok-without-watermark': ['No-watermark variant unavailable for this post.', 'Selected link references slideshow content.', 'Third-party blocker removed required request headers.'],
    'tiktok-vídeo-downloader-2026': ['Platform endpoint changed and cache is stale.', 'New anti-abuse threshold temporarily blocks requests.', 'Legacy extraction route is deprecated.'],
    'tiktok-vídeo-link-download': ['Link targets channel/home, not specific post.', 'Short URL not expanded to final media URL.', 'Tracking fragment broke parser normalization.'],
  };

  const ja: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['元の動画にすでに透かしが入っています。', '選んだバリエーションが透かし付きの配信に切り替わりました。', '投稿が制限付き配信に変わっています。'],
    'tiktok-downloader-without-watermark-online': ['共有されたリンクが動画ではなくプロフィールを指しています。', 'anti-bot の検証でメディア取得が止まりました。', '地域ノードが一時的に 403 を返しています。'],
    'tiktok-vídeo-save-method-ja': ['短縮リンクだけをコピーして最終 URL まで解決していません。', '編集された再投稿のあとで動画が差し替えられました。', '選んだ投稿は動画ではなく画像カルーセルです。'],
    'tiktok-vídeo-save-not-working-ja': ['投稿が削除されたか非公開になりました。', 'リンクをコピーした後でアカウントの公開範囲が変わりました。', 'プラットフォーム側の一時制限で抽出が止まっています。'],
    'download-tiktok-vídeo-hd': ['この投稿には HD 版のバリエーションがありません。', '元の動画自体が低解像度でした。', '通信状況に応じて低いビットレートの配信が選ばれました。'],
    'tiktok-download-mp4': ['その投稿は分割ストリームしか公開していません。', 'MP4 へまとめる処理が一時的なタイムアウトで失敗しました。', '選んだ画質には直接 MP4 のバリエーションがありません。'],
    'save-tiktok-vídeo-iphone': ['アプリ内ブラウザが必要なパラメータを削除しています。', 'iPhone 側でプレビュー URL しかコピーされていません。', 'バックグラウンド処理が省電力モードで停止しました。'],
    'tiktok-vídeo-download-android': ['Android の intent で不正な形式の URL が渡されました。', 'WebView がメディアのリダイレクト連鎖を止めています。', 'バッテリー最適化で抽出タスクが一時停止しました。'],
    'tiktok-downloader-safe': ['クローンや不審なミラーサイトを開いていました。', '拡張機能が差し込んだスクリプトで遷移先が変わっています。', '信頼できないドメイン上の TLS 警告を無視していました。'],
    'tiktok-vídeo-downloader-free': ['無料エンドポイントの一時クォータ上限に達しました。', '短時間の連続再試行で anti-abuse のクールダウンに入りました。', '取得中に公開 CDN の経路が切り替わりました。'],
    'tiktok-vídeo-download-private': ['非公開アカウントの投稿は公開取得できません。', 'メディアへアクセスする前にフォロー承認が必要です。', 'コピーから抽出までの間に権限設定が変わりました。'],
    'tiktok-save-visible-ja': ['表示回数と端末への保存を混同しています。', 'プラットフォームが見せるのはエンゲージメントで、端末ダウンロードそのものではありません。', '再共有の動きからアカウントの行動が見えることがあります。'],
    'how-to-save-tiktok-without-watermark': ['この投稿には透かしなし版がありません。', '選んだリンクがスライドショー投稿を指しています。', 'サードパーティのブロッカーが必要なヘッダーを落としました。'],
    'tiktok-vídeo-downloader-2026': ['プラットフォーム側のエンドポイントが変わり、キャッシュが古くなっています。', '新しい anti-abuse 閾値で一時的にリクエストが止められています。', '旧来の抽出ルートは廃止されています。'],
    'tiktok-vídeo-link-download': ['リンクが特定の投稿ではなくチャンネルやトップを指しています。', '短縮 URL が最終メディア URL まで展開されていません。', 'トラッキング用の断片がパーサーの正規化を壊しています。'],
  };

  const es: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['El vídeo ya trae marca de água en origen.', 'La variante elegida cae a stream con marca.', 'El post cambió a distribución restringida.'],
    'tiktok-downloader-without-watermark-online': ['El enlace apunta al perfil, no al vídeo.', 'El desafío anti-bot interrumpió la carga.', 'El nodo regional devolvió 403 temporal.'],
    'tiktok-vídeo-save-method-ja': ['Se copió enlace corto sin resolver URL final.', 'El vídeo cambió tras edición del repost.', 'El post es carrusel de imágenes, no vídeo.'],
    'tiktok-vídeo-save-not-working-ja': ['El post fue eliminado o privado.', 'Cambió visibilidad de la cuenta.', 'Límite temporal de plataforma bloqueó extracción.'],
    'download-tiktok-vídeo-hd': ['No existe variante HD para ese vídeo.', 'El original era de baja resolución.', 'La red forzó bitrate más bajo.'],
    'tiktok-download-mp4': ['Ese post solo expone stream segmentado.', 'Falló el mux a MP4 por timeout.', 'La calidad elegida no tiene MP4 directo.'],
    'save-tiktok-vídeo-iphone': ['El navegador interno quita parámetros clave.', 'iOS copió solo URL de vista previa.', 'Modo ahorro pausó tarea en segundo plano.'],
    'tiktok-vídeo-download-android': ['Intent de Android entregó URL mal codificada.', 'WebView bloqueó cadena de redirecciones.', 'Ahorro de batería pausó la extracción.'],
    'tiktok-downloader-safe': ['Se abrió un mirror clonado.', 'Una extensión alteró el destino del script.', 'Se ignoró advertencia TLS del dominio.'],
    'tiktok-vídeo-downloader-free': ['El endpoint free alcanzó cuota temporal.', 'Reintentos activaron enfriamiento antiabuso.', 'La ruta CDN pública rotó durante la solicitud.'],
    'tiktok-vídeo-download-private': ['Contenido privado no es accesible públicamente.', 'Se requiere aprobación de seguimiento.', 'Permiso cambió entre copia y extracción.'],
    'tiktok-save-visible-ja': ['Se confunden vistas con guardado local.', 'La plataforma muestra engagement, no descargas.', 'Recompartir puede exponer actividad pública.'],
    'how-to-save-tiktok-without-watermark': ['No hay variante sin marca en ese post.', 'El enlace es de slideshow.', 'Bloqueador eliminó cabeceras requeridas.'],
    'tiktok-vídeo-downloader-2026': ['Cambió endpoint y hay cache obsoleto.', 'Nuevo umbral antiabuso bloquea temporalmente.', 'Ruta legacy de extracción quedó obsoleta.'],
    'tiktok-vídeo-link-download': ['El enlace va a inicio/canal, no al post.', 'URL corta no se expandió al destino final.', 'Fragmento de tracking rompió el parser.'],
  };

  const fr: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['La vidéo d’origine comporte déjà un filigrane intégré.', 'La variante choisie a basculé vers une version avec filigrane.', 'La publication est passée à un mode de diffusion restreinte.'],
    'tiktok-downloader-without-watermark-online': ['Le lien partagé pointe vers le profil, pas vers la vidéo.', 'Le défi anti-bot a interrompu la récupération du média.', 'Le nœud régional a renvoyé un 403 temporaire pour le média.'],
    'tiktok-vídeo-save-method-ja': ['Un lien court a été copié sans résolution de l’URL finale.', 'La vidéo a été remplacée après une republication modifiée.', 'La publication sélectionnée est un carrousel d’images, pas une vidéo.'],
    'tiktok-vídeo-save-not-working-ja': ['La publication a été supprimée ou est devenue privée.', 'La visibilité du compte a changé après la copie du lien.', 'Une limitation temporaire de la plateforme a bloqué l’extraction.'],
    'download-tiktok-vídeo-hd': ['Aucune variante HD n’est disponible pour cet envoi.', 'La vidéo source était déjà en basse résolution.', 'L’adaptation réseau a choisi un flux à débit plus faible.'],
    'tiktok-download-mp4': ['Cette publication n’expose qu’un flux segmenté.', 'L’étape de mux MP4 a échoué à cause d’un timeout temporaire.', 'La qualité choisie ne propose pas de variante MP4 directe.'],
    'save-tiktok-vídeo-iphone': ['Le navigateur intégré de l’app a supprimé des paramètres nécessaires.', 'L’iPhone a copié uniquement l’URL d’aperçu.', 'La tâche en arrière-plan a été suspendue par le mode économie d’énergie.'],
    'tiktok-vídeo-download-android': ['L’intent Android a fourni une URL mal formée.', 'Le WebView a bloqué la chaîne de redirection du média.', 'L’optimisation de la batterie a mis la tâche d’extraction en pause.'],
    'tiktok-downloader-safe': ['Un miroir cloné ou suspect a été ouvert.', 'Un script injecté par une extension a modifié la destination.', 'Un avertissement TLS sur un domaine non fiable a été ignoré.'],
    'tiktok-vídeo-downloader-free': ['Le point d’accès gratuit a atteint une limite temporaire de quota.', 'Plusieurs tentatives successives ont déclenché une période de refroidissement anti-abus.', 'La route publique du CDN a changé pendant la requête.'],
    'tiktok-vídeo-download-private': ['Le contenu d’un compte privé n’est pas accessible publiquement.', 'Une approbation pour suivre le compte est nécessaire avant l’accès.', 'L’autorisation a changé entre la copie du lien et l’extraction.'],
    'tiktok-save-visible-ja': ['Beaucoup de personnes confondent les métriques de vues avec l’enregistrement local.', 'La plateforme peut afficher l’engagement, mais pas les téléchargements sur l’appareil.', 'Une republication peut exposer l’activité du compte.'],
    'how-to-save-tiktok-without-watermark': ['La variante sans filigrane n’est pas disponible pour cette publication.', 'Le lien sélectionné pointe vers un slideshow.', 'Un bloqueur tiers a supprimé des en-têtes requis.'],
    'tiktok-vídeo-downloader-2026': ['Le point d’accès de la plateforme a changé et le cache est devenu obsolète.', 'Une nouvelle limite anti-abus a temporairement bloqué les requêtes.', 'L’ancienne route d’extraction a été abandonnée.'],
    'tiktok-vídeo-link-download': ['Le lien pointe vers un canal ou la page d’accueil, pas vers une publication précise.', 'L’URL courte n’a pas été développée jusqu’à la destination finale.', 'Un fragment de suivi a perturbé la normalisation du parser.'],
  };
  const de: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['Das Originalvideo enthält bereits ein eingebranntes Wasserzeichen.', 'Die gewählte Variante ist auf einen Stream mit Wasserzeichen zurückgefallen.', 'Der Beitrag wurde auf eingeschränkte Verbreitung umgestellt.'],
    'tiktok-downloader-without-watermark-online': ['Der geteilte Link verweist auf das Profil statt auf das Video.', 'Eine Anti-Bot-Prüfung hat den Abruf des Mediums unterbrochen.', 'Der regionale Knoten hat für das Medium vorübergehend 403 zurückgegeben.'],
    'tiktok-vídeo-save-method-ja': ['Es wurde ein Kurzlink kopiert, ohne die endgültige URL aufzulösen.', 'Das Video wurde nach einer bearbeiteten Wiederveröffentlichung ersetzt.', 'Der ausgewählte Beitrag ist ein Bildkarussell und kein Video.'],
    'tiktok-vídeo-save-not-working-ja': ['Der Beitrag wurde entfernt oder auf privat gestellt.', 'Die Sichtbarkeit des Kontos hat sich nach dem Kopieren des Links geändert.', 'Eine temporäre Plattformbegrenzung hat die Extraktion blockiert.'],
    'download-tiktok-vídeo-hd': ['Für diesen Upload ist keine HD-Variante verfügbar.', 'Das Ausgangsvideo hatte bereits eine niedrige Auflösung.', 'Die Netzwerkanpassung hat einen Stream mit niedrigerer Bitrate gewählt.'],
    'tiktok-download-mp4': ['Dieser Beitrag stellt nur einen segmentierten Stream bereit.', 'Der MP4-Mux-Schritt ist wegen eines temporären Timeouts fehlgeschlagen.', 'Die gewählte Qualität bietet keine direkte MP4-Variante.'],
    'save-tiktok-vídeo-iphone': ['Der In-App-Browser hat erforderliche Parameter entfernt.', 'Auf dem iPhone wurde nur die Vorschau-URL kopiert.', 'Die Hintergrundaufgabe wurde durch den Stromsparmodus angehalten.'],
    'tiktok-vídeo-download-android': ['Der Android-Intent hat eine fehlerhaft formatierte URL geliefert.', 'Die WebView hat die Weiterleitungskette des Mediums blockiert.', 'Die Akkuoptimierung hat die Extraktionsaufgabe pausiert.'],
    'tiktok-downloader-safe': ['Es wurde ein geklonter oder verdächtiger Mirror geöffnet.', 'Ein durch eine Erweiterung eingeschleustes Skript hat das Ziel verändert.', 'Eine TLS-Warnung auf einer nicht vertrauenswürdigen Domain wurde ignoriert.'],
    'tiktok-vídeo-downloader-free': ['Der kostenlose Endpunkt hat vorübergehend die Quotenobergrenze erreicht.', 'Mehrere schnelle Wiederholungen haben eine Anti-Missbrauchs-Abkühlphase ausgelöst.', 'Der öffentliche CDN-Pfad hat sich während der Anfrage geändert.'],
    'tiktok-vídeo-download-private': ['Inhalte privater Konten sind nicht öffentlich zugänglich.', 'Vor dem Zugriff auf das Medium ist eine Bestätigung zum Folgen erforderlich.', 'Die Berechtigung hat sich zwischen Kopieren und Extraktion geändert.'],
    'tiktok-save-visible-ja': ['Viele verwechseln Aufrufzahlen mit lokalem Speichern.', 'Die Plattform kann Interaktionen anzeigen, aber keine Downloads auf dem Gerät nachweisen.', 'Eine Wiederveröffentlichung kann Kontoaktivität offenlegen.'],
    'how-to-save-tiktok-without-watermark': ['Für diesen Beitrag ist keine Variante ohne Wasserzeichen verfügbar.', 'Der ausgewählte Link verweist auf eine Slideshow.', 'Ein Drittanbieter-Blocker hat erforderliche Header entfernt.'],
    'tiktok-vídeo-downloader-2026': ['Der Plattform-Endpunkt wurde geändert und der Cache ist veraltet.', 'Eine neue Anti-Missbrauchs-Schwelle blockiert Anfragen vorübergehend.', 'Der alte Extraktionspfad wurde eingestellt.'],
    'tiktok-vídeo-link-download': ['Der Link verweist auf einen Kanal oder die Startseite, nicht auf einen konkreten Beitrag.', 'Die Kurz-URL wurde nicht bis zur endgültigen Zieladresse erweitert.', 'Ein Tracking-Fragment hat die Normalisierung des Parsers gestört.'],
  };

  const tr: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['Orijinal videoda zaten gömülü bir filigran bulunuyor.', 'Seçilen varyant filigranlı akışa geri düştü.', 'Gönderi kısıtlı dağıtım moduna geçti.'],
    'tiktok-downloader-without-watermark-online': ['Paylaşılan bağlantı videoya değil profile gidiyor.', 'Bir anti-bot doğrulaması medya çekimini kesti.', 'Bölgesel düğüm medya için geçici 403 döndürdü.'],
    'tiktok-vídeo-save-method-ja': ['Kısa bağlantı, son URL çözülmeden kopyalandı.', 'Yeniden paylaşım düzenlemesinden sonra video değiştirildi.', 'Seçilen gönderi video değil, görsel karuseli.'],
    'tiktok-vídeo-save-not-working-ja': ['Gönderi kaldırıldı ya da gizliye alındı.', 'Bağlantı kopyalandıktan sonra hesabın görünürlüğü değişti.', 'Geçici platform sınırlaması çıkarma işlemini engelledi.'],
    'download-tiktok-vídeo-hd': ['Bu yükleme için HD varyantı yok.', 'Kaynak video zaten düşük çözünürlüklüydü.', 'Ağ uyarlaması daha düşük bit hızlı akışı seçti.'],
    'tiktok-download-mp4': ['Bu gönderi yalnızca parçalı akış sunuyor.', 'MP4 birleştirme adımı geçici zaman aşımı nedeniyle başarısız oldu.', 'Seçilen kalite doğrudan MP4 varyantı sunmuyor.'],
    'save-tiktok-vídeo-iphone': ['Uygulama içi tarayıcı gerekli parametreleri kaldırdı.', 'iPhone yalnızca önizleme URL’sini kopyaladı.', 'Arka plan görevi düşük güç modu nedeniyle durduruldu.'],
    'tiktok-vídeo-download-android': ['Android intent hatalı biçimlenmiş bir URL verdi.', 'WebView medyanın yönlendirme zincirini engelledi.', 'Pil optimizasyonu çıkarma görevini duraklattı.'],
    'tiktok-downloader-safe': ['Klonlanmış ya da şüpheli bir ayna site açıldı.', 'Bir eklenti tarafından eklenen betik hedefi değiştirdi.', 'Güvenilmeyen bir alan adındaki TLS uyarısı göz ardı edildi.'],
    'tiktok-vídeo-downloader-free': ['Ücretsiz uç nokta geçici kota sınırına ulaştı.', 'Arka arkaya denemeler anti-kötüye-kullanım bekleme süresini tetikledi.', 'İstek sırasında genel CDN yolu değişti.'],
    'tiktok-vídeo-download-private': ['Özel hesap içerikleri herkese açık değildir.', 'Medyaya erişmeden önce hesabı takip etmek için onay gerekir.', 'İzin durumu kopyalama ile çıkarma arasında değişti.'],
    'tiktok-save-visible-ja': ['Birçok kişi izlenme sayılarını yerel kayıtla karıştırır.', 'Platform etkileşimi gösterebilir ama cihazdaki indirmeleri göstermez.', 'Yeniden paylaşım hesap etkinliğini görünür kılabilir.'],
    'how-to-save-tiktok-without-watermark': ['Bu gönderi için filigransız varyant mevcut değil.', 'Seçilen bağlantı bir slayt gösterisine gidiyor.', 'Bir üçüncü taraf engelleyici gerekli başlıkları kaldırdı.'],
    'tiktok-vídeo-downloader-2026': ['Platform uç noktası değişti ve önbellek eskidi.', 'Yeni bir anti-kötüye-kullanım eşiği istekleri geçici olarak engelliyor.', 'Eski çıkarma yolu kullanımdan kaldırıldı.'],
    'tiktok-vídeo-link-download': ['Bağlantı belirli bir gönderiye değil, kanala veya ana sayfaya gidiyor.', 'Kısa URL son hedefe kadar genişletilmedi.', 'Bir takip parçası çözücünün normalizasyonunu bozdu.'],
  };

  const id: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['Video asli sudah memiliki watermark bawaan.', 'Varian yang dipilih jatuh ke stream yang masih memakai watermark.', 'Postingan berubah ke mode distribusi terbatas.'],
    'tiktok-downloader-without-watermark-online': ['Tautan yang dibagikan mengarah ke profil, bukan ke videonya.', 'Pemeriksaan anti-bot memutus proses pengambilan media.', 'Node regional mengembalikan 403 sementara untuk media tersebut.'],
    'tiktok-vídeo-save-method-ja': ['Tautan pendek disalin tanpa menyelesaikan URL akhirnya.', 'Video diganti setelah repost yang telah diedit.', 'Postingan yang dipilih adalah carousel gambar, bukan video.'],
    'tiktok-vídeo-save-not-working-ja': ['Postingan dihapus atau diubah menjadi privat.', 'Visibilitas akun berubah setelah tautan disalin.', 'Pembatasan platform sementara memblokir ekstraksi.'],
    'download-tiktok-vídeo-hd': ['Tidak ada varian HD untuk unggahan ini.', 'Video sumber memang sudah beresolusi rendah.', 'Penyesuaian jaringan memilih stream dengan bitrate lebih rendah.'],
    'tiktok-download-mp4': ['Postingan ini hanya menyediakan stream tersegmentasi.', 'Langkah mux ke MP4 gagal karena timeout sementara.', 'Kualitas yang dipilih tidak menyediakan varian MP4 langsung.'],
    'save-tiktok-vídeo-iphone': ['Browser di dalam aplikasi menghapus parameter yang dibutuhkan.', 'iPhone hanya menyalin URL pratinjau.', 'Tugas di latar belakang dijeda oleh mode hemat daya.'],
    'tiktok-vídeo-download-android': ['Intent Android menghasilkan URL yang formatnya rusak.', 'WebView memblokir rantai pengalihan medianya.', 'Optimasi baterai menjeda tugas ekstraksi.'],
    'tiktok-downloader-safe': ['Pengguna membuka mirror tiruan atau situs yang mencurigakan.', 'Skrip yang disisipkan oleh ekstensi mengubah tujuan akhir.', 'Peringatan TLS pada domain yang tidak tepercaya diabaikan.'],
    'tiktok-vídeo-downloader-free': ['Endpoint gratis mencapai batas kuota sementara.', 'Percobaan berulang dalam waktu singkat memicu masa pendinginan anti-abuse.', 'Jalur CDN publik berubah saat permintaan berlangsung.'],
    'tiktok-vídeo-download-private': ['Konten dari akun privat tidak bisa diakses secara publik.', 'Persetujuan follow diperlukan sebelum media bisa diakses.', 'Izin berubah di antara penyalinan tautan dan ekstraksi.'],
    'tiktok-save-visible-ja': ['Pengguna sering mencampuradukkan metrik tayangan dengan penyimpanan lokal.', 'Platform dapat menampilkan engagement, bukan unduhan di perangkat.', 'Aktivitas re-share dapat mengekspos tindakan akun.'],
    'how-to-save-tiktok-without-watermark': ['Varian tanpa watermark tidak tersedia untuk postingan ini.', 'Tautan yang dipilih mengarah ke konten slideshow.', 'Pemblokir pihak ketiga menghapus header permintaan yang dibutuhkan.'],
    'tiktok-vídeo-downloader-2026': ['Endpoint platform berubah dan cache sudah usang.', 'Ambang anti-abuse yang baru memblokir permintaan untuk sementara.', 'Jalur ekstraksi lama sudah ditinggalkan.'],
    'tiktok-vídeo-link-download': ['Tautan mengarah ke kanal atau beranda, bukan ke postingan tertentu.', 'URL pendek tidak diperluas hingga ke URL media akhir.', 'Fragmen pelacakan merusak normalisasi parser.'],
  };

  const hi: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['Original वीडियो में पहले से watermark लगा हुआ है।', 'चुना गया variant watermark वाले stream पर वापस गिर गया।', 'Post restricted distribution mode में चला गया।'],
    'tiktok-downloader-without-watermark-online': ['Share किया गया link वीडियो की जगह profile पर जा रहा है।', 'Anti-bot challenge ने media fetch बीच में रोक दिया।', 'Regional node ने media के लिए temporary 403 लौटाया।'],
    'tiktok-vídeo-save-method-ja': ['Short link कॉपी हुई, लेकिन final URL resolve नहीं हुई।', 'Edited repost के बाद वीडियो बदल दिया गया।', 'चुनी गई post वीडियो नहीं, image carousel है।'],
    'tiktok-vídeo-save-not-working-ja': ['Post delete हो गई या private कर दी गई।', 'Link कॉपी होने के बाद account visibility बदल गई।', 'Temporary platform limit ने extraction रोक दी।'],
    'download-tiktok-vídeo-hd': ['इस upload के लिए HD variant उपलब्ध नहीं है।', 'Source वीडियो पहले से low resolution में था।', 'Network adaptation ने कम bitrate वाला stream चुना।'],
    'tiktok-download-mp4': ['यह post सिर्फ segmented stream देती है।', 'MP4 mux step temporary timeout की वजह से fail हो गया।', 'चुनी हुई quality में direct MP4 variant उपलब्ध नहीं है।'],
    'save-tiktok-vídeo-iphone': ['In-app browser ने ज़रूरी parameters हटा दिए।', 'iPhone ने सिर्फ preview URL कॉपी की।', 'Background task low-power mode की वजह से pause हो गई।'],
    'tiktok-vídeo-download-android': ['Android intent ने malformed URL दी।', 'WebView ने media redirect chain block कर दी।', 'Battery optimization ने extraction task रोक दी।'],
    'tiktok-downloader-safe': ['यूज़र ने cloned या suspicious mirror खोल लिया।', 'Extension से inject हुआ script destination बदल रहा है।', 'Untrusted domain पर TLS warning को नज़रअंदाज़ कर दिया गया।'],
    'tiktok-vídeo-downloader-free': ['Free endpoint temporary quota ceiling तक पहुँच गया।', 'बार-बार retry करने से anti-abuse cooldown trigger हो गया।', 'Request के दौरान public CDN path बदल गया।'],
    'tiktok-vídeo-download-private': ['Private account का content publicly accessible नहीं है।', 'Media access से पहले follow approval ज़रूरी है।', 'Copy और extraction के बीच permission बदल गई।'],
    'tiktok-save-visible-ja': ['यूज़र views metrics और local saves को एक जैसा समझ रहा है।', 'Platform engagement दिखा सकती है, device download नहीं।', 'Re-share activity से account actions दिखाई दे सकती हैं।'],
    'how-to-save-tiktok-without-watermark': ['इस post के लिए no-watermark variant उपलब्ध नहीं है।', 'चुना गया link slideshow content पर जा रहा है।', 'Third-party blocker ने ज़रूरी request headers हटा दिए।'],
    'tiktok-vídeo-downloader-2026': ['Platform endpoint बदल गया और cache पुराना हो चुका है।', 'नया anti-abuse threshold temporary requests block कर रहा है।', 'पुराना extraction route अब deprecated है।'],
    'tiktok-vídeo-link-download': ['Link किसी specific post की जगह channel या home पर जा रहा है।', 'Short URL final media URL तक expand नहीं हुई।', 'Tracking fragment ने parser normalization तोड़ दी।'],
  };

  const pt: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['O vídeo original já traz a marca d’água incorporada.', 'A variante escolhida caiu em uma versão com marca.', 'A publicação passou para um modo de distribuição restrita.'],
    'tiktok-downloader-without-watermark-online': ['O link compartilhado aponta para o perfil, não para o vídeo.', 'O desafio anti-bot interrompeu a busca da mídia.', 'A borda regional retornou 403 temporário para a mídia.'],
    'tiktok-vídeo-save-method-ja': ['Foi copiado um link curto sem resolver a URL final.', 'O vídeo foi substituído depois de uma edição de republicação.', 'A publicação selecionada é um carrossel de imagens, não um vídeo.'],
    'tiktok-vídeo-save-not-working-ja': ['A publicação foi removida ou ficou privada.', 'A visibilidade da conta mudou depois da cópia do link.', 'Um limite temporário da plataforma bloqueou a extração.'],
    'download-tiktok-vídeo-hd': ['Não existe variante HD para esse upload.', 'O vídeo de origem ja era de baixa resolução.', 'A adaptacao de banda escolheu um fluxo com bitrate menor.'],
    'tiktok-download-mp4': ['Essa publicação expõe apenas um fluxo segmentado.', 'A etapa de mux para MP4 falhou por timeout temporário.', 'A qualidade escolhida não oferece uma variante MP4 direta.'],
    'save-tiktok-vídeo-iphone': ['O navegador interno do app removeu parâmetros necessários.', 'O iPhone copiou apenas a URL de visualização.', 'A tarefa em segundo plano foi pausada pelo modo de economia.'],
    'tiktok-vídeo-download-android': ['O intent do Android entregou uma URL malformada.', 'O WebView bloqueou a cadeia de redirecionamento da mídia.', 'A otimização de bateria pausou a tarefa de extração.'],
    'tiktok-downloader-safe': ['Foi aberto um espelho clonado ou suspeito.', 'Um script injetado por extensão mudou o destino.', 'Um aviso de TLS em um domínio não confiável foi ignorado.'],
    'tiktok-vídeo-downloader-free': ['O endpoint gratuito atingiu um limite temporário de cota.', 'Várias tentativas seguidas ativaram um período de resfriamento antiabuso.', 'A rota pública do CDN mudou durante a requisição.'],
    'tiktok-vídeo-download-private': ['O conteúdo de uma conta privada não fica acessível publicamente.', 'É necessária aprovação para seguir a conta antes do acesso.', 'A permissão mudou entre a cópia do link e a extração.'],
    'tiktok-save-visible-ja': ['Muita gente confunde métricas de visualização com salvamento local.', 'A plataforma pode mostrar engajamento, mas não os downloads do aparelho.', 'Uma republicação pode expor atividade da conta.'],
    'how-to-save-tiktok-without-watermark': ['A variante sem marca não está disponível para essa publicação.', 'O link selecionado aponta para um slideshow.', 'Um bloqueador de terceiros removeu cabeçalhos exigidos.'],
    'tiktok-vídeo-downloader-2026': ['O endpoint da plataforma mudou e o cache ficou defasado.', 'Um novo limite antiabuso bloqueou as requisições temporariamente.', 'A rota antiga de extração foi descontinuada.'],
    'tiktok-vídeo-link-download': ['O link aponta para um canal ou para a página inicial, não para uma publicação específica.', 'A URL curta não foi expandida até o destino final.', 'Um fragmento de rastreamento atrapalhou a normalização do parser.'],
  };

  const ar: Record<string, string[]> = {
    'tiktok-vídeo-download-no-watermark': ['الفيديو يحتوي علامة مائية من المصدر.', 'النسخة المختارة عادت لمسار بعلامة.', 'تم تقييد توزيع المنشور.'],
    'tiktok-downloader-without-watermark-online': ['الرابط يشير للملف الشخصي لا الفيديو.', 'اختبار مكافحة البوت أوقف الطلب.', 'عقدة المنطقة أعادت 403 مؤقتًا.'],
    'tiktok-vídeo-save-method-ja': ['تم نسخ رابط قصير دون حل الرابط النهائي.', 'تم تعديل الفيديو بعد إعادة النشر.', 'المنشور عبارة عن صور وليس فيديو.'],
    'tiktok-vídeo-save-not-working-ja': ['تم حذف المنشور أو جعله خاصًا.', 'تغيّرت رؤية الحساب بعد النسخ.', 'حد مؤقت من المنصة منع الاستخراج.'],
    'download-tiktok-vídeo-hd': ['نسخة HD غير متاحة لهذا الفيديو.', 'المصدر الأصلي منخفض الدقة.', 'التكيّف الشبكي اختار معدل أقل.'],
    'tiktok-download-mp4': ['المنشور يوفّر بثًا مقسمًا فقط.', 'فشل تحويل MP4 بسبب مهلة.', 'الجودة المختارة بلا رابط MP4 مباشر.'],
    'save-tiktok-vídeo-iphone': ['متصفح التطبيق حذف معاملات مطلوبة.', 'iOS نسخ رابط المعاينة فقط.', 'توفير الطاقة أوقف المهمة بالخلفية.'],
    'tiktok-vídeo-download-android': ['رابط Android وصل بترميز خاطئ.', 'WebView حجب سلسلة التحويل.', 'توفير البطارية أوقف الاستخراج.'],
    'tiktok-downloader-safe': ['تم فتح نسخة مزيّفة للموقع.', 'إضافة متصفح غيّرت وجهة السكربت.', 'تم تجاهل تحذير TLS لنطاق غير موثوق.'],
    'tiktok-vídeo-downloader-free': ['نسخة free وصلت حد الحصة المؤقت.', 'تكرار الطلبات فعّل فترة تبريد.', 'مسار CDN تغيّر أثناء الطلب.'],
    'tiktok-vídeo-download-private': ['المحتوى الخاص غير متاح للعامة.', 'يلزم قبول المتابعة للوصول.', 'تغيّرت الصلاحية بين النسخ والاستخراج.'],
    'tiktok-save-visible-ja': ['تم الخلط بين المشاهدات والحفظ المحلي.', 'المنصة تعرض التفاعل لا التنزيل.', 'إعادة المشاركة قد تُظهر النشاط.'],
    'how-to-save-tiktok-without-watermark': ['لا توجد نسخة بدون علامة لهذا المنشور.', 'الرابط يخص عرض شرائح لا فيديو.', 'مانع خارجي حذف ترويسات مطلوبة.'],
    'tiktok-vídeo-downloader-2026': ['تغيّر مسار المنصة والكاش قديم.', 'حدود مكافحة الإساءة الجديدة فعّالة.', 'مسار الاستخراج القديم لم يعد صالحًا.'],
    'tiktok-vídeo-link-download': ['الرابط لا يشير إلى منشور محدد.', 'الرابط القصير لم يُوسّع للنهاية.', 'جزء تتبع أفسد تحليل الرابط.'],
  };

  if (locale === 'ja') return ja[slug] || null;
  if (locale === 'es') return es[slug] || null;
  if (locale === 'pt') return pt[slug] || null;
  if (locale === 'fr') return fr[slug] || null;
  if (locale === 'de') return de[slug] || null;
  if (locale === 'tr') return tr[slug] || null;
  if (locale === 'id') return id[slug] || null;
  if (locale === 'hi') return hi[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function comparisonSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Comparison used outdated tool versions.', 'No clear reliability criteria was applied.', 'Test links were not identical across tools.'],
    'best-tiktok-downloader-without-watermark': ['Test mixed no-watermark and standard outputs.', 'Quality score ignored source bitrate.', 'Safety checks were skipped for one candidate.'],
    'safest-vídeo-downloader-sites': ['Policy pages were missing at evaluation time.', 'No domain trust check was performed.', 'Ad-behavior risk was not weighted.'],
    'twitter-vídeo-downloader-not-working': ['Root cause mixed network and platform errors.', 'No retry policy in troubleshooting steps.', 'Users tested with invalid tweet URLs.'],
    'tiktok-downloader-not-working': ['No distinction between private and public posts.', 'Rate-limit symptoms were misread as bugs.', 'Local browser extensions were not isolated.'],
    'telegram-vídeo-download-not-working': ['Private chat links were tested as public.', 'Channel access rules were ignored.', 'CDN timeout and permission errors were merged.'],
    'is-vídeo-downloader-legal': ['Jurisdiction differences were not separated.', 'Personal archive vs redistribution was mixed.', 'Platform ToS was not mapped to use case.'],
    'vídeo-downloader-safe-or-not': ['Security criteria omitted script provenance.', 'No malware/adware reputation checks.', 'No HTTPS/TLS validation in checklist.'],
    'free-vídeo-downloader-online-comparison': ['Free-tier limits were not normalized.', 'Ad load impact was not measured.', 'Speed tests ran on inconsistent networks.'],
    'top-5-vídeo-downloader-tools': ['Ranking factors were undefined.', 'Scoring weights changed during review.', 'No reproducible test protocol was provided.'],
  };

  const ja: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['比較時に古いツール版を使っていました。', '信頼性を判断する基準が明確ではありませんでした。', '各ツールで同じテスト用リンクを使っていませんでした。'],
    'best-tiktok-downloader-without-watermark': ['透かしありと透かしなしの結果を同じ比較に混ぜていました。', '画質評価で元動画の bitrate を見ていませんでした。', '候補のひとつで安全性チェックが省略されていました。'],
    'safest-vídeo-downloader-sites': ['評価時点でポリシーページが用意されていませんでした。', 'ドメイン信頼性の確認が行われていませんでした。', '広告挙動のリスクが十分に加味されていませんでした。'],
    'twitter-vídeo-downloader-not-working': ['原因分析でネットワーク要因とプラットフォーム要因が混ざっていました。', 'トラブルシュート手順に再試行ポリシーがありませんでした。', '無効な投稿 URL のまま検証していました。'],
    'tiktok-downloader-not-working': ['公開投稿と非公開投稿を分けて見ていませんでした。', 'rate limit の症状を不具合と誤認していました。', 'ローカルのブラウザ拡張を切り分けていませんでした。'],
    'telegram-vídeo-download-not-working': ['非公開チャットのリンクを公開リンクのように扱っていました。', 'チャンネルのアクセス条件を考慮していませんでした。', 'CDN の timeout と権限エラーをひとまとめにしていました。'],
    'is-vídeo-downloader-legal': ['法域ごとの差を切り分けていませんでした。', '個人保存と再配布を同じ前提で扱っていました。', 'プラットフォーム規約を利用ケースに結び付けていませんでした。'],
    'vídeo-downloader-safe-or-not': ['安全性の基準にスクリプトの出所確認がありませんでした。', 'malware / adware の評判確認が行われていませんでした。', 'チェックリストに HTTPS/TLS の確認が入っていませんでした。'],
    'free-vídeo-downloader-online-comparison': ['無料プランの制限を同じ条件で比較していませんでした。', '広告量の影響を測定していませんでした。', '速度比較がばらばらなネットワーク環境で行われていました。'],
    'top-5-vídeo-downloader-tools': ['ランキング要素が定義されていませんでした。', 'レビュー途中で配点の重みが変わっていました。', '再現できるテスト手順が示されていませんでした。'],
  };

  const es: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Se compararon versiones desactualizadas.', 'Faltaron critérios claros de fiabilidad.', 'No se usaron enlaces idénticos para pruebas.'],
    'best-tiktok-downloader-without-watermark': ['Se mezclaron salidas con y sin marca.', 'La calidad ignoró bitrate de origen.', 'Se omitió validación de seguridad en un candidato.'],
    'safest-vídeo-downloader-sites': ['Faltaban páginas de política al evaluar.', 'No hubo revisión de confianza de dominio.', 'No se ponderó el riesgo publicitario.'],
    'twitter-vídeo-downloader-not-working': ['Se mezclaron fallos de red y plataforma.', 'No había política de reintento.', 'Se probaron URLs inválidas de tweet.'],
    'tiktok-downloader-not-working': ['No se separó privado vs público.', 'Rate-limit se interpretó como bug.', 'No se aisló el impacto de extensiones.'],
    'telegram-vídeo-download-not-working': ['Se probó enlace privado como si fuera público.', 'Se ignoraron reglas de acceso del canal.', 'Timeout CDN y permisos se mezclaron.'],
    'is-vídeo-downloader-legal': ['No se separó por jurisdicción.', 'Archivo personal y redistribución se mezclaron.', 'No se mapeó ToS al caso de uso.'],
    'vídeo-downloader-safe-or-not': ['Faltó revisar procedencia de scripts.', 'Sin chequeos de reputación malware/adware.', 'Sin validación HTTPS/TLS en la lista.'],
    'free-vídeo-downloader-online-comparison': ['No se normalizaron límites de planes free.', 'No se midió impacto de carga de anuncios.', 'Pruebas de velocidad con redes distintas.'],
    'top-5-vídeo-downloader-tools': ['Factores de ranking no definidos.', 'Pesos cambiaron durante revisión.', 'Sin protocolo reproducible de prueba.'],
  };

  const fr: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['La comparaison s’est appuyée sur des versions d’outils dépassées.', 'Aucun critère clair de fiabilité n’a été appliqué.', 'Les mêmes liens de test n’ont pas été utilisés sur tous les outils.'],
    'best-tiktok-downloader-without-watermark': ['Les tests ont mélangé des sorties avec et sans filigrane.', 'La note de qualité a ignoré le bitrate du fichier d’origine.', 'L’une des options n’a pas fait l’objet d’une vérification complète de sécurité.'],
    'safest-vídeo-downloader-sites': ['Des pages de politique manquaient au moment de l’évaluation.', 'Aucune vérification de confiance du domaine n’a été effectuée.', 'Le risque lié au comportement publicitaire n’a pas été assez pondéré.'],
    'twitter-vídeo-downloader-not-working': ['La cause racine a mélangé un problème réseau et un problème de plateforme.', 'Aucune politique de nouvelle tentative n’était prévue dans le flux de résolution.', 'Des liens de publication invalides ont été utilisés pendant les tests.'],
    'tiktok-downloader-not-working': ['Aucune séparation claire n’a été faite entre publications publiques et privées.', 'Des signes de limitation de débit ont été interprétés comme un bug.', 'Les extensions locales du navigateur n’ont pas été isolées.'],
    'telegram-vídeo-download-not-working': ['Des liens de chat privé ont été testés comme s’ils étaient publics.', 'Les règles d’accès du canal ont été ignorées.', 'Les erreurs de timeout du CDN et les erreurs de permission ont été mélangées.'],
    'is-vídeo-downloader-legal': ['Les différences de juridiction n’ont pas été séparées.', 'L’archive personnelle et la redistribution ont été traitées comme la même chose.', 'Les conditions de la plateforme n’ont pas été reliées au cas d’usage.'],
    'vídeo-downloader-safe-or-not': ['Les critères de sécurité n’ont pas vérifié la provenance des scripts.', 'Aucune vérification de réputation contre les malwares ou adwares n’a été faite.', 'La liste ne comprenait pas de validation HTTPS/TLS.'],
    'free-vídeo-downloader-online-comparison': ['Les limites des versions gratuites n’ont pas été normalisées.', 'L’impact de la charge publicitaire n’a pas été mesuré.', 'Les tests de vitesse ont été menés sur des réseaux incohérents.'],
    'top-5-vídeo-downloader-tools': ['Les critères de classement n’étaient pas définis.', 'Les pondérations de score ont changé pendant l’analyse.', 'Aucun protocole de test reproductible n’a été présenté.'],
  };
  const de: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Beim Vergleich wurden veraltete Tool-Versionen verwendet.', 'Es gab kein klares Kriterium für Zuverlässigkeit.', 'Für die Tests wurden nicht überall identische Links benutzt.'],
    'best-tiktok-downloader-without-watermark': ['Die Tests haben Ausgaben mit und ohne Wasserzeichen vermischt.', 'Die Qualitätsbewertung hat die Bitrate der Quelldatei ignoriert.', 'Bei einer Option wurde die Sicherheitsprüfung ausgelassen.'],
    'safest-vídeo-downloader-sites': ['Zum Zeitpunkt der Bewertung fehlten Richtlinienseiten.', 'Es wurde keine Vertrauensprüfung der Domain durchgeführt.', 'Das Risiko durch Werbeverhalten wurde nicht ausreichend gewichtet.'],
    'twitter-vídeo-downloader-not-working': ['Die Ursachenanalyse hat Netzwerk- und Plattformfehler vermischt.', 'Im Lösungsablauf gab es keine klare Retry-Strategie.', 'In den Tests wurden ungültige Beitragslinks verwendet.'],
    'tiktok-downloader-not-working': ['Öffentliche und private Beiträge wurden nicht sauber getrennt.', 'Anzeichen für Ratenbegrenzung wurden als Bug interpretiert.', 'Lokale Browser-Erweiterungen wurden nicht isoliert.'],
    'telegram-vídeo-download-not-working': ['Private Chat-Links wurden so getestet, als wären sie öffentlich.', 'Die Zugriffsregeln des Kanals wurden ignoriert.', 'CDN-Timeouts und Berechtigungsfehler wurden zusammengeworfen.'],
    'is-vídeo-downloader-legal': ['Unterschiede zwischen Rechtsräumen wurden nicht getrennt betrachtet.', 'Persönliches Archiv und Weiterverbreitung wurden vermischt.', 'Die Plattformregeln wurden nicht auf den konkreten Anwendungsfall bezogen.'],
    'vídeo-downloader-safe-or-not': ['Die Sicherheitskriterien haben die Herkunft der Skripte nicht geprüft.', 'Es gab keine Reputationsprüfung auf Malware oder Adware.', 'In der Checkliste fehlte eine HTTPS/TLS-Prüfung.'],
    'free-vídeo-downloader-online-comparison': ['Die Grenzen kostenloser Tarife wurden nicht normalisiert.', 'Die Auswirkungen der Werbelast wurden nicht gemessen.', 'Die Geschwindigkeitstests liefen auf uneinheitlichen Netzwerken.'],
    'top-5-vídeo-downloader-tools': ['Die Ranking-Faktoren waren nicht klar definiert.', 'Die Gewichtung der Punkte änderte sich während der Auswertung.', 'Es wurde kein reproduzierbares Testprotokoll vorgelegt.'],
  };

  const tr: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Karşılaştırmada araçların güncel olmayan sürümleri kullanıldı.', 'Güvenilirlik için net bir ölçüt uygulanmadı.', 'Tüm araçlarda aynı test bağlantıları kullanılmadı.'],
    'best-tiktok-downloader-without-watermark': ['Testlerde filigranlı ve filigransız çıktılar karıştırıldı.', 'Kalite puanı kaynak bitrate değerini dikkate almadı.', 'Adaylardan biri için güvenlik kontrolü atlandı.'],
    'safest-vídeo-downloader-sites': ['Değerlendirme sırasında politika sayfaları eksikti.', 'Alan adı güven kontrolü yapılmadı.', 'Reklam davranışı riski yeterince ağırlıklandırılmadı.'],
    'twitter-vídeo-downloader-not-working': ['Kök neden analizi ağ ve platform hatalarını birbirine karıştırdı.', 'Sorun giderme akışında yeniden deneme politikası yoktu.', 'Testlerde geçersiz gönderi bağlantıları kullanıldı.'],
    'tiktok-downloader-not-working': ['Herkese açık ve özel gönderiler net biçimde ayrılmadı.', 'İstek sınırı belirtileri hata gibi yorumlandı.', 'Yerel tarayıcı eklentileri izole edilmedi.'],
    'telegram-vídeo-download-not-working': ['Özel sohbet bağlantıları herkese açıkmış gibi test edildi.', 'Kanal erişim kuralları göz ardı edildi.', 'CDN zaman aşımı ile izin hataları aynı başlık altında toplandı.'],
    'is-vídeo-downloader-legal': ['Yargı alanı farkları ayrıştırılmadı.', 'Kişisel arşiv ile yeniden dağıtım aynı şey gibi ele alındı.', 'Platform şartları kullanım senaryosuna eşlenmedi.'],
    'vídeo-downloader-safe-or-not': ['Güvenlik ölçütleri betik kaynağını doğrulamadı.', 'Kötü amaçlı yazılım veya reklam yazılımı itibarı kontrol edilmedi.', 'Kontrol listesinde HTTPS/TLS doğrulaması yoktu.'],
    'free-vídeo-downloader-online-comparison': ['Ücretsiz katman sınırları normalleştirilmedi.', 'Reklam yükünün etkisi ölçülmedi.', 'Hız testleri tutarsız ağlarda yapıldı.'],
    'top-5-vídeo-downloader-tools': ['Sıralama ölçütleri tanımlanmadı.', 'Puan ağırlıkları inceleme sırasında değişti.', 'Tekrarlanabilir bir test protokolü sunulmadı.'],
  };

  const id: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Perbandingan memakai versi alat yang sudah usang.', 'Tidak ada kriteria keandalan yang jelas.', 'Tautan uji yang dipakai tidak konsisten di semua alat.'],
    'best-tiktok-downloader-without-watermark': ['Pengujian mencampur keluaran tanpa watermark dan keluaran standar.', 'Skor kualitas mengabaikan bitrate sumber.', 'Pemeriksaan keamanan dilewati pada salah satu kandidat.'],
    'safest-vídeo-downloader-sites': ['Halaman kebijakan tidak tersedia saat evaluasi dilakukan.', 'Tidak ada pemeriksaan kepercayaan domain.', 'Risiko dari perilaku iklan tidak diberi bobot yang cukup.'],
    'twitter-vídeo-downloader-not-working': ['Akar masalah mencampur error jaringan dan error platform.', 'Tidak ada kebijakan retry di langkah pemecahan masalah.', 'Pengguna menguji dengan URL tweet yang tidak valid.'],
    'tiktok-downloader-not-working': ['Tidak ada pemisahan yang jelas antara postingan privat dan publik.', 'Gejala rate limit salah dibaca sebagai bug.', 'Ekstensi browser lokal tidak diisolasi.'],
    'telegram-vídeo-download-not-working': ['Tautan chat privat diuji seolah-olah publik.', 'Aturan akses kanal diabaikan.', 'Error timeout CDN dan error izin digabungkan.'],
    'is-vídeo-downloader-legal': ['Perbedaan yurisdiksi tidak dipisahkan.', 'Arsip pribadi dan redistribusi diperlakukan sebagai hal yang sama.', 'Ketentuan platform tidak dipetakan ke kasus penggunaan.'],
    'vídeo-downloader-safe-or-not': ['Kriteria keamanan tidak memeriksa asal skrip.', 'Tidak ada pemeriksaan reputasi malware atau adware.', 'Tidak ada validasi HTTPS/TLS di daftar periksa.'],
    'free-vídeo-downloader-online-comparison': ['Batas paket gratis tidak dinormalisasi.', 'Dampak beban iklan tidak diukur.', 'Uji kecepatan dijalankan pada jaringan yang tidak konsisten.'],
    'top-5-vídeo-downloader-tools': ['Faktor peringkat tidak didefinisikan.', 'Bobot penilaian berubah selama ulasan berlangsung.', 'Tidak ada protokol pengujian yang bisa direproduksi.'],
  };

  const hi: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['Comparison में tools के पुराने versions इस्तेमाल किए गए।', 'Reliability के लिए कोई स्पष्ट मानदंड लागू नहीं किया गया।', 'हर tool पर एक जैसे test links इस्तेमाल नहीं हुए।'],
    'best-tiktok-downloader-without-watermark': ['Test में no-watermark और standard outputs को मिला दिया गया।', 'Quality score ने source bitrate को नज़रअंदाज़ किया।', 'एक candidate पर safety checks छोड़ दी गईं।'],
    'safest-vídeo-downloader-sites': ['Evaluation के समय policy pages उपलब्ध नहीं थीं।', 'Domain trust check नहीं किया गया।', 'Ad behavior risk को पर्याप्त weight नहीं दिया गया।'],
    'twitter-vídeo-downloader-not-working': ['Root cause analysis में network और platform errors मिल गए।', 'Troubleshooting steps में retry policy नहीं थी।', 'Users ने invalid tweet URLs के साथ test किया।'],
    'tiktok-downloader-not-working': ['Private और public posts के बीच स्पष्ट अंतर नहीं किया गया।', 'Rate-limit के संकेतों को bug समझ लिया गया।', 'Local browser extensions को isolate नहीं किया गया।'],
    'telegram-vídeo-download-not-working': ['Private chat links को public मानकर test किया गया।', 'Channel access rules को नज़रअंदाज़ किया गया।', 'CDN timeout और permission errors को एक साथ मिला दिया गया।'],
    'is-vídeo-downloader-legal': ['Jurisdiction के फर्क अलग नहीं किए गए।', 'Personal archive और redistribution को एक ही चीज़ माना गया।', 'Platform ToS को use case से नहीं जोड़ा गया।'],
    'vídeo-downloader-safe-or-not': ['Security criteria में script provenance की जाँच नहीं थी।', 'Malware या adware reputation checks नहीं किए गए।', 'Checklist में HTTPS/TLS validation शामिल नहीं थी।'],
    'free-vídeo-downloader-online-comparison': ['Free-tier limits को normalize नहीं किया गया।', 'Ad load के प्रभाव को measure नहीं किया गया।', 'Speed tests असंगत networks पर चलाए गए।'],
    'top-5-vídeo-downloader-tools': ['Ranking factors स्पष्ट रूप से परिभाषित नहीं थे।', 'Review के दौरान scoring weights बदलती रहीं।', 'कोई reproducible test protocol पेश नहीं किया गया।'],
  };

  const pt: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['A comparação usou versões desatualizadas das ferramentas.', 'Não houve um critério claro de confiabilidade.', 'Os mesmos links de teste não foram usados em todas as ferramentas.'],
    'best-tiktok-downloader-without-watermark': ['Os testes misturaram saídas com e sem marca d’água.', 'A nota de qualidade ignorou o bitrate do arquivo original.', 'Uma das opções não passou por verificação completa de segurança.'],
    'safest-vídeo-downloader-sites': ['Faltavam páginas de política no momento da avaliação.', 'Não foi feita uma checagem de confiança do domínio.', 'O risco do comportamento publicitário não recebeu peso suficiente.'],
    'twitter-vídeo-downloader-not-working': ['A causa raiz misturou erro de rede com erro da plataforma.', 'Não havia política de nova tentativa no fluxo de solução.', 'Foram usados links de publicação inválidos nos testes.'],
    'tiktok-downloader-not-working': ['Não houve separação entre publicações públicas e privadas.', 'Sintomas de rate limit foram interpretados como bug.', 'Extensões locais do navegador não foram isoladas.'],
    'telegram-vídeo-download-not-working': ['Links de chat privado foram testados como se fossem públicos.', 'As regras de acesso do canal foram ignoradas.', 'Erros de timeout do CDN e erros de permissão foram misturados.'],
    'is-vídeo-downloader-legal': ['As diferenças de jurisdição não foram separadas.', 'Arquivo pessoal e redistribuição foram tratados como a mesma coisa.', 'Os termos da plataforma não foram ligados ao caso de uso.'],
    'vídeo-downloader-safe-or-not': ['Os critérios de segurança não verificaram a procedência dos scripts.', 'Não houve checagem de reputação para malware ou adware.', 'A lista não incluía validação de HTTPS/TLS.'],
    'free-vídeo-downloader-online-comparison': ['Os limites das versões gratuitas não foram normalizados.', 'O impacto da carga de anúncios não foi medido.', 'Os testes de velocidade foram feitos em redes inconsistentes.'],
    'top-5-vídeo-downloader-tools': ['Os critérios de ranking não estavam definidos.', 'Os pesos de pontuação mudaram durante a análise.', 'Não foi apresentado um protocolo de teste reproduzível.'],
  };

  const ar: Record<string, string[]> = {
    'best-twitter-vídeo-downloader-2026': ['تمت المقارنة بإصدارات قديمة.', 'لا توجد معايير ثبات واضحة.', 'لم تُستخدم روابط متطابقة بين الأدوات.'],
    'best-tiktok-downloader-without-watermark': ['تم خلط نتائج بعلامة وبدون علامة.', 'تقييم الجودة تجاهل معدل البت الأصلي.', 'فحوص الأمان لم تُطبق على كل الأدوات.'],
    'safest-vídeo-downloader-sites': ['صفحات السياسات كانت ناقصة وقت التقييم.', 'لم يتم فحص موثوقية النطاق.', 'لم يُحسب خطر الإعلانات بشكل كافٍ.'],
    'twitter-vídeo-downloader-not-working': ['تم خلط أخطاء الشبكة والمنصة.', 'لا توجد سياسة إعادة محاولة.', 'تم الاختبار بروابط تغريدات غير صالحة.'],
    'tiktok-downloader-not-working': ['لم يتم فصل العام عن الخاص.', 'تم تفسير حد الطلبات كخلل.', 'لم يتم عزل تأثير إضافات المتصفح.'],
    'telegram-vídeo-download-not-working': ['تم اختبار روابط خاصة كأنها عامة.', 'تم تجاهل قواعد وصول القناة.', 'تم دمج أخطاء المهلة والصلاحية.'],
    'is-vídeo-downloader-legal': ['لم يتم التفريق حسب الولاية القضائية.', 'تم خلط الأرشفة الشخصية مع إعادة النشر.', 'لم تتم مطابقة شروط المنصة مع الاستخدام.'],
    'vídeo-downloader-safe-or-not': ['معايير الأمان لم تشمل مصدر السكربت.', 'لا فحوص لسمعة البرمجيات الضارة.', 'لا تحقق HTTPS/TLS ضمن القائمة.'],
    'free-vídeo-downloader-online-comparison': ['حدود النسخ المجانية غير موحّدة.', 'تأثير كثافة الإعلانات غير مقاس.', 'اختبارات السرعة على شبكات مختلفة.'],
    'top-5-vídeo-downloader-tools': ['عوامل الترتيب غير محددة.', 'أوزان التقييم تغيّرت أثناء المراجعة.', 'لا يوجد بروتوكول اختبار قابل للتكرار.'],
  };

  if (locale === 'ja') return ja[slug] || null;
  if (locale === 'es') return es[slug] || null;
  if (locale === 'pt') return pt[slug] || null;
  if (locale === 'fr') return fr[slug] || null;
  if (locale === 'de') return de[slug] || null;
  if (locale === 'tr') return tr[slug] || null;
  if (locale === 'id') return id[slug] || null;
  if (locale === 'hi') return hi[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function comparisonCriteria(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['الموثوقية: ثبات الاستخراج وتكرار النجاح.', 'الأمان: سياسة واضحة واتصال HTTPS وتبعية سكربت معروفة.', 'الجودة: الحفاظ على الدقة والصوت دون فقد غير ضروري.'];
  if (locale === 'ja') return ['信頼性: 抽出が安定していて成功率を再現できること。', '安全性: ポリシーが明確で、HTTPS とスクリプトの出所が確認できること。', '品質: 解像度や音声を不必要に落とさないこと。'];
  if (locale === 'es') return ['Fiabilidad: estabilidad y tasa de éxito repetible.', 'Seguridad: política clara, HTTPS y scripts verificables.', 'Calidad: conservar resolución y audio sin pérdida innecesaria.'];
  if (locale === 'fr') return ['Fiabilité : extraction stable avec un taux de réussite constant.', 'Sécurité : politique claire, HTTPS et origine vérifiable des scripts.', 'Qualité : préserver la résolution et l’audio sans perte inutile.'];
  if (locale === 'de') return ['Zuverlässigkeit: stabile Extraktion mit reproduzierbarer Erfolgsquote.', 'Sicherheit: klare Richtlinien, HTTPS und nachvollziehbare Script-Herkunft.', 'Qualität: Auflösung und Audio ohne unnötigen Verlust bewahren.'];
  if (locale === 'tr') return ['Güvenilirlik: istikrarlı çıkarma ve tekrar edilebilir başarı oranı.', 'Güvenlik: açık politika, HTTPS ve doğrulanabilir betik kaynağı.', 'Kalite: çözünürlük ve sesi gereksiz kayıp olmadan koruma.'];
  if (locale === 'id') return ['Keandalan: ekstraksi yang stabil dengan tingkat keberhasilan yang konsisten.', 'Keamanan: kebijakan yang jelas, HTTPS, dan sumber skrip yang bisa diverifikasi.', 'Kualitas: menjaga resolusi dan audio tanpa penurunan yang tidak perlu.'];
  if (locale === 'hi') return ['विश्वसनीयता: स्थिर एक्सट्रैक्शन और लगातार सफलता दर।', 'सुरक्षा: स्पष्ट नीति, HTTPS और सत्यापित स्क्रिप्ट स्रोत।', 'गुणवत्ता: रिज़ॉल्यूशन और ऑडियो को बिना अनावश्यक गिरावट के बनाए रखना।'];
  return ['Reliability: stable extraction with repeatable success.', 'Safety: clear policy, HTTPS, and verifiable script provenance.', 'Quality: preserve resolution and audio without unnecessary loss.'];
}

function isProblemKeyword(slug: string): boolean {
  return slug.includes('not-working') || slug.includes('save-not-working');
}
function articleFailLines(locale: BlogLocale, slug: string, category: string): string[] {
  if (category === 'telegram') {
    const specific = telegramSpecificFailLines(locale, slug);
    if (specific) return specific;
  }
  if (category === 'twitter') {
    const specific = twitterSpecificFailLines(locale, slug);
    if (specific) return specific;
  }
  if (category === 'tiktok') {
    const specific = tiktokSpecificFailLines(locale, slug);
    if (specific) return specific;
  }
  if (category === 'comparison') {
    const specific = comparisonSpecificFailLines(locale, slug);
    if (specific) return specific;
  }
  return failLines(locale);
}

function articleFaqAnswer(locale: BlogLocale, slug: string, category: string): string {
  if (category === 'telegram') {
    if (locale === 'ar') return `لحل مشكلة ${slug}، تأكد أولًا من أن الرابط عام وصحيح، ثم أعد المحاولة بعد تحديث الصفحة.`;
    if (locale === 'ja') return `${slug} を試す前に、URL が公開投稿の正しいリンクかを確認し、ページを再読み込みしてからもう一度実行してください。`;
    if (locale === 'es') return `Para resolver ${slug}, verifica que la URL sea pública y válida, y vuelve a intentarlo después de recargar la página.`;
    if (locale === 'pt') return `Para resolver ${slug}, confirme primeiro que o link é público e válido e, em seguida, tente novamente depois de recarregar a página.`;
    if (locale === 'fr') return `Pour résoudre ${slug}, vérifiez d’abord que le lien est public et valide, puis réessayez après avoir rechargé la page.`;
    if (locale === 'de') return `Um ${slug} zu lösen, prüfen Sie zuerst, ob der Link öffentlich und gültig ist, und versuchen Sie es nach einem Neuladen der Seite erneut.`;
    if (locale === 'tr') return `${slug} sorununda önce bağlantının herkese açık ve geçerli olduğundan emin olun; ardından sayfayı yenileyip yeniden deneyin.`;
    if (locale === 'id') return `Untuk masalah ${slug}, pastikan dulu tautannya publik dan valid, lalu muat ulang halaman sebelum mencoba lagi.`;
    if (locale === 'hi') return `${slug} समस्या में पहले सुनिश्चित करें कि लिंक सार्वजनिक और वैध है, फिर पेज रीफ्रेश करके दोबारा कोशिश करें।`;
    return `For ${slug}, confirm the URL is public and valid, then retry after a fresh page load.`;
  }
  if (category === 'twitter') {
    if (locale === 'ar') return `لمعالجة ${slug} على X، استخدم رابط التغريدة المباشر وتحقق من حالة الحساب قبل إعادة المحاولة.`;
    if (locale === 'ja') return `X で ${slug} を試す場合は、投稿の直接 URL を使い、再実行前にアカウントや投稿が公開状態かを確認してください。`;
    if (locale === 'es') return `Para ${slug} en X, usa la URL directa del tuit y confirma el estado de la cuenta antes de reintentar.`;
    if (locale === 'pt') return `Para ${slug} no X, use a URL direta da publicação e confirme a visibilidade da conta antes de tentar de novo.`;
    if (locale === 'fr') return `Pour ${slug} sur X, utilisez l’URL directe de la publication et confirmez la visibilité du compte avant de réessayer.`;
    if (locale === 'de') return `Für ${slug} auf X verwenden Sie die direkte Beitrags-URL und prüfen Sie vor dem erneuten Versuch die Sichtbarkeit des Kontos.`;
    if (locale === 'tr') return `X üzerinde ${slug} için doğrudan gönderi bağlantısını kullanın ve yeniden denemeden önce hesabın görünürlüğünü kontrol edin.`;
    if (locale === 'id') return `Untuk ${slug} di X, gunakan tautan postingan langsung dan pastikan visibilitas akun sebelum mencoba lagi.`;
    if (locale === 'hi') return `X पर ${slug} के लिए सीधे पोस्ट लिंक का उपयोग करें और दोबारा कोशिश करने से पहले अकाउंट की विज़िबिलिटी जाँचें।`;
    return `For ${slug} on X, use a direct tweet URL and verify account visibility before retrying.`;
  }
  if (category === 'tiktok') {
    if (locale === 'ar') return `لمعالجة ${slug} على TikTok، استخدم رابط المنشور المباشر وتأكد من أن الفيديو عام قبل إعادة المحاولة.`;
    if (locale === 'ja') return `TikTok で ${slug} が失敗する場合は、動画の直接 URL を使い、投稿が公開状態で残っているかを確認してから再試行してください。`;
    if (locale === 'es') return `Para ${slug} en TikTok, usa la URL directa de la públicación y confirma que el vídeo sea público antes de reintentar.`;
    if (locale === 'pt') return `Se ${slug} falhar no TikTok, use a URL direta da publicação e confirme que o vídeo está público antes de tentar novamente.`;
    if (locale === 'fr') return `Si ${slug} échoue sur TikTok, utilisez l’URL directe de la publication et confirmez que la vidéo est publique avant de réessayer.`;
    if (locale === 'de') return `Wenn ${slug} auf TikTok fehlschlägt, verwenden Sie die direkte Beitrags-URL und prüfen Sie, ob das Video öffentlich ist, bevor Sie es erneut versuchen.`;
    if (locale === 'tr') return `${slug} TikTok tarafında başarısız olursa doğrudan gönderi bağlantısını kullanın ve videonun herkese açık olduğunu kontrol ettikten sonra yeniden deneyin.`;
    if (locale === 'id') return `Jika ${slug} gagal di TikTok, gunakan tautan postingan langsung dan pastikan videonya bersifat publik sebelum mencoba lagi.`;
    if (locale === 'hi') return `अगर ${slug} TikTok पर काम नहीं कर रहा है, तो सीधे पोस्ट लिंक का उपयोग करें और दोबारा कोशिश करने से पहले वीडियो के सार्वजनिक होने की पुष्टि करें।`;
    return `For ${slug} on TikTok, use a direct post URL and confirm the vídeo is public before retrying.`;
  }
  if (category === 'comparison') {
    if (locale === 'ar') return `لتقييم ${slug} بدقة، قارن بين الثبات والأمان وجودة المخرجات باستخدام الرابط نفسه في كل اختبار.`;
    if (locale === 'ja') return `${slug} を比較するときは、同じテスト URL を使い、信頼性・安全性・出力品質を同じ条件で見比べてください。`;
    if (locale === 'es') return `Para evaluar ${slug} correctamente, compara fiabilidad, seguridad y calidad usando el mismo enlace de prueba en cada herramienta.`;
    if (locale === 'pt') return `Para avaliar ${slug} corretamente, compare confiabilidade, segurança e qualidade do arquivo usando o mesmo link de teste em cada ferramenta.`;
    if (locale === 'fr') return `Pour évaluer ${slug} correctement, comparez la fiabilité, la sécurité et la qualité du fichier en utilisant le même lien de test pour chaque outil.`;
    if (locale === 'de') return `Um ${slug} sauber zu bewerten, vergleichen Sie Zuverlässigkeit, Sicherheit und Dateiqualität mit demselben Testlink für jedes Tool.`;
    if (locale === 'tr') return `${slug} ifadesini sağlıklı değerlendirmek için her araçta aynı test bağlantısını kullanarak güvenilirlik, güvenlik ve çıktı kalitesini karşılaştırın.`;
    if (locale === 'id') return `Untuk menilai ${slug} dengan tepat, bandingkan keandalan, keamanan, dan kualitas hasil dengan menggunakan tautan uji yang sama pada setiap alat.`;
    if (locale === 'hi') return `${slug} का सही आकलन करने के लिए हर टूल पर एक ही टेस्ट लिंक इस्तेमाल करके विश्वसनीयता, सुरक्षा और आउटपुट क्वालिटी की तुलना करें।`;
    return `To evaluate ${slug} correctly, compare reliability, safety, and output quality using the same test URL.`;
  }
  if (locale === 'ar') return 'تحقق من الرابط وحالة المنصة ثم أعد المحاولة باستخدام ClipKeep.';
  if (locale === 'ja') return 'URL と投稿の公開状態を確認したうえで、ClipKeep でもう一度試してください。';
  if (locale === 'es') return 'Verifica el enlace y el estado de la plataforma, luego inténtalo de nuevo con ClipKeep.';
  if (locale === 'pt') return 'Verifique o link e o estado da plataforma e depois tente novamente com o ClipKeep.';
  if (locale === 'fr') return 'Vérifiez le lien et l’état de la plateforme, puis réessayez avec ClipKeep.';
  if (locale === 'de') return 'Prüfen Sie den Link und den Status der Plattform und versuchen Sie es dann erneut mit ClipKeep.';
  if (locale === 'tr') return 'Bağlantıyı ve platform durumunu kontrol edin, ardından ClipKeep ile yeniden deneyin.';
  if (locale === 'id') return 'Periksa tautan dan status platform, lalu coba lagi lewat ClipKeep.';
  if (locale === 'hi') return 'लिंक और प्लेटफ़ॉर्म की स्थिति जाँचें, फिर ClipKeep के साथ दोबारा कोशिश करें।';
  return 'Check the URL and platform status, then retry with ClipKeep.';
}

export async function generateStaticParams() {
  return keywordArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const p = await params;
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const article = getKeywordArticle(p.slug);
  if (!article) {
    return { title: 'Blog | ClipKeep' };
  }

  const kw = article.keyword[locale];
  const base = 'https://clipkeep.net';
  const path = `/blog/${article.slug}`;
  const url = `${base}${path}${locale === 'en' ? '' : `?locale=${locale}`}`;

  return {
    title: `${kw} | ClipKeep`,
    description: buildIntro(kw, locale),
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        ja: `${base}${path}?locale=ja`,
        es: `${base}${path}?locale=es`,
        ar: `${base}${path}?locale=ar`,
        pt: `${base}${path}?locale=pt`,
        fr: `${base}${path}?locale=fr`,
        de: `${base}${path}?locale=de`,
        tr: `${base}${path}?locale=tr`,
        'x-default': `${base}${path}`,
      },
    },
  };
}

export default async function BlogKeywordPage({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const article = getKeywordArticle(p.slug);
  if (!article) notFound();

  const t = text(locale);
  const kw = article.keyword[locale];
  const intro = buildIntro(kw, locale);
  const steps = stepLines(locale);
  const fails = articleFailLines(locale, article.slug, article.category);
  const q = locale === 'en' ? '' : `?locale=${locale}`;
  const related = getRelatedKeywordArticles(article.slug, article.category, 5);
  const comparison = article.category === 'comparison' ? comparisonCriteria(locale) : null;
  const comparisonArticle = article.category === 'comparison';
  const problemArticle = isProblemKeyword(article.slug);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: kw,
    description: intro,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fails.map((f) => ({
      '@type': 'Question',
      name: f,
      acceptedAnswer: {
        '@type': 'Answer',
        text: articleFaqAnswer(locale, article.slug, article.category),
      },
    })),
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <article className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-50">{kw}</h1>
        <p className="mt-3 text-gray-700 dark:text-slate-300">{intro}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <BlogCtaLink href={`${article.toolPath}${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="header" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">
            {t.jumpTool}
          </BlogCtaLink>
          <BlogCtaLink href={`${article.supportPath}${q}`} locale={locale} slug={article.slug} ctaType="support" ctaPosition="header" className="inline-flex items-center rounded-lg border border-blue-300 px-4 py-2 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800">
            {t.jumpSupport}
          </BlogCtaLink>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.quickAnswer}</h2>
          <p className="mt-2 text-gray-700 dark:text-slate-300">{intro}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.steps}</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-gray-700 dark:text-slate-300">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-slate-950 p-4">
          <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">{t.ctaMain}</h2>
          <div className="mt-2 flex flex-col gap-2">
            <BlogCtaLink href={`${article.toolPath}${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="main" className="text-blue-700 hover:underline">{article.toolPath}</BlogCtaLink>
            <BlogCtaLink href={`${article.supportPath}${q}`} locale={locale} slug={article.slug} ctaType="support" ctaPosition="main" className="text-blue-700 hover:underline">{article.supportPath}</BlogCtaLink>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.safety}</h2>
          <p className="mt-2 text-gray-700 dark:text-slate-300">
            {locale === 'ar'
              ? 'احترم حقوق النشر وشروط المنصة. هذا المحتوى مخصص للأرشفة الشخصية المسؤولة فقط.'
              : locale === 'es'
                ? 'Respeta los derechos de autor y los términos de la plataforma. Usa este flujo solo para archivado personal responsable.'
                : 'Respect copyright and platform terms. Use this workflow for responsible personal archiving.'}
          </p>
        </section>

        {comparison && (
          <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-slate-950 p-4">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{locale === 'ar' ? 'معايير المقارنة' : locale === 'es' ? 'Criterios de comparación' : locale === 'pt' ? 'Critérios de comparação' : 'Comparison criteria'}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300">
              {comparison.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {comparisonArticle && (
          <section className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50/60 dark:border-cyan-900 dark:bg-slate-950 p-4">
            <h2 className="text-lg font-bold text-cyan-800 dark:text-cyan-300">{locale === 'ar' ? 'جرّب الأدوات حسب المنصة' : locale === 'es' ? 'Probar por plataforma' : locale === 'pt' ? 'Testar por plataforma' : 'Try by platform'}</h2>
            <p className="mt-2 text-gray-700 dark:text-slate-300">
              {locale === 'ar'
                ? 'انتقل مباشرة إلى أداة كل منصة، ثم قارن النتائج باستخدام الرابط نفسه أو السيناريو نفسه.'
                : locale === 'es'
                  ? 'Ve directo al descargador de cada plataforma y compara los resultados usando el mismo enlace o el mismo escenário.'
                  : 'Jump to each downloader and compare outputs using the same URL or scenário.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <BlogCtaLink href={`/download-twitter-vídeo${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-black px-3 py-2 text-white font-semibold hover:opacity-90">
                {t.twitterDl}
              </BlogCtaLink>
              <BlogCtaLink href={`/download-tiktok-vídeo${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-white font-semibold hover:opacity-90">
                {t.tiktokDl}
              </BlogCtaLink>
              <BlogCtaLink href={`/download-telegram-vídeo${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-sky-600 px-3 py-2 text-white font-semibold hover:bg-sky-700">
                {t.telegramDl}
              </BlogCtaLink>
            </div>
          </section>
        )}

        {problemArticle && (
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-slate-950 p-4">
            <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300">{locale === 'ar' ? 'مسار سريع لحل المشكلة' : locale === 'es' ? 'Ruta rápida de solución' : locale === 'pt' ? 'Caminho rápido de solução' : 'Quick troubleshooting path'}</h2>
            <p className="mt-2 text-gray-700 dark:text-slate-300">
              {locale === 'ar'
                ? 'إذا استمرت المشكلة، افتح دليل الحل المخصص لهذا السيناريو ثم أعد المحاولة.'
                : locale === 'es'
                  ? 'Si el problema continúa, abre la guía de solución específica para este caso y vuelve a intentarlo.'
                  : 'If the issue persists, open the dedicated solution guide for this scenário and retry.'}
            </p>
            <div className="mt-3">
              <BlogCtaLink href={`${article.supportPath}${q}`} locale={locale} slug={article.slug} ctaType="support" ctaPosition="problem" className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-white font-semibold hover:bg-amber-700">
                {t.jumpSupport}
              </BlogCtaLink>
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.fails}</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300">
            {fails.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">{t.compareHint}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.related}</h2>
          <ul className="mt-2 list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
            {related.map((r) => (
              <li key={r.slug}><Link href={`/blog/${r.slug}${q}`} className="hover:underline">{r.keyword[locale]}</Link></li>
            ))}
            <li><Link href={`/blog/guide-to-media-archiving?locale=${locale}`} className="hover:underline">{t.guideLabel}</Link></li>
            <li><Link href={`/faq${q}`} className="hover:underline">{t.faqLabel}</Link></li>
          </ul>
        </section>
      </article>
    </main>
  );
}
























