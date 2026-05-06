import type { StatusDict } from '../../types';

export const en: StatusDict = {
    title: "Service Status",
    liveHealth: "Live API health",
    currentTitle: "Current",
    currentBody: "All core services are operating normally.",
    incidentTitle: "Incident Templates",
    partialDegradation: {
      title: "Partial Degradation",
      body: "We are experiencing elevated failures in extraction requests. Some requests may return temporary limits. We are actively mitigating this issue.",
      nextUpdate: "Next update: within 30 minutes."
    },
    scheduledMaintenance: {
      title: "Scheduled Maintenance",
      body: "Scheduled maintenance is in progress. Extraction and API response times may be temporarily affected.",
      window: "Planned window: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Major Outage",
      body: "We are currently experiencing a major outage affecting core extraction functionality. Our team is investigating and recovery actions are underway.",
      nextUpdate: "Next update: within 15 minutes."
    }
  };
