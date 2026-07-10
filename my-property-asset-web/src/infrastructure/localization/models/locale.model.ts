export interface LocaleConfiguration {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  currency: string;
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export const DEFAULT_LOCALES: LocaleConfiguration[] = [
  {
    code: 'en-US',
    name: 'English (US)',
    direction: 'ltr',
    dateFormat: 'medium',
    timeFormat: 'short',
    currency: 'USD',
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    direction: 'ltr',
    dateFormat: 'medium',
    timeFormat: 'short',
    currency: 'GBP',
  },
];
