import { zhTW } from './zhTW';

export const DEFAULT_LOCALE = 'zh-TW';

export const translations = {
  'zh-TW': zhTW,
} as const;

export type Locale = keyof typeof translations;

export const t = translations[DEFAULT_LOCALE];
