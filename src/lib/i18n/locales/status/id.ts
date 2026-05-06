import type { StatusDict } from '../../types';

export const id: StatusDict = {
    title: "Status Layanan",
    liveHealth: "Kesehatan API",
    currentTitle: "Sekarang",
    currentBody: "Semua layanan inti beroperasi normal.",
    incidentTitle: "Template Insiden",
    partialDegradation: {
      title: "Degradasi Parsial",
      body: "Terjadi kesalahan pada ekstraksi. Kami sedang menanganinya.",
      nextUpdate: "Update: dalam 30 menit."
    },
    scheduledMaintenance: {
      title: "Pemeliharaan Terjadwal",
      body: "Pemeliharaan sistem sedang berlangsung.",
      window: "Rencana: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "Gangguan Utama",
      body: "Terjadi pemadaman sistem utama. Tim sedang memulihkan.",
      nextUpdate: "Update: dalam 15 menit."
    }
  };
