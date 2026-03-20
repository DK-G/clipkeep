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
  if (n === 'es' || n === 'ar' || n === 'ja') return n;
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
  };
}

function buildIntro(keyword: string, locale: BlogLocale): string {
  if (locale === 'ar') return `يركّز هذا الدليل على عبارة البحث: ${keyword}، ويشرح أسرع طريقة عملية لاستخدام ClipKeep مع روابط مباشرة للأداة.`;
  if (locale === 'es') return `Esta guía está enfocada en la búsqueda "${keyword}" y explica el flujo más directo con ClipKeep, con acceso inmediato al descargador.`;
  return `This guide targets the keyword "${keyword}" and explains the fastest practical workflow with ClipKeep, including direct downloader links.`;
}

function stepLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['افتح المنشور الأصلي وانسخ الرابط.', 'انتقل إلى أداة ClipKeep المناسبة للمنصة.', 'الصق الرابط وابدأ الاستخراج.', 'احفظ الملف وتحقق من الجودة النهائية.'];
  if (locale === 'es') return ['Abre la publicación original y copia el enlace.', 'Entra en la herramienta de ClipKeep correspondiente a la plataforma.', 'Pega el enlace y ejecuta la extracción.', 'Guarda el archivo y verifica la calidad final.'];
  return ['Open the source post and copy the URL.', 'Open the matching ClipKeep tool page.', 'Paste URL and run extraction.', 'Save the file and verify quality.'];
}

function failLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['الرابط غير صالح أو غير متاح للعامة.', 'يوجد قيد مؤقت من المنصة.', 'هناك مشكلة في الاتصال أو المتصفح.'];
  if (locale === 'es') return ['La URL no es válida o no es pública.', 'La plataforma tiene una restricción temporal.', 'Hay un problema de red o del navegador.'];
  return ['Invalid or private URL.', 'Temporary platform restriction.', 'Browser or network issue.'];
}

function telegramSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'telegram-video-download': ['Post link is from a private chat.', 'The media is restricted in the channel.', 'Telegram CDN request timed out.'],
    'telegram-video-downloader-online': ['Copied the share text instead of the URL.', 'Link preview is blocked by app settings.', 'Browser extension conflicts with request headers.'],
    'telegram-video-save-method-ja': ['Used message forward link instead of source link.', 'Original post was edited and media changed.', 'Regional edge node returned stale metadata.'],
    'telegram-video-download-pc-ja': ['Desktop app copied an internal deep-link.', 'Corporate network blocks Telegram media domains.', 'Download was interrupted by antivirus proxy scan.'],
    'telegram-video-download-iphone': ['iOS copied a short redirect URL only.', 'In-app browser removed required query params.', 'Background refresh suspended the request.'],
    'telegram-video-download-android': ['Android WebView stripped the referrer.', 'Battery saver paused extraction in background.', 'Share intent delivered malformed URL encoding.'],
    'telegram-private-video-download': ['Target media is not publicly accessible.', 'Channel requires membership approval.', 'Private post permission expired.'],
    'telegram-video-download-link': ['Link points to a message without media.', 'Copied thread root URL, not media post URL.', 'URL contains unsupported tracking fragment.'],
    'telegram-save-visible-ja': ['Users confuse download logs with notifications.', 'Public channel admin can see view counts only.', 'Shared files can expose username in app UI.'],
    'telegram-video-download-bot-safe': ['Bot asks for excessive permissions.', 'Unverified bot endpoint has no policy page.', 'Bot forwards media through unknown third-party storage.'],
  };

  const es: Record<string, string[]> = {
    'telegram-video-download': ['El enlace viene de un chat privado.', 'El canal restringe ese archivo.', 'La solicitud al CDN de Telegram expiró.'],
    'telegram-video-downloader-online': ['Se copió texto del mensaje y no la URL.', 'La vista previa del enlace está bloqueada.', 'Una extensión del navegador altera cabeceras.'],
    'telegram-video-save-method-ja': ['Se usó enlace reenviado en vez del original.', 'La publicación fue editada y cambió el archivo.', 'El nodo regional devolvió metadatos antiguos.'],
    'telegram-video-download-pc-ja': ['La app de escritorio copió un deep-link interno.', 'La red corporativa bloquea dominios de medios.', 'El antivirus interrumpió la descarga.'],
    'telegram-video-download-iphone': ['iOS copió solo un enlace corto de redirección.', 'El navegador interno quitó parámetros clave.', 'La app pausó la solicitud en segundo plano.'],
    'telegram-video-download-android': ['WebView de Android eliminó el referrer.', 'Ahorro de batería pausó la extracción.', 'El intent de compartir dañó la codificación URL.'],
    'telegram-private-video-download': ['El archivo no es público.', 'El canal requiere aprobación de ingreso.', 'El permiso del post privado expiró.'],
    'telegram-video-download-link': ['El enlace apunta a un mensaje sin video.', 'Se copió la raíz del hilo y no el post.', 'La URL trae fragmentos de tracking no compatibles.'],
    'telegram-save-visible-ja': ['Se confunden registros internos con notificaciones.', 'El admin solo ve métricas públicas de vistas.', 'Archivos compartidos pueden mostrar usuario en la app.'],
    'telegram-video-download-bot-safe': ['El bot solicita permisos excesivos.', 'El bot no verificado no tiene política pública.', 'El bot reenvía archivos a almacenamiento desconocido.'],
  };

  const ar: Record<string, string[]> = {
    'telegram-video-download': ['الرابط من محادثة خاصة.', 'القناة تفرض تقييدًا على الملف.', 'انتهت مهلة طلب CDN الخاص بتليجرام.'],
    'telegram-video-downloader-online': ['تم نسخ نص الرسالة بدل الرابط.', 'معاينة الرابط محجوبة في الإعدادات.', 'إضافة المتصفح عدّلت الترويسات.'],
    'telegram-video-save-method-ja': ['استُخدم رابط مُعاد توجيهه بدل الأصلي.', 'تم تعديل المنشور وتغيّر الملف.', 'عقدة المنطقة أعادت بيانات قديمة.'],
    'telegram-video-download-pc-ja': ['تطبيق سطح المكتب نسخ رابطًا داخليًا.', 'شبكة العمل تحجب نطاقات وسائط تليجرام.', 'فحص الحماية أوقف التنزيل أثناء النقل.'],
    'telegram-video-download-iphone': ['iOS نسخ رابط تحويل قصير فقط.', 'متصفح التطبيق حذف معاملات مطلوبة.', 'التحديث الخلفي أوقف الطلب مؤقتًا.'],
    'telegram-video-download-android': ['WebView على أندرويد حذف المرجع.', 'وضع توفير البطارية أوقف الاستخراج.', 'رابط المشاركة وصل بترميز غير صحيح.'],
    'telegram-private-video-download': ['الوسائط غير متاحة للعامة.', 'القناة تتطلب موافقة عضوية.', 'انتهت صلاحية إذن المنشور الخاص.'],
    'telegram-video-download-link': ['الرابط يشير لرسالة بلا وسائط.', 'تم نسخ رابط أصل المحادثة بدل المنشور.', 'الرابط يحتوي جزء تتبع غير مدعوم.'],
    'telegram-save-visible-ja': ['يتم الخلط بين السجلات والإشعارات.', 'المشرف يرى عدّاد المشاهدات العام فقط.', 'الملفات المشتركة قد تُظهر اسم المستخدم.'],
    'telegram-video-download-bot-safe': ['البوت يطلب صلاحيات مبالغًا فيها.', 'البوت غير موثّق ولا يملك سياسة واضحة.', 'البوت يمرر الملفات عبر تخزين طرف ثالث مجهول.'],
  };

  if (locale === 'es') return es[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}


function twitterSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'how-to-download-twitter-videos': ['Tweet URL is copied from a deleted post.', 'Media is in a quote tweet and wrong URL is used.', 'Shortened t.co link failed to resolve.'],
    'twitter-video-downloader-online-free': ['Rate limit hit from repeated requests.', 'Ad-blocker blocks media request chain.', 'Copied profile URL instead of tweet URL.'],
    'twitter-video-download-iphone': ['iOS in-app browser strips required parameters.', 'Share sheet copied preview URL only.', 'Low-power mode suspended background download.'],
    'twitter-video-save-method-ja': ['User copied image tweet URL with no video.', 'Tweet has region-restricted media.', 'Temporary X edge response returned incomplete metadata.'],
    'twitter-video-save-not-working-ja': ['Tweet became private after copy.', 'Account was suspended or protected.', 'Session cookie-dependent media request failed.'],
    'twitter-video-download-android': ['Android WebView changed URL encoding.', 'Battery optimization paused extraction.', 'Network switched between Wi-Fi and mobile mid-request.'],
    'twitter-gif-download': ['GIF is delivered as MP4 and user expects GIF file.', 'Animated media variant unavailable in selected quality.', 'Post contains static image despite GIF label.'],
    'twitter-video-downloader-safe': ['User opened cloned phishing domain.', 'Browser warns mixed-content on unsafe mirror.', 'Untrusted extension injects redirect script.'],
    'twitter-video-download-no-watermark': ['Source already has creator watermark.', 'Low-quality fallback selected by mistake.', 'Tweet media variant missing in selected format.'],
    'twitter-video-download-mp4': ['Only HLS variant available for that post.', 'MP4 track blocked by transient CDN error.', 'Selected quality has no direct MP4 url.'],
    'twitter-video-download-chrome': ['Old Chrome cache serves stale script bundle.', 'Third-party cookie setting breaks media token fetch.', 'Extension conflicts with fetch interception.'],
    'twitter-save-visible-ja': ['User confuses impressions with download logs.', 'Public engagement metrics are visible, not local saves.', 'Shared repost may expose account activity publicly.'],
    'twitter-video-download-private-account': ['Protected account media is not publicly accessible.', 'Follow approval is required before media access.', 'Tweet permission changed after URL copy.'],
    'twitter-video-download-without-login': ['Guest access token expired.', 'Post requires authenticated session.', 'Age/country gate blocks unauthenticated access.'],
    'twitter-video-downloader-2026': ['Platform endpoint changed and cache is stale.', 'New anti-abuse thresholds triggered.', 'Legacy extraction path no longer supported.'],
  };

  const es: Record<string, string[]> = {
    'how-to-download-twitter-videos': ['La URL proviene de un tweet eliminado.', 'El video está en un quote tweet y se copió otro enlace.', 'El enlace t.co no se resolvió.'],
    'twitter-video-downloader-online-free': ['Se alcanzó límite temporal de solicitudes.', 'El bloqueador corta la cadena de medios.', 'Se pegó URL de perfil y no del tweet.'],
    'twitter-video-download-iphone': ['El navegador interno de iOS quita parámetros.', 'Compartir copió solo URL de vista previa.', 'Modo ahorro pausó descarga en segundo plano.'],
    'twitter-video-save-method-ja': ['Se copió un tweet sin video.', 'El video tiene restricción regional.', 'El nodo de X devolvió metadatos incompletos.'],
    'twitter-video-save-not-working-ja': ['El tweet pasó a privado.', 'La cuenta quedó protegida o suspendida.', 'Falló solicitud dependiente de sesión.'],
    'twitter-video-download-android': ['WebView alteró codificación de URL.', 'Ahorro de batería pausó la extracción.', 'Cambio de red interrumpió la solicitud.'],
    'twitter-gif-download': ['El GIF se entrega como MP4.', 'La variante animada no está en esa calidad.', 'El post marcado GIF era imagen estática.'],
    'twitter-video-downloader-safe': ['Se abrió un dominio clonado.', 'El navegador detectó contenido mixto.', 'Una extensión inyectó redirección no confiable.'],
    'twitter-video-download-no-watermark': ['La marca de agua ya existe en origen.', 'Se eligió por error una calidad baja.', 'Falta variante de formato en ese tweet.'],
    'twitter-video-download-mp4': ['Ese post solo expone variante HLS.', 'Error temporal de CDN bloqueó pista MP4.', 'La calidad elegida no trae URL MP4 directa.'],
    'twitter-video-download-chrome': ['Cache viejo de Chrome sirve scripts antiguos.', 'Cookies de terceros bloquean token.', 'Extensión interfiere con fetch.'],
    'twitter-save-visible-ja': ['Se confunden métricas públicas con guardados.', 'Se ve engagement, no descargas locales.', 'Un repost puede exponer actividad pública.'],
    'twitter-video-download-private-account': ['El contenido de cuenta protegida no es público.', 'Se requiere aprobación para acceder al video.', 'El permiso cambió tras copiar la URL.'],
    'twitter-video-download-without-login': ['Expiró token de acceso invitado.', 'El post exige sesión autenticada.', 'Bloqueo por edad/país sin login.'],
    'twitter-video-downloader-2026': ['Cambió endpoint de plataforma y hay cache viejo.', 'Nuevos umbrales antiabuso se activaron.', 'La ruta legacy de extracción ya no aplica.'],
  };

  const ar: Record<string, string[]> = {
    'how-to-download-twitter-videos': ['الرابط من تغريدة محذوفة.', 'الفيديو داخل اقتباس وتم نسخ رابط خاطئ.', 'رابط t.co لم يُفك بشكل صحيح.'],
    'twitter-video-downloader-online-free': ['تم الوصول لحد الطلبات المؤقت.', 'مانع الإعلانات قطع سلسلة التحميل.', 'تم نسخ رابط الحساب بدل التغريدة.'],
    'twitter-video-download-iphone': ['متصفح iOS الداخلي حذف معاملات مهمة.', 'تم نسخ رابط المعاينة فقط.', 'وضع توفير الطاقة أوقف التنزيل بالخلفية.'],
    'twitter-video-save-method-ja': ['تم نسخ تغريدة بلا فيديو.', 'الوسائط مقيدة حسب المنطقة.', 'عقدة X أعادت بيانات ناقصة.'],
    'twitter-video-save-not-working-ja': ['أصبحت التغريدة خاصة بعد النسخ.', 'الحساب محمي أو موقوف.', 'فشل طلب يعتمد على جلسة تسجيل.'],
    'twitter-video-download-android': ['WebView غيّر ترميز الرابط.', 'توفير البطارية أوقف الاستخراج.', 'تبدّل الشبكة أثناء الطلب.'],
    'twitter-gif-download': ['الـ GIF يُقدّم بصيغة MP4.', 'نسخة الحركة غير متاحة بالجودة المختارة.', 'المنشور المصنّف GIF كان صورة ثابتة.'],
    'twitter-video-downloader-safe': ['تم فتح نطاق مزيّف.', 'المتصفح حذّر من محتوى غير آمن.', 'إضافة غير موثوقة حقنت إعادة توجيه.'],
    'twitter-video-download-no-watermark': ['العلامة المائية موجودة من المصدر.', 'تم اختيار جودة منخفضة بالخطأ.', 'نسخة التنسيق المطلوبة غير متاحة.'],
    'twitter-video-download-mp4': ['المنشور يوفّر HLS فقط.', 'خطأ CDN مؤقت منع مسار MP4.', 'الجودة المختارة لا تحتوي رابط MP4 مباشر.'],
    'twitter-video-download-chrome': ['ذاكرة Chrome المؤقتة قديمة.', 'إعدادات الكوكيز منعت رمز الوسائط.', 'إضافة المتصفح تعارضت مع الطلب.'],
    'twitter-save-visible-ja': ['تم الخلط بين التفاعل والحفظ المحلي.', 'الظاهر هو المؤشرات العامة لا التنزيل.', 'إعادة النشر قد تُظهر النشاط علنًا.'],
    'twitter-video-download-private-account': ['وسائط الحساب المحمي ليست عامة.', 'يلزم قبول المتابعة للوصول.', 'تغيرت صلاحية الوصول بعد النسخ.'],
    'twitter-video-download-without-login': ['انتهت صلاحية وصول الزائر.', 'المنشور يتطلب تسجيل دخول.', 'قيود عمر/بلد تمنع الوصول بدون حساب.'],
    'twitter-video-downloader-2026': ['تغيّر مسار API وما زال الكاش قديمًا.', 'تم تفعيل حدود جديدة لمكافحة الإساءة.', 'المسار القديم للاستخراج لم يعد مدعومًا.'],
  };

  if (locale === 'es') return es[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function tiktokSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'tiktok-video-download-no-watermark': ['Original upload already has baked-in watermark.', 'Selected variant falls back to branded stream.', 'Post switched to restricted distribution mode.'],
    'tiktok-downloader-without-watermark-online': ['Shared link points to profile, not video.', 'Anti-bot challenge interrupted media fetch.', 'Region edge returned temporary 403 for media.'],
    'tiktok-video-save-method-ja': ['Copied short link without resolving final URL.', 'Video was replaced after repost edit.', 'The selected post is image carousel, not video.'],
    'tiktok-video-save-not-working-ja': ['Post was removed or made private.', 'Account visibility changed after link copy.', 'Temporary platform throttle blocked extraction.'],
    'download-tiktok-video-hd': ['HD variant is unavailable for this upload.', 'Source video was originally low resolution.', 'Bandwidth adaptation selected lower bitrate stream.'],
    'tiktok-download-mp4': ['Only segmented stream is exposed for this post.', 'MP4 mux step failed due transient timeout.', 'Chosen quality has no direct MP4 rendition.'],
    'save-tiktok-video-iphone': ['In-app browser strips required query params.', 'iOS share copied preview URL only.', 'Background task was paused by low-power mode.'],
    'tiktok-video-download-android': ['Android intent delivered malformed URL.', 'WebView blocked redirect chain for media.', 'Battery optimization paused extraction task.'],
    'tiktok-downloader-safe': ['User opened cloned phishing mirror.', 'Injected script from extension changed destination.', 'TLS warning ignored on untrusted domain.'],
    'tiktok-video-downloader-free': ['Free endpoint hit temporary quota ceiling.', 'Burst retries triggered anti-abuse cooldown.', 'Public CDN path rotated during request.'],
    'tiktok-video-download-private': ['Private account content is not publicly accessible.', 'Follow approval required before media access.', 'Permission changed between copy and extraction.'],
    'tiktok-save-visible-ja': ['Users confuse view metrics with local saves.', 'Platform can show engagement, not device download.', 'Re-share activity may expose account actions.'],
    'how-to-save-tiktok-without-watermark': ['No-watermark variant unavailable for this post.', 'Selected link references slideshow content.', 'Third-party blocker removed required request headers.'],
    'tiktok-video-downloader-2026': ['Platform endpoint changed and cache is stale.', 'New anti-abuse threshold temporarily blocks requests.', 'Legacy extraction route is deprecated.'],
    'tiktok-video-link-download': ['Link targets channel/home, not specific post.', 'Short URL not expanded to final media URL.', 'Tracking fragment broke parser normalization.'],
  };

  const es: Record<string, string[]> = {
    'tiktok-video-download-no-watermark': ['El video ya trae marca de agua en origen.', 'La variante elegida cae a stream con marca.', 'El post cambió a distribución restringida.'],
    'tiktok-downloader-without-watermark-online': ['El enlace apunta al perfil, no al video.', 'El desafío anti-bot interrumpió la carga.', 'El nodo regional devolvió 403 temporal.'],
    'tiktok-video-save-method-ja': ['Se copió enlace corto sin resolver URL final.', 'El video cambió tras edición del repost.', 'El post es carrusel de imágenes, no video.'],
    'tiktok-video-save-not-working-ja': ['El post fue eliminado o privado.', 'Cambió visibilidad de la cuenta.', 'Límite temporal de plataforma bloqueó extracción.'],
    'download-tiktok-video-hd': ['No existe variante HD para ese video.', 'El original era de baja resolución.', 'La red forzó bitrate más bajo.'],
    'tiktok-download-mp4': ['Ese post solo expone stream segmentado.', 'Falló el mux a MP4 por timeout.', 'La calidad elegida no tiene MP4 directo.'],
    'save-tiktok-video-iphone': ['El navegador interno quita parámetros clave.', 'iOS copió solo URL de vista previa.', 'Modo ahorro pausó tarea en segundo plano.'],
    'tiktok-video-download-android': ['Intent de Android entregó URL mal codificada.', 'WebView bloqueó cadena de redirecciones.', 'Ahorro de batería pausó la extracción.'],
    'tiktok-downloader-safe': ['Se abrió un mirror clonado.', 'Una extensión alteró el destino del script.', 'Se ignoró advertencia TLS del dominio.'],
    'tiktok-video-downloader-free': ['El endpoint free alcanzó cuota temporal.', 'Reintentos activaron enfriamiento antiabuso.', 'La ruta CDN pública rotó durante la solicitud.'],
    'tiktok-video-download-private': ['Contenido privado no es accesible públicamente.', 'Se requiere aprobación de seguimiento.', 'Permiso cambió entre copia y extracción.'],
    'tiktok-save-visible-ja': ['Se confunden vistas con guardado local.', 'La plataforma muestra engagement, no descargas.', 'Recompartir puede exponer actividad pública.'],
    'how-to-save-tiktok-without-watermark': ['No hay variante sin marca en ese post.', 'El enlace es de slideshow.', 'Bloqueador eliminó cabeceras requeridas.'],
    'tiktok-video-downloader-2026': ['Cambió endpoint y hay cache obsoleto.', 'Nuevo umbral antiabuso bloquea temporalmente.', 'Ruta legacy de extracción quedó obsoleta.'],
    'tiktok-video-link-download': ['El enlace va a inicio/canal, no al post.', 'URL corta no se expandió al destino final.', 'Fragmento de tracking rompió el parser.'],
  };

  const ar: Record<string, string[]> = {
    'tiktok-video-download-no-watermark': ['الفيديو يحتوي علامة مائية من المصدر.', 'النسخة المختارة عادت لمسار بعلامة.', 'تم تقييد توزيع المنشور.'],
    'tiktok-downloader-without-watermark-online': ['الرابط يشير للملف الشخصي لا الفيديو.', 'اختبار مكافحة البوت أوقف الطلب.', 'عقدة المنطقة أعادت 403 مؤقتًا.'],
    'tiktok-video-save-method-ja': ['تم نسخ رابط قصير دون حل الرابط النهائي.', 'تم تعديل الفيديو بعد إعادة النشر.', 'المنشور عبارة عن صور وليس فيديو.'],
    'tiktok-video-save-not-working-ja': ['تم حذف المنشور أو جعله خاصًا.', 'تغيّرت رؤية الحساب بعد النسخ.', 'حد مؤقت من المنصة منع الاستخراج.'],
    'download-tiktok-video-hd': ['نسخة HD غير متاحة لهذا الفيديو.', 'المصدر الأصلي منخفض الدقة.', 'التكيّف الشبكي اختار معدل أقل.'],
    'tiktok-download-mp4': ['المنشور يوفّر بثًا مقسمًا فقط.', 'فشل تحويل MP4 بسبب مهلة.', 'الجودة المختارة بلا رابط MP4 مباشر.'],
    'save-tiktok-video-iphone': ['متصفح التطبيق حذف معاملات مطلوبة.', 'iOS نسخ رابط المعاينة فقط.', 'توفير الطاقة أوقف المهمة بالخلفية.'],
    'tiktok-video-download-android': ['رابط Android وصل بترميز خاطئ.', 'WebView حجب سلسلة التحويل.', 'توفير البطارية أوقف الاستخراج.'],
    'tiktok-downloader-safe': ['تم فتح نسخة مزيّفة للموقع.', 'إضافة متصفح غيّرت وجهة السكربت.', 'تم تجاهل تحذير TLS لنطاق غير موثوق.'],
    'tiktok-video-downloader-free': ['نسخة free وصلت حد الحصة المؤقت.', 'تكرار الطلبات فعّل فترة تبريد.', 'مسار CDN تغيّر أثناء الطلب.'],
    'tiktok-video-download-private': ['المحتوى الخاص غير متاح للعامة.', 'يلزم قبول المتابعة للوصول.', 'تغيّرت الصلاحية بين النسخ والاستخراج.'],
    'tiktok-save-visible-ja': ['تم الخلط بين المشاهدات والحفظ المحلي.', 'المنصة تعرض التفاعل لا التنزيل.', 'إعادة المشاركة قد تُظهر النشاط.'],
    'how-to-save-tiktok-without-watermark': ['لا توجد نسخة بدون علامة لهذا المنشور.', 'الرابط يخص عرض شرائح لا فيديو.', 'مانع خارجي حذف ترويسات مطلوبة.'],
    'tiktok-video-downloader-2026': ['تغيّر مسار المنصة والكاش قديم.', 'حدود مكافحة الإساءة الجديدة فعّالة.', 'مسار الاستخراج القديم لم يعد صالحًا.'],
    'tiktok-video-link-download': ['الرابط لا يشير إلى منشور محدد.', 'الرابط القصير لم يُوسّع للنهاية.', 'جزء تتبع أفسد تحليل الرابط.'],
  };

  if (locale === 'es') return es[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function comparisonSpecificFailLines(locale: BlogLocale, slug: string): string[] | null {
  const en: Record<string, string[]> = {
    'best-twitter-video-downloader-2026': ['Comparison used outdated tool versions.', 'No clear reliability criteria was applied.', 'Test links were not identical across tools.'],
    'best-tiktok-downloader-without-watermark': ['Test mixed no-watermark and standard outputs.', 'Quality score ignored source bitrate.', 'Safety checks were skipped for one candidate.'],
    'safest-video-downloader-sites': ['Policy pages were missing at evaluation time.', 'No domain trust check was performed.', 'Ad-behavior risk was not weighted.'],
    'twitter-video-downloader-not-working': ['Root cause mixed network and platform errors.', 'No retry policy in troubleshooting steps.', 'Users tested with invalid tweet URLs.'],
    'tiktok-downloader-not-working': ['No distinction between private and public posts.', 'Rate-limit symptoms were misread as bugs.', 'Local browser extensions were not isolated.'],
    'telegram-video-download-not-working': ['Private chat links were tested as public.', 'Channel access rules were ignored.', 'CDN timeout and permission errors were merged.'],
    'is-video-downloader-legal': ['Jurisdiction differences were not separated.', 'Personal archive vs redistribution was mixed.', 'Platform ToS was not mapped to use case.'],
    'video-downloader-safe-or-not': ['Security criteria omitted script provenance.', 'No malware/adware reputation checks.', 'No HTTPS/TLS validation in checklist.'],
    'free-video-downloader-online-comparison': ['Free-tier limits were not normalized.', 'Ad load impact was not measured.', 'Speed tests ran on inconsistent networks.'],
    'top-5-video-downloader-tools': ['Ranking factors were undefined.', 'Scoring weights changed during review.', 'No reproducible test protocol was provided.'],
  };

  const es: Record<string, string[]> = {
    'best-twitter-video-downloader-2026': ['Se compararon versiones desactualizadas.', 'Faltaron criterios claros de fiabilidad.', 'No se usaron enlaces idénticos para pruebas.'],
    'best-tiktok-downloader-without-watermark': ['Se mezclaron salidas con y sin marca.', 'La calidad ignoró bitrate de origen.', 'Se omitió validación de seguridad en un candidato.'],
    'safest-video-downloader-sites': ['Faltaban páginas de política al evaluar.', 'No hubo revisión de confianza de dominio.', 'No se ponderó el riesgo publicitario.'],
    'twitter-video-downloader-not-working': ['Se mezclaron fallos de red y plataforma.', 'No había política de reintento.', 'Se probaron URLs inválidas de tweet.'],
    'tiktok-downloader-not-working': ['No se separó privado vs público.', 'Rate-limit se interpretó como bug.', 'No se aisló el impacto de extensiones.'],
    'telegram-video-download-not-working': ['Se probó enlace privado como si fuera público.', 'Se ignoraron reglas de acceso del canal.', 'Timeout CDN y permisos se mezclaron.'],
    'is-video-downloader-legal': ['No se separó por jurisdicción.', 'Archivo personal y redistribución se mezclaron.', 'No se mapeó ToS al caso de uso.'],
    'video-downloader-safe-or-not': ['Faltó revisar procedencia de scripts.', 'Sin chequeos de reputación malware/adware.', 'Sin validación HTTPS/TLS en la lista.'],
    'free-video-downloader-online-comparison': ['No se normalizaron límites de planes free.', 'No se midió impacto de carga de anuncios.', 'Pruebas de velocidad con redes distintas.'],
    'top-5-video-downloader-tools': ['Factores de ranking no definidos.', 'Pesos cambiaron durante revisión.', 'Sin protocolo reproducible de prueba.'],
  };

  const ar: Record<string, string[]> = {
    'best-twitter-video-downloader-2026': ['تمت المقارنة بإصدارات قديمة.', 'لا توجد معايير ثبات واضحة.', 'لم تُستخدم روابط متطابقة بين الأدوات.'],
    'best-tiktok-downloader-without-watermark': ['تم خلط نتائج بعلامة وبدون علامة.', 'تقييم الجودة تجاهل معدل البت الأصلي.', 'فحوص الأمان لم تُطبق على كل الأدوات.'],
    'safest-video-downloader-sites': ['صفحات السياسات كانت ناقصة وقت التقييم.', 'لم يتم فحص موثوقية النطاق.', 'لم يُحسب خطر الإعلانات بشكل كافٍ.'],
    'twitter-video-downloader-not-working': ['تم خلط أخطاء الشبكة والمنصة.', 'لا توجد سياسة إعادة محاولة.', 'تم الاختبار بروابط تغريدات غير صالحة.'],
    'tiktok-downloader-not-working': ['لم يتم فصل العام عن الخاص.', 'تم تفسير حد الطلبات كخلل.', 'لم يتم عزل تأثير إضافات المتصفح.'],
    'telegram-video-download-not-working': ['تم اختبار روابط خاصة كأنها عامة.', 'تم تجاهل قواعد وصول القناة.', 'تم دمج أخطاء المهلة والصلاحية.'],
    'is-video-downloader-legal': ['لم يتم التفريق حسب الولاية القضائية.', 'تم خلط الأرشفة الشخصية مع إعادة النشر.', 'لم تتم مطابقة شروط المنصة مع الاستخدام.'],
    'video-downloader-safe-or-not': ['معايير الأمان لم تشمل مصدر السكربت.', 'لا فحوص لسمعة البرمجيات الضارة.', 'لا تحقق HTTPS/TLS ضمن القائمة.'],
    'free-video-downloader-online-comparison': ['حدود النسخ المجانية غير موحّدة.', 'تأثير كثافة الإعلانات غير مقاس.', 'اختبارات السرعة على شبكات مختلفة.'],
    'top-5-video-downloader-tools': ['عوامل الترتيب غير محددة.', 'أوزان التقييم تغيّرت أثناء المراجعة.', 'لا يوجد بروتوكول اختبار قابل للتكرار.'],
  };

  if (locale === 'es') return es[slug] || null;
  if (locale === 'ar') return ar[slug] || null;
  return en[slug] || null;
}

function comparisonCriteria(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['الموثوقية: ثبات الاستخراج وتكرار النجاح.', 'الأمان: سياسة واضحة واتصال HTTPS وتبعية سكربت معروفة.', 'الجودة: الحفاظ على الدقة والصوت دون فقد غير ضروري.'];
  if (locale === 'es') return ['Fiabilidad: estabilidad y tasa de éxito repetible.', 'Seguridad: política clara, HTTPS y scripts verificables.', 'Calidad: conservar resolución y audio sin pérdida innecesaria.'];
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
    if (locale === 'es') return `Para resolver ${slug}, verifica que la URL sea pública y válida, y vuelve a intentarlo después de recargar la página.`;
    return `For ${slug}, confirm the URL is public and valid, then retry after a fresh page load.`;
  }
  if (category === 'twitter') {
    if (locale === 'ar') return `لمعالجة ${slug} على X، استخدم رابط التغريدة المباشر وتحقق من حالة الحساب قبل إعادة المحاولة.`;
    if (locale === 'es') return `Para ${slug} en X, usa la URL directa del tuit y confirma el estado de la cuenta antes de reintentar.`;
    return `For ${slug} on X, use a direct tweet URL and verify account visibility before retrying.`;
  }
  if (category === 'tiktok') {
    if (locale === 'ar') return `لمعالجة ${slug} على TikTok، استخدم رابط المنشور المباشر وتأكد من أن الفيديو عام قبل إعادة المحاولة.`;
    if (locale === 'es') return `Para ${slug} en TikTok, usa la URL directa de la publicación y confirma que el video sea público antes de reintentar.`;
    return `For ${slug} on TikTok, use a direct post URL and confirm the video is public before retrying.`;
  }
  if (category === 'comparison') {
    if (locale === 'ar') return `لتقييم ${slug} بدقة، قارن بين الثبات والأمان وجودة المخرجات باستخدام الرابط نفسه في كل اختبار.`;
    if (locale === 'es') return `Para evaluar ${slug} correctamente, compara fiabilidad, seguridad y calidad usando el mismo enlace de prueba en cada herramienta.`;
    return `To evaluate ${slug} correctly, compare reliability, safety, and output quality using the same test URL.`;
  }
  if (locale === 'ar') return 'تحقق من الرابط وحالة المنصة ثم أعد المحاولة باستخدام ClipKeep.';
  if (locale === 'es') return 'Verifica el enlace y el estado de la plataforma, luego inténtalo de nuevo con ClipKeep.';
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
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{locale === 'ar' ? 'معايير المقارنة' : locale === 'es' ? 'Criterios de comparación' : 'Comparison criteria'}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300">
              {comparison.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {comparisonArticle && (
          <section className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50/60 dark:border-cyan-900 dark:bg-slate-950 p-4">
            <h2 className="text-lg font-bold text-cyan-800 dark:text-cyan-300">{locale === 'ar' ? 'جرّب الأدوات حسب المنصة' : locale === 'es' ? 'Probar por plataforma' : 'Try by platform'}</h2>
            <p className="mt-2 text-gray-700 dark:text-slate-300">
              {locale === 'ar'
                ? 'انتقل مباشرة إلى أداة كل منصة، ثم قارن النتائج باستخدام الرابط نفسه أو السيناريو نفسه.'
                : locale === 'es'
                  ? 'Ve directo al descargador de cada plataforma y compara los resultados usando el mismo enlace o el mismo escenario.'
                  : 'Jump to each downloader and compare outputs using the same URL or scenario.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <BlogCtaLink href={`/download-twitter-video${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-black px-3 py-2 text-white font-semibold hover:opacity-90">
                {t.twitterDl}
              </BlogCtaLink>
              <BlogCtaLink href={`/download-tiktok-video${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-white font-semibold hover:opacity-90">
                {t.tiktokDl}
              </BlogCtaLink>
              <BlogCtaLink href={`/download-telegram-video${q}`} locale={locale} slug={article.slug} ctaType="tool" ctaPosition="compare" className="inline-flex items-center rounded-lg bg-sky-600 px-3 py-2 text-white font-semibold hover:bg-sky-700">
                {t.telegramDl}
              </BlogCtaLink>
            </div>
          </section>
        )}

        {problemArticle && (
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-slate-950 p-4">
            <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300">{locale === 'ar' ? 'مسار سريع لحل المشكلة' : locale === 'es' ? 'Ruta rápida de solución' : 'Quick troubleshooting path'}</h2>
            <p className="mt-2 text-gray-700 dark:text-slate-300">
              {locale === 'ar'
                ? 'إذا استمرت المشكلة، افتح دليل الحل المخصص لهذا السيناريو ثم أعد المحاولة.'
                : locale === 'es'
                  ? 'Si el problema continúa, abre la guía de solución específica para este caso y vuelve a intentarlo.'
                  : 'If the issue persists, open the dedicated solution guide for this scenario and retry.'}
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
























