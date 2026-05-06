import type { StatusDict } from '../../types';

export const hi: StatusDict = {
    title: "सेवा स्थिति",
    liveHealth: "लाइव API स्वास्थ्य",
    currentTitle: "वर्तमान",
    currentBody: "सभी मुख्य सेवाएं सामान्य रूप से काम कर रही हैं।",
    incidentTitle: "इंसिडेंट",
    partialDegradation: {
      title: "आंशिक गिरावट",
      body: "एक्सट्रैक्शन अनुरोधों में विफलताएं आ रही हैं। हम इसे कम करने की कोशिश कर रहे हैं।",
      nextUpdate: "अगला अपडेट: 30 मिनट के भीतर।"
    },
    scheduledMaintenance: {
      title: "अनुसूचित रखरखाव",
      body: "अनुरक्षण कार्य प्रगति पर है। रिस्पॉन्स टाइम प्रभावित हो सकता है।",
      window: "योजना: 00:00-01:00 UTC."
    },
    majorOutage: {
      title: "मेजर आउटेज",
      body: "वर्तमान में मुख्य एक्सट्रैक्शन कार्यक्षमता प्रभावित है। टीम जांच कर रही है।",
      nextUpdate: "अगला अपडेट: 15 मिनट के भीतर."
    }
  };
