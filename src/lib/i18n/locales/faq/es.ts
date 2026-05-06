import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const es: FAQDict = {
    ...faqBaseEn,
    title: 'Preguntas Frecuentes',
    lastUpdated: 'Última actualización: 2026-03-19',
    items: [
      {
        question: '¿Qué es ClipKeep?',
        answer: 'ClipKeep es una herramienta web para extraer enlaces de medios desde páginas SNS compatibles para flujos de archivado personal.',
      },
      {
        question: '¿Qué plataformas están soportadas ahora?',
        answer: 'El soporte activo actual cubre Telegram, X (Twitter), TikTok, Reddit, Pinterest, Facebook, Threads, Bluesky, Lemon8, Bilibili y Discord. Instagram permanece solo en mantenimiento.',
      },
      {
        question: '¿Necesito una cuenta?',
        answer: 'No. Puedes usar el flujo de extracción sin crear una cuenta.',
      },
    ],
    stillQuestions: '¿Aún tienes preguntas?',
    contactSupport: 'Contactar soporte',
    contactText: 'Si tu pregunta no aparece aquí, contáctanos desde la página de contacto.',
  };
