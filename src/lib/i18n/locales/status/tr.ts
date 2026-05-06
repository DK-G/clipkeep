import type { StatusDict } from '../../types';

export const tr: StatusDict = {
    title: "Hizmet Durumu",
    liveHealth: "API Sağlığı",
    currentTitle: "Güncel",
    currentBody: "Tüm servisler normal çalışıyor.",
    incidentTitle: "Olaylar",
    partialDegradation: {
      title: "Kısmi Yavaşlama",
      body: "Ayıklama hataları artmış durumda. Müdahale ediliyor.",
      nextUpdate: "Sonraki güncelleme: 30 dk içinde."
    },
    scheduledMaintenance: {
      title: "Planlı Bakım",
      body: "Bakım çalışması sürüyor. Hız etkilenebilir.",
      window: "Zaman dilimi: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Büyük Kesinti",
      body: "Ana ayıklama motoru devre dışı. Kurtarma işlemi sürüyor.",
      nextUpdate: "Sonraki güncelleme: 15 dk içinde."
    }
  };
