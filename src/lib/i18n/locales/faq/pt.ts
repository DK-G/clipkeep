import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const pt: FAQDict = {
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
  };
