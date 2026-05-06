import type { StatusDict } from '../../types';

export const de: StatusDict = {
    title: "Systemstatus",
    liveHealth: "API-Status",
    currentTitle: "Aktuell",
    currentBody: "Alle Dienste laufen normal.",
    incidentTitle: "Vorfälle",
    partialDegradation: {
      title: "Teileinschränkung",
      body: "Erhöhte Fehlerzahlen. Wir arbeiten an einer Lösung.",
      nextUpdate: "Update in 30 Min."
    },
    scheduledMaintenance: {
      title: "Wartung",
      body: "Wartungsarbeiten werden durchgeführt.",
      window: "Zeitfenster: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Schwere Störung",
      body: "Hauptfunktionen sind offline. Team ist informiert.",
      nextUpdate: "Update in 15 Min."
    }
  };
