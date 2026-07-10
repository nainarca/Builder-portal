export type NavigationContextType =
  | 'public-website'
  | 'authentication'
  | 'super-admin'
  | 'builder-portal'
  | 'tenant-portal'
  | 'partner-portal'
  | 'blank';

export interface NavigationContext {
  type: NavigationContextType;
  label: string;
}
