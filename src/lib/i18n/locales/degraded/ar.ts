import type { DegradedDict } from '../../types';

export const ar: DegradedDict = {
    title: 'أداة الاستخراج في وضع تقليل الأحمال',
    body: 'بعض طلبات الاستخراج محدودة مؤقتًا.',
    reasonLabel: 'السبب',
    retryAfter: 'أعد المحاولة بعد',
    openGuide: 'افتح دليل الاستعادة',
    reasons: {
      manual: 'تفعيل يدوي',
      error_ratio: 'ارتفاع معدل أخطاء المصدر',
      queue_wait: 'زمن الانتظار في الطابور مرتفع',
      active_jobs: 'عدد المهام النشطة مرتفع',
      recovered: 'تمت الاستعادة',
      none: 'تحت المراقبة',
    },
  };
