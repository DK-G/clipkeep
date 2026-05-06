import type { StatusDict } from '../../types';

export const pt: StatusDict = {
    title: "Status do Serviço",
    liveHealth: "Saúde da API",
    currentTitle: "Atual",
    currentBody: "Todos os serviços operando normalmente.",
    incidentTitle: "Incidentes",
    partialDegradation: {
      title: "Degradação Parcial",
      body: "Falhas elevadas em requisições. Estamos mitigando.",
      nextUpdate: "Novo status: em 30 min."
    },
    scheduledMaintenance: {
      title: "Manutenção Agendada",
      body: "Em progresso. Extrações podem ser lentas.",
      window: "Horário: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Instabilidade Crítica",
      body: "Falha geral nas funções de extração. Equipe investigando.",
      nextUpdate: "Novo status: em 15 min."
    }
  };
