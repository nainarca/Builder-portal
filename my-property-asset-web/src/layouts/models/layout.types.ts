export type LayoutType = 'public' | 'authenticated' | 'super-admin' | 'builder-portal' | 'blank';

export type ThemeMode = 'light' | 'dark' | 'auto' | 'system';

export interface LayoutRouteData {
  layout?: LayoutType;
  pageTitle?: string;
  blankPageCode?: number;
}
