import { legalByLocale } from '../shared';
import type { LegalPageDict } from '../../types';

export const fr: { privacy: LegalPageDict; terms: LegalPageDict; cookies: LegalPageDict; dmca: LegalPageDict } = legalByLocale('fr');
