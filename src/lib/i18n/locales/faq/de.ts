import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const de: FAQDict = {
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
  };
