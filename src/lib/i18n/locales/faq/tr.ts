import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const tr: FAQDict = {
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
  };
