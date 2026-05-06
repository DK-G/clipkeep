import type { StatusDict } from '../../types';

export const fr: StatusDict = {
    title: "État des services",
    liveHealth: "Santé de l'API",
    currentTitle: "Actuel",
    currentBody: "Les services fonctionnent normalement.",
    incidentTitle: "Incidents",
    partialDegradation: {
      title: "Dégradation partielle",
      body: "Erreurs élevées sur les extractions. En cours de résolution.",
      nextUpdate: "Prochaine mise à jour : 30 min."
    },
    scheduledMaintenance: {
      title: "Maintenance programmée",
      body: "Maintenance en cours. Performances réduites.",
      window: "Fenêtre : 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Interruption majeure",
      body: "Panne générale de l'extracteur. Nos équipes sont mobilisées.",
      nextUpdate: "Prochaine mise à jour : 15 min."
    }
  };
