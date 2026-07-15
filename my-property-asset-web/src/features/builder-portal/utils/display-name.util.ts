import { AuthUser } from '@core/auth';

export function resolveDisplayName(user: AuthUser | null): string {
  if (!user) {
    return 'there';
  }

  const metadataName =
    (user.metadata['name'] as string | undefined) ??
    (user.metadata['fullName'] as string | undefined) ??
    (user.metadata['displayName'] as string | undefined);

  if (metadataName) {
    return metadataName;
  }

  return user.email.split('@')[0];
}

export function resolveTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}
