import type { DegradedDict } from '../../types';

export const es: DegradedDict = {
    title: 'Servicio limitado',
    body: 'Tráfico elevado detectado.',
    reasonLabel: 'Motivo',
    retryAfter: 'Reintentar después',
    openGuide: 'Abrir guía',
    reasons: {
      manual: 'Manual',
      error_ratio: 'Error',
      queue_wait: 'Cola',
      active_jobs: 'Tareas',
      recovered: 'Recuperado',
      none: 'Ninguno',
    },
  };
