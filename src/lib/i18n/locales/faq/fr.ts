import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const fr: FAQDict = {
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
  };
