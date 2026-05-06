import type { DegradedDict } from '../../types';

export const pt: DegradedDict = {
    title: 'Serviço Limitado',
    body: 'Alta demanda detectada.',
    reasonLabel: 'Motivo',
    retryAfter: 'Tentar após',
    openGuide: 'Abrir guia',
    reasons: {
      manual: 'Manual',
      error_ratio: 'Erro',
      queue_wait: 'Fila',
      active_jobs: 'Jobs',
      recovered: 'Recuperado',
      none: 'Nada',
    },
  };
