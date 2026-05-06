import type { StatusDict } from '../../types';

export const es: StatusDict = {
    title: "Estado del servicio",
    liveHealth: "Salud de la API",
    currentTitle: "Actual",
    currentBody: "Servicios operando correctamente.",
    incidentTitle: "Incidentes",
    partialDegradation: {
      title: "Degradación parcial",
      body: "Elevados errores en la extracción. Estamos mitigando el problema.",
      nextUpdate: "Próxima actualización: en 30 min."
    },
    scheduledMaintenance: {
      title: "Mantenimiento programado",
      body: "Mantenimiento en curso. Tiempos de respuesta afectados.",
      window: "Ventana: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Corte mayor",
      body: "Experimentamos un corte importante. Recovery en curso.",
      nextUpdate: "Próxima actualización: en 15 min."
    }
  };
