import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const id: FAQDict = {
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
  };
