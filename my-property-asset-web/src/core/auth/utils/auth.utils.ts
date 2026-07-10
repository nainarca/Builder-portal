import type { Session, User } from '@supabase/supabase-js';

import { AuthSessionInfo, AuthUser } from '../models/auth.model';

export function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    emailVerified: Boolean(user.email_confirmed_at),
    lastSignInAt: user.last_sign_in_at ?? undefined,
    metadata: user.user_metadata ?? {},
  };
}

export function mapSupabaseSession(session: Session | null): AuthSessionInfo | null {
  if (!session) {
    return null;
  }

  return {
    accessToken: session.access_token,
    expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now(),
    refreshToken: session.refresh_token,
  };
}

export function getSessionRemainingMs(session: AuthSessionInfo | null): number {
  if (!session) {
    return 0;
  }

  return Math.max(0, session.expiresAt - Date.now());
}

export function sanitizeReturnUrl(returnUrl: string | null | undefined, fallback: string): string {
  if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
    return fallback;
  }

  if (returnUrl.startsWith('/auth')) {
    return fallback;
  }

  return returnUrl;
}

export function mapAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Authentication failed. Please try again.';
  }

  const message = 'message' in error ? String(error.message) : '';

  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'The email or password you entered is incorrect.';
  }

  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }

  if (message.toLowerCase().includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  return message || 'Authentication failed. Please try again.';
}
