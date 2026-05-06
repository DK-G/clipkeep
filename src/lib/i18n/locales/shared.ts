import type { Locale, FAQDict, LegalPageDict, LegalSection, AboutDict, ContactDict } from '../types';

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

const aboutBaseEn: AboutDict = {
  title: 'About ClipKeep',
  body: 'ClipKeep helps you organize and preserve publicly shared media from supported social platforms. We focus on practical workflows for personal archiving, research, and reference use.',
  visionTitle: 'What We Aim For',
  visionBody: 'We design ClipKeep so users can keep important online media accessible over time, even when platform interfaces or content availability change.',
  whyUsTitle: 'How ClipKeep Works',
  whyUsBody: 'ClipKeep processes public links and focuses on clear extraction flows. The service is built for reliability and consistent response performance.',
  projectNote: 'ClipKeep is built around utility, transparency, and stable SNS archiving workflows.',
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

export { faqBaseEn, aboutBaseEn, contactBaseEn, legalByLocale };
