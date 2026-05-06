import { legalByLocale } from '../shared';
import type { LegalPageDict } from '../../types';

export const de: { privacy: LegalPageDict; terms: LegalPageDict; cookies: LegalPageDict; dmca: LegalPageDict } = legalByLocale('de');
