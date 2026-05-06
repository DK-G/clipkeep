import { faqBaseEn } from '../shared';
import type { FAQDict } from '../../types';

export const hi: FAQDict = {
    ...faqBaseEn,
    title: 'सामान्य प्रश्न',
    lastUpdated: 'अंतिम अपडेट: 2026-03-19',
    items: [
      {
        question: 'ClipKeep क्या है?',
        answer: 'ClipKeep व्यक्तिगत आर्काइविंग वर्कफ़्लो के लिए समर्थित SNS पेजों से मीडिया लिंक निकालने का एक वेब टूल है।',
      },
      {
        question: 'अभी कौन से प्लेटफॉर्म समर्थित हैं?',
        answer: 'वर्तमान सक्रिय समर्थन में टेलीग्राम, X (ट्विटर), टिकटॉक, Reddit, Pinterest, फेसबुक, Threads, Bluesky, Lemon8, Bilibili और Discord शामिल हैं। इंस्टाग्राम केवल रखरखाव मोड में है।',
      },
      {
        question: 'क्या मुझे एक खाते की आवश्यकता है?',
        answer: 'नहीं। आप खाता बनाए बिना निष्कर्षण प्रवाह का उपयोग कर सकते हैं।',
      },
    ],
    stillQuestions: 'अभी भी प्रश्न हैं?',
    contactSupport: 'सहायता से संपर्क करें',
    contactText: 'यदि आपका प्रश्न यहाँ शामिल नहीं है, तो कृपया संपर्क पृष्ठ के माध्यम से हमसे संपर्क करें।',
  };
