import { legalByLocale } from '../shared';
import type { LegalPageDict } from '../../types';

export const en: { privacy: LegalPageDict; terms: LegalPageDict; cookies: LegalPageDict; dmca: LegalPageDict } = legalByLocale('en');
