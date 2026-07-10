export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  lastSignInAt?: string;
  metadata: Record<string, unknown>;
}

export interface AuthSessionInfo {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
}

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSessionInfo | null;
  loading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
}
