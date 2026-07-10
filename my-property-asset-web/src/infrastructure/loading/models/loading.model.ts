export type LoadingScope = 'global' | 'page' | 'section' | 'inline' | (string & {});

export interface LoadingScopeState {
  scope: LoadingScope;
  pending: number;
}
